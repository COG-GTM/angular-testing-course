## Testing Course (React + Vitest + Playwright)

This repository contains the code of the [Angular Testing Course](https://angular-university.io/course/angular-testing-course),
migrated from Angular 19 to **React 19**. The app (courses list, edit dialog, course page with searchable,
sortable, paged lessons, about page) and every unit test of the course were ported. Each Angular testing
technique now has a React / Vitest / Testing Library equivalent (see the table below).

The migration record, intentional parity decisions and known traps are in [MIGRATION.md](./MIGRATION.md).

![Angular Testing Course](https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-testing-small.png)

## Prerequisites

Node **>= 20.19** (Vite 8, ESLint 10 and jsdom 29 need it). CI uses Node 22.

```bash
git clone https://github.com/COG-GTM/angular-testing-course.git
cd angular-testing-course
npm ci
npx playwright install chromium   # once, for the e2e tests
```

## Run the app

```bash
npm run server   # Express mock REST API on http://localhost:9000 (the lessons endpoint waits 1 s on purpose)
npm run dev      # Vite dev server on http://localhost:4200, /api proxied to :9000
```

`npm run build && npm run preview` serves the production build on http://localhost:4173, also with `/api` proxied to :9000.

## Test and check

| Command | What it does |
| --- | --- |
| `npm test` | Vitest unit and integration tests (jsdom, MSW for HTTP) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run e2e` | Playwright (Chromium) against a production build on :4173, `/api` mocked with `page.route` and `e2e/fixtures/*.json` |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc` for the app, tests, configs and `server/` |
| `npm run build` | Type-check and build to `dist/` |

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs lint, typecheck, unit tests, build and e2e on every PR.

## Angular testing concept → React / Vitest equivalent

| Angular (original course) | React (this repo) |
| --- | --- |
| Karma + Jasmine, `*.spec.ts` | Vitest + jsdom, `*.test.ts(x)` next to the code |
| `TestBed.configureTestingModule({ providers })` | `renderWithProviders(ui, { coursesService })` (`src/courses/common/testUtils.tsx`) |
| `jasmine.createSpyObj('CoursesService', [...])` | `createCoursesServiceSpy()`: typed `vi.fn()`s injected through `CoursesServiceProvider` |
| `spyOn(obj, 'method').and.returnValue(x)` | `vi.spyOn(obj, 'method').mockReturnValue(x)` |
| `HttpTestingController` (`expectOne`, `flush`) | MSW `server.use(http.get(...))` (`src/test/`), unhandled requests fail the test |
| `fixture.detectChanges()` | React re-renders on state change; await `findBy*` / `waitFor` |
| `DebugElement.queryAll(By.css('.mat-tab-label'))` | `screen.getAllByRole('tab')` |
| `fakeAsync` / `tick(ms)` / `flush()` | `vi.useFakeTimers()` / `vi.advanceTimersByTime(ms)` / `vi.runAllTimers()` |
| `flushMicrotasks()` | `await vi.runAllTimersAsync()` or awaiting the promise |
| `waitForAsync` / `fixture.whenStable()` | `await screen.findBy*(...)` / `await waitFor(...)` |
| Router resolver (`courseResolver`) | React Router data loader (`courseLoader`) |
| Cypress `cy.route` + `cy.fixture` | Playwright `page.route` + `e2e/fixtures/*.json` |

`src/testing-examples/asyncExamples.test.ts` is the port of the course's `async-examples.spec.ts` (each test notes the Angular case it maps to).

## Project layout

```
src/       React app and its unit/integration tests
e2e/       Playwright specs, API mocks (mockApi.ts) and fixtures
server/    Express mock REST API (ts-node, own tsconfig)
public/    Static assets
```

## History

The original course code was written for Angular (last on v19, Karma/Jasmine unit tests, Cypress e2e). It was
migrated to React in waves: foundation [#72](https://github.com/COG-GTM/angular-testing-course/pull/72), features
[#73](https://github.com/COG-GTM/angular-testing-course/pull/73)–[#76](https://github.com/COG-GTM/angular-testing-course/pull/76),
then integration. The Angular code is still available in the git history before the integration commit.
