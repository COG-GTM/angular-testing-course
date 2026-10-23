# Angular 19 → React migration contract (`react-app/`)

This file is the **frozen contract** for the multi-wave migration of `COG-GTM/angular-testing-course`.
Wave 1 (foundation) owns it. Wave-2 children code against the names below **without editing
foundation files**; request changes through the "Deferred shared changes" flow at the bottom.

## Stack

| Concern | Angular (legacy, `src/`) | React (`react-app/`) |
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
| E2E | Cypress 9 (`cypress/`) | Playwright (`react-app/e2e/`, Chromium) |
| Lint | tslint | ESLint 10 flat config (`typescript-eslint`, `react-hooks`, `react-refresh`) |

Every dependency wave 2 needs is already installed. **Wave-2 children must not edit
`package.json` or `package-lock.json`.** Node `>=20.19` locally (Vite 8 / ESLint 10 / jsdom 29); CI uses Node 22.

## How to run

```bash
# API (Express mock server on :9000) — from the repo root
npm ci && npm run server

# React app on :4200, /api proxied to :9000
cd react-app && npm ci && npm run dev

# Legacy Angular next to it on :4300 (repo root)
npx ng serve --port 4300 --proxy-config proxy.json
```

`react-app` scripts: `dev`, `build` (`tsc -b && vite build`), `preview` (:4173), `test` (vitest run),
`test:watch`, `lint`, `typecheck`, `e2e` (Playwright; builds and runs `vite preview` on :4173, mocks `/api/**`
with `cypress/fixtures/*.json`). Install the browser once with `npx playwright install chromium`.

Before pushing: `npm run lint && npm run typecheck && npm test && npm run build && npm run e2e`.

## Frozen API

All paths are relative to `react-app/src/`.

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
- `setupTestData.ts` → `export function setupCourses(): Course[]` (= `Object.values(COURSES).sort(sortCoursesBySeqNo)` from `../../../../server/db-data`, the single source of test data). Import `COURSES`, `LESSONS`, `findLessonsForCourse`, `findCourseById` from `server/db-data` directly when you need more.
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

### Feature components (final names and props; placeholders until wave 2 lands)
| Path | Export |
| --- | --- |
| `app/AppToolbar.tsx` (barrel `app/index.ts`) | `export function AppToolbar()` — teal toolbar, COURSES → `/`, ABOUT → `/about` |
| `about/About.tsx` (barrel `about/index.ts`) | `export function About()` |
| `courses/home/Home.tsx` (barrel) | `export function Home()` |
| `courses/courses-card-list/CoursesCardList.tsx` (barrel) | `export interface CoursesCardListProps { courses: Course[]; onCourseEdited?: () => void }`, `export function CoursesCardList(props: CoursesCardListProps)` |
| `courses/course-dialog/CourseDialog.tsx` (barrel) | `export interface CourseDialogResult { description: string; category: string; releasedAt: string /* ISO date */; longDescription: string }`, `export interface CourseDialogProps { open: boolean; course: Course; onClose: (result?: CourseDialogResult) => void }`, `export function CourseDialog(props: CourseDialogProps)` — the real dialog calls `saveCourse` itself and closes with the form value |
| `courses/course/CoursePage.tsx` (barrel) | `export function CoursePage()` — reads the course with `useLoaderData()` |
| `testing-examples/` | `README.md` only; W2-D ports `async-examples.spec.ts` here |

Keep the barrels' export names; you may add exports. `router.tsx` imports only from the barrels.

## Test conventions
- File names: `*.test.ts(x)` next to the code (Angular `*.spec.ts` → `*.test.ts`). Keep every Angular `it(...)` case and its intent; name any deliberate deviation in the test.
- Query by role/label/text (`getByRole('tab', { name: ... })`) over CSS classes; `.mat-*` selectors from the Angular specs map to roles.
- Render through `renderWithProviders`. Inject services with `createCoursesServiceSpy()` and `coursesService: spy` — no `vi.mock` of service modules.
- For HTTP-level behaviour use MSW (`server.use(http.get(...))`). Unhandled requests fail the test.
- `fakeAsync`/`tick`/`flush` → `vi.useFakeTimers()` / `vi.advanceTimersByTime(ms)` / `vi.runAllTimers()`; always `vi.useRealTimers()` in `afterEach`. With fake timers use `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` and wrap timer advances that update state in `act`.
- Vitest config: `globals: true`, `restoreMocks: true`, `css: false`.

