# Angular 19 → React migration record

`COG-GTM/angular-testing-course` was migrated from Angular 19 to React 19 in three waves: the foundation
([#72](https://github.com/COG-GTM/angular-testing-course/pull/72)), four parallel feature ports
([#73](https://github.com/COG-GTM/angular-testing-course/pull/73) Home,
[#74](https://github.com/COG-GTM/angular-testing-course/pull/74) toolbar/About/async examples,
[#75](https://github.com/COG-GTM/angular-testing-course/pull/75) card list + edit dialog,
[#76](https://github.com/COG-GTM/angular-testing-course/pull/76) course page), and an integration wave that
moved the React app (developed in `react-app/`) to the repo root and deleted the Angular app, Karma/Jasmine,
Cypress and tslint. This file records the stack mapping, the module API, the intentional parity decisions and
the traps found along the way. Setup and commands are in the [README](./README.md).

## Stack

| Concern | Angular (legacy) | React |
| --- | --- | --- |
| Build / dev server | Angular CLI 19 | Vite 8 (`@vitejs/plugin-react` 6) |
| Framework | Angular 19 | React 19, TypeScript 5.9 (strict) |
| Routing / resolver | `RouterModule`, `courseResolver` | React Router 7 data router, `courseLoader` |
| UI kit | Angular Material 19 (M2 theme) | MUI 7 (`@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`) |
| Datepicker | `mat-datepicker` + moment | `@mui/x-date-pickers` 8 + `dayjs` (`AdapterDayjs`) |
| HTTP | `HttpClient` (Observables) | `fetch` (Promises) in `coursesService` |
| DI | `providers` / `TestBed.inject` | `CoursesServiceProvider` / `useCoursesService()` |
| Unit tests | Karma + Jasmine | Vitest 4 + jsdom 29 + Testing Library (`react`, `user-event`, `jest-dom`) |
| HTTP mocking | `HttpTestingController` | MSW 2 (`msw/node`) |
| Time control | `fakeAsync` / `tick` / `flush` | `vi.useFakeTimers()` / `vi.advanceTimersByTime()` / `vi.runAllTimers()` |
| Observables in tests | rxjs 6 | `rxjs` 7 (devDependency, only for the ported `async-examples` Observable case) |
| E2E | Cypress 9 | Playwright (`e2e/`, Chromium, `page.route` mocks + `e2e/fixtures/`) |
| Lint | tslint | ESLint 10 flat config (`typescript-eslint`, `react-hooks`, `react-refresh`) |

Node `>=20.19` locally (Vite 8 / ESLint 10 / jsdom 29); CI uses Node 22.

## Module API

All paths are relative to `src/`.

### Models
- `courses/model/course.ts` → `export interface Course { id; seqNo; titles: { description; longDescription? }; iconUrl; uploadedImageUrl; courseListIcon; category; lessonsCount }`
- `courses/model/lesson.ts` → `export interface Lesson { id; description; duration; seqNo; courseId }`

### Services (`courses/services/`, barrel `courses/services/index.ts`)
```ts
// coursesService.ts
export interface RequestOptions { signal?: AbortSignal }
export type SortOrder = 'asc' | 'desc';
export interface CoursesService {
  findCourseById(id: number, opts?: RequestOptions): Promise<Course>;          // GET /api/courses/:id
  findAllCourses(opts?: RequestOptions): Promise<Course[]>;                   // GET /api/courses → unwraps payload
  saveCourse(id: number, changes: Partial<Course>, opts?: RequestOptions): Promise<Course>; // PUT /api/courses/:id, JSON body
  findLessons(courseId: number, filter?: string /* '' */, sortOrder?: SortOrder /* 'asc' */,
              pageNumber?: number /* 0 */, pageSize?: number /* 3 */, opts?: RequestOptions): Promise<Lesson[]>; // GET /api/lessons?courseId&filter&sortOrder&pageNumber&pageSize → unwraps payload
}
export const coursesService: CoursesService;   // fetch-based default
export class HttpError extends Error { status: number; statusText: string; url: string; body: unknown } // thrown on non-2xx (re-exported from httpError.ts)

// CoursesServiceContext.tsx
export function CoursesServiceProvider(props: { value?: CoursesService; children: ReactNode }): JSX.Element; // default value = coursesService
export function useCoursesService(): CoursesService;

// courseLoader.ts
export const courseLoader: (args: LoaderFunctionArgs) => Promise<Course>; // = courseResolver; throws HttpError(404) if the API returns no course
export function createCourseLoader(service: CoursesService): typeof courseLoader;

// loggerService.ts / calculatorService.ts
export class LoggerService { log(message: string): void }
export const loggerService: LoggerService;
export class CalculatorService { constructor(logger: LoggerService); add(n1, n2): number; subtract(n1, n2): number } // each logs once
export const calculatorService: CalculatorService;
```

Components **must** obtain the service via `useCoursesService()` (never import `coursesService` directly),
so tests can inject a spy object exactly like Angular's `jasmine.createSpyObj` + `providers`.
`findCourseById` resolves `null` for an empty 2xx body (Angular `HttpClient` parity); the loader turns that into a 404.

### Common (`courses/common/`)
- `sortCoursesBySeqNo.ts` → `export function sortCoursesBySeqNo(c1: Course, c2: Course): number`
- `setupTestData.ts` → `export function setupCourses(): Course[]` (= `Object.values(COURSES).sort(sortCoursesBySeqNo)` from `../../../server/db-data`, the single source of test data). Import `COURSES`, `LESSONS`, `findLessonsForCourse`, `findCourseById` from `server/db-data` directly when you need more.
- `testUtils.tsx`:
  - `renderWithProviders(ui, { coursesService?, route? = '/', path? = '*', loader?, routes?, ...renderOptions })` → RTL result + `router` (memory data router). Wraps MUI theme + `LocalizationProvider` (dayjs) + `CoursesServiceProvider` + `RouterProvider`. With a `loader` the first render is async: use `findBy*`.
  - `createCoursesServiceSpy()` → `{ findCourseById, findAllCourses, saveCourse, findLessons }` as typed `vi.fn()`s.
  - `click(el)`, `ButtonClickEvents` (port of the Angular helper; prefer `userEvent`).

### App shell (foundation-owned)
- `AppProviders.tsx` → `AppProviders({ coursesService?, children })` (theme + LocalizationProvider + CoursesServiceProvider).
- `router.tsx` → `routes: RouteObject[]`, `createAppRouter()`, `AppLayout` (`<AppToolbar/>` + `<Outlet/>`), `RouteErrorBoundary`.
  Routes: `/` Home, `/about` About, `/courses/:id` CoursePage (`loader: courseLoader`), `*` → `redirect('/')`.
- `theme.ts` → `theme` (primary teal 500, secondary red A200, Roboto, light, white background).
- `styles.css` → `body { margin: 0 }`, Roboto, `.container { max-width: 400px; margin: 0 auto }`, `.mat-elevation-z7`, `.mat-elevation-z10`. No `CssBaseline` (Angular has no reset).
- `main.tsx` → `AppProviders` + `RouterProvider`.

### Test infrastructure (`test/`)
- `test/setupTests.ts` (Vitest setup): jest-dom matchers, MSW `server.listen({ onUnhandledRequest: 'error' })`, `resetHandlers` + RTL `cleanup` after each test.
- `test/server.ts` → `export const server` (`setupServer(...handlers)`).
- `test/handlers.ts` → `export const handlers` mirroring the Express API from `server/db-data` (no 1 s lessons delay). Override per test with `server.use(...)`.

### Feature components
| Path | Export |
| --- | --- |
| `app/AppToolbar.tsx` (barrel `app/index.ts`) | `export function AppToolbar()` — teal toolbar, COURSES → `/`, ABOUT → `/about` |
| `about/About.tsx` (barrel `about/index.ts`) | `export function About()` |
| `courses/home/Home.tsx` (barrel) | `export function Home()` |
| `courses/courses-card-list/CoursesCardList.tsx` (barrel) | `export interface CoursesCardListProps { courses: Course[]; onCourseEdited?: () => void }`, `export function CoursesCardList(props: CoursesCardListProps)` |
| `courses/course-dialog/CourseDialog.tsx` (barrel) | `export interface CourseDialogResult { description: string; category: string; releasedAt: string /* ISO date */; longDescription: string }`, `export interface CourseDialogProps { open: boolean; course: Course; onClose: (result?: CourseDialogResult) => void }`, `export function CourseDialog(props: CourseDialogProps)` — the real dialog calls `saveCourse` itself and closes with the form value |
| `courses/course/CoursePage.tsx` (barrel) | `export function CoursePage()` — reads the course with `useLoaderData()` |
| `testing-examples/asyncExamples.test.ts` | Port of `async-examples.spec.ts` |

`router.tsx` imports only from the barrels.

## Test conventions
- File names: `*.test.ts(x)` next to the code (Angular `*.spec.ts` → `*.test.ts`). Keep every Angular `it(...)` case and its intent; name any deliberate deviation in the test.
- Query by role/label/text (`getByRole('tab', { name: ... })`) over CSS classes; `.mat-*` selectors from the Angular specs map to roles.
- Render through `renderWithProviders`. Inject services with `createCoursesServiceSpy()` and `coursesService: spy` — no `vi.mock` of service modules.
- For HTTP-level behaviour use MSW (`server.use(http.get(...))`). Unhandled requests fail the test.
- `fakeAsync`/`tick`/`flush` → `vi.useFakeTimers()` / `vi.advanceTimersByTime(ms)` / `vi.runAllTimers()`; always `vi.useRealTimers()` in `afterEach`. With fake timers use `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` and wrap timer advances that update state in `act`.
- Vitest config: `globals: true`, `restoreMocks: true`, `css: false`.

## Integration and e2e tests
- `src/router.test.tsx` renders the real routes (no `vi.mock` of feature barrels) against MSW: Home → VIEW COURSE → course page, EDIT → Save → list reloads (stateful MSW API), About, unknown route → `/`, unknown course → "Course not found".
- `e2e/home.spec.ts` is the port of `cypress/integration/home.test.js` (same two case names, `courses.json` fixture).
- `e2e/course.spec.ts` (VIEW COURSE, spinner, paging, page size, sort, search), `e2e/editDialog.spec.ts` (Save with non-ASCII text, Close), `e2e/smoke.spec.ts` (layout, toolbar mouse and keyboard navigation, one `GET /api/courses` per production load, redirects). `e2e/mockApi.ts` mocks `/api/**` with the Cypress fixtures and `server/db-data` lessons, using the same filter/sort/paging as `server/search-lessons.route.ts`.

## Intentional parity decisions (kept from legacy)
- **Fonts**: `index.html` loads `family=Roboto|Roboto+Mono:300` exactly like legacy `src/index.html`, i.e. only the Roboto 400 face. Angular Material's weight-500 text (tabs, toolbar, buttons, card titles, table headers) therefore renders at 400 in both apps. Some components state `fontWeight: 500` (the Material spec value) and some `400`; with only 400 loaded they render the same.
- **Lessons search** reloads on every debounced keyup (150 ms) even if the value is unchanged: legacy `distinctUntilChanged()` compares `KeyboardEvent` objects, not values. Search and sort reset to page 1.
- **Page size** options are `[3, 5, 10]`; changing the size keeps the first visible lesson on screen (MatPaginator behaviour).
- **Edit dialog Save** persists only `titles` (`description`, `longDescription`). Category and release date are returned in the dialog result but not saved, as in legacy. Escape and backdrop clicks don't close the dialog (`disableClose`).
- **Home** makes one `GET /api/courses` per load (StrictMode double effects are aborted in dev only).
- **About** keeps the legacy text verbatim ("Welcome to the Angular Testing Course").

## Known residual gaps
- The date picker calendar's selected-day ring and in-grid month label use MUI X default styling, not Angular Material's. Reported, not chased.
- MUI component styles otherwise match Angular Material M2 closely but not pixel-perfect.

## Known traps
- **Fetch in tests needs absolute URLs**: Node's `fetch` rejects `/api/...`; `coursesService` resolves against `document.baseURI`. If you write your own fetch, go through `coursesService` instead.
- **Fake timers vs. MSW / RTL**: MSW and `findBy*` rely on real timers. Use a `createCoursesServiceSpy()` with `mockResolvedValue` under fake timers instead of MSW, or `vi.useFakeTimers({ shouldAdvanceTime: true })`.
- **`restoreMocks: true` does not reset `vi.fn()` created inside a `vi.mock` factory**; call `mockReset()` in `beforeEach` if you count calls.
- **Loader routes render async**: with `renderWithProviders(..., { loader })` the first frame is empty (`HydrateFallback`); use `findBy*`.
- **Empty 200 from the API**: `GET /api/courses/<unknown>` returns an empty body; the service resolves `null`, `courseLoader` throws `HttpError(404)`, `RouteErrorBoundary` shows "Course not found".
- **Lessons are delayed 1 s** by the Express server (not by MSW handlers). Angular shows a spinner meanwhile.
- **Angular datepicker default** is `moment()` (today); use `dayjs()` and send `releasedAt` as ISO (`toISOString()`).
- **MUI tabs / cards vs. Cypress selectors**: `.mat-tab-label` → `role="tab"`, `mat-card` → a `region` named by the course title (`.course-card`).
- **No `CssBaseline`**: global CSS is only `styles.css` (Angular has no reset).
- On npm 10.9 (Node 22.12) `npm install <pkg>` can crash with `edgesOut`; use `npx -y npm@11 install`. `npm ci` is fine.
