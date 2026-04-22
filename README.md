# Angular Testing Course — migrated to React + TypeScript + Vite

This repository originally hosted the Angular 19 "[Angular Testing Course](https://angular-university.io/course/angular-testing-course)" demo. It has been migrated to **React 18 + TypeScript + Vite** while preserving the original URLs, API contract, mock Express backend, and overall Material Design look and feel.

The old Angular application lived under `src/app/` with a reactive-forms UI, `HttpClient`/RxJS services, and Angular Material components. The new React app lives under `src/` (pages + components + services + types + utils + styles) using:

- React 18 with React Router v6 for client-side routing (same URLs)
- `fetch` + `AbortController` for data access (async/await, no RxJS)
- MUI (`@mui/material`) to preserve the teal primary / red accent Material look and feel
- Vitest + React Testing Library for unit and component tests
- ESLint 9 (flat config) with `typescript-eslint`

The Express mock backend under `server/` is unchanged aside from modernizing its imports.

## Prerequisites

- Node.js 20+
- npm 10+

## Install

```bash
npm install
```

## Run the app (two terminals)

```bash
# Terminal 1 — Express mock API on :9000
npm run server

# Terminal 2 — Vite dev server on :4200 (proxies /api → :9000)
npm run dev
```

Open http://localhost:4200.

## Routes

| URL            | Page                                              |
| -------------- | ------------------------------------------------- |
| `/`            | Courses (Beginner / Advanced tabs)                |
| `/about`       | About                                             |
| `/courses/:id` | Course detail (lessons table, search, pagination) |
| anything else  | Redirects to `/`                                  |

## Scripts

| Command              | Description                                                      |
| -------------------- | ---------------------------------------------------------------- |
| `npm run dev`        | Start Vite dev server on port 4200                               |
| `npm run server`     | Start the Express mock API on port 9000 (`tsx server/server.ts`) |
| `npm run build`      | Type-check and build the production bundle                       |
| `npm run preview`    | Preview the production build                                     |
| `npm run lint`       | Run ESLint                                                       |
| `npm test`           | Run the Vitest test suite                                        |
| `npm run test:watch` | Run tests in watch mode                                          |

## Project layout

```
.
├── index.html              # Vite HTML entry
├── public/                 # Static assets (favicon, etc.)
├── server/                 # Express mock API (unchanged endpoints)
│   ├── server.ts
│   ├── get-courses.route.ts
│   ├── search-lessons.route.ts
│   ├── save-course.route.ts
│   └── db-data.ts
├── src/
│   ├── main.tsx            # Entry: fonts + global.scss + <App/>
│   ├── App.tsx             # Theme provider + router
│   ├── components/
│   │   ├── AppLayout.tsx
│   │   ├── CoursesCardList.tsx
│   │   └── CourseDialog.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   └── CoursePage.tsx
│   ├── services/           # fetch + AbortController API clients
│   ├── types/              # TypeScript interfaces
│   ├── utils/              # Pipe replacements
│   ├── styles/             # MUI theme + global SCSS
│   └── test/setup.ts       # @testing-library/jest-dom
└── vite.config.ts          # Proxy: /api → http://localhost:9000
```

## API

The frontend talks to the Express server via `/api`:

- `GET /api/courses`
- `GET /api/courses/:id`
- `PUT /api/courses/:id`
- `GET /api/lessons?courseId=&filter=&sortOrder=&pageNumber=&pageSize=`

Vite proxies `/api` to `http://localhost:9000` during development.