## Wave-2 ownership map

| Child | Owns (may create/edit/delete) |
|---|---|
| W2-A Home | `react-app/src/courses/home/**` |
| W2-B Card list + dialog | `react-app/src/courses/courses-card-list/**`, `react-app/src/courses/course-dialog/**` |
| W2-C Course page | `react-app/src/courses/course/**` (incl. its lessons data hook) |
| W2-D Shell, About, testing examples | `react-app/src/app/AppToolbar*`, `react-app/src/about/**`, `react-app/src/testing-examples/**` |
| Foundation / integration only | everything else: `package.json`, lockfile, configs, `router.tsx`, `main.tsx`, `theme.ts`, `styles.css`, `courses/model/**`, `courses/services/**`, `courses/common/**`, `src/test/**`, `e2e/**`, CI, `MIGRATION.md`, anything outside `react-app/` |

## Branch / PR flow
1. Wave 1 (this foundation) opens one PR to `master`.
2. Each wave-2 child branches from the **foundation branch** (`devin/<ts>-react-foundation`), names its branch `devin/<ts>-react-<feature>`, and opens its PR **targeting the foundation branch** (CI runs on PRs to `devin/**`). Touch only owned paths.
3. Wave 3 (integration) merges wave 2, ports the Cypress home test to Playwright, applies deferred shared changes, and lands on `master`.
4. Never base on or reuse the stale React/ATL PRs (#36–#71) on origin.

## Known traps
- **Fetch in tests needs absolute URLs**: Node's `fetch` rejects `/api/...`; `coursesService` resolves against `document.baseURI`. If you write your own fetch, go through `coursesService` instead.
- **Fake timers vs. MSW / RTL**: MSW and `findBy*` rely on real timers. Use a `createCoursesServiceSpy()` with `mockResolvedValue` under fake timers instead of MSW, or `vi.useFakeTimers({ shouldAdvanceTime: true })`.
- **`restoreMocks: true` does not reset `vi.fn()` created inside a `vi.mock` factory**; call `mockReset()` in `beforeEach` if you count calls.
- **Loader routes render async**: with `renderWithProviders(..., { loader })` the first frame is empty (`HydrateFallback`); use `findBy*`.
- **Empty 200 from the API**: `GET /api/courses/<unknown>` returns an empty body; the service resolves `null`, `courseLoader` throws `HttpError(404)`, `RouteErrorBoundary` shows "Course not found".
- **Lessons are delayed 1 s** by the Express server (not by MSW handlers). Angular shows a spinner meanwhile.
- **Angular datepicker default** is `moment()` (today); use `dayjs()` and send `releasedAt` as ISO (`toISOString()`).
- **MUI tabs / cards vs. Cypress selectors**: `.mat-tab-label` → `role="tab"`, `mat-card` → `MuiCard` (`article` is not implied; query by heading text or add an accessible name).
- **No `CssBaseline`**: global CSS is only `styles.css`; MUI component styles otherwise match Angular Material M2 closely but not pixel-perfect.
- **Do not run `npm install` at the repo root** without reverting the tracked root `package-lock.json`.
- On npm 10.9 (Node 22.12) `npm install <pkg>` can crash with `edgesOut`; use `npx -y npm@11 install`. `npm ci` is fine.

## Deferred shared changes
Wave-2 children **do not edit this file or any foundation-owned path**. If you need a shared change
(new dependency, service method, theme token, util, route change), add a section to **your PR description**:

```
### Deferred shared changes
- <file>: <change> — <why>
```

and report it in your structured output (`shared_changes_needed`). The integration wave applies them.
