# React migration of angular-testing-course

Standalone React 18 + Vite + TypeScript app living alongside the Angular app
(the Angular sources under `../src` are untouched).

```
cd react-app
npm install
npm run dev        # http://localhost:4300, proxies /api to the mock server
npm run typecheck
npm run lint
npm test
```

Start the mock backend from the repo root first: `npm run server` (port 9000).

Structure mirrors `../src/app`:

- `src/courses/model` – shared `Course` / `Lesson` interfaces
- `src/courses/services` – `CoursesService` (fetch-based), `CoursesServiceContext` + `useCoursesService`, `LoggerService`, `CalculatorService`
- `src/courses/*` , `src/about` – React components migrated 1:1 from the Angular components
- `src/App.tsx` / `src/router.tsx` – app shell and React Router routes (with the `courseLoader` equivalent of `courseResolver`)
