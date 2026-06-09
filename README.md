## Angular Testing Course — React + TypeScript (Vite) Migration

This repository originally contained the code of the [Angular Testing Course](https://angular-university.io/course/angular-testing-course).

The frontend has been **migrated from Angular 19 to React 18 + TypeScript using Vite**. The original Node/Express mock backend (under `server/`) is preserved unchanged — the React app consumes the exact same `/api` endpoints through a dev-server proxy.

The React application lives in the [`react-app/`](./react-app) directory.

# Installation pre-requisites

Please install Node 20 (LTS).

# How to install

```
git clone https://github.com/COG-GTM/angular-testing-course.git
cd angular-testing-course
```

Install the mock-backend dependencies (repository root):

```
npm install
```

Install the React app dependencies:

```
cd react-app
npm install
```

# Running the application

The app has two parts: the Express mock REST API and the React (Vite) dev server.

### 1. Start the backend (mock REST API)

From the repository root:

```
npm run server
```

This starts a small Node REST API server on port **9000**.

### 2. Start the frontend (React + Vite)

From the `react-app/` directory:

```
npm run dev
```

The application is visible at [http://localhost:4200](http://localhost:4200). The Vite dev server proxies all `/api` calls to the backend on port 9000 (mirrors the original Angular `proxy.json`).

# React app scripts (run from `react-app/`)

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Start the Vite dev server (port 4200)        |
| `npm run build` | Type-check and build for production (`dist/`) |
| `npm run lint`  | Run ESLint                                    |
| `npm run test`  | Run the Vitest unit/component test suite      |

# Routes

The original Angular route structure is preserved:

| URL            | Page                                   |
| -------------- | -------------------------------------- |
| `/`            | Home — beginner / advanced course tabs |
| `/about`       | About page                             |
| `/courses/:id` | Course detail — searchable, sortable, paginated lessons table |

# Testing

Unit and component tests were migrated from Jasmine/Karma to **Vitest + React Testing Library**. Run them with:

```
cd react-app
npm run test
```

The original Cypress end-to-end suite is retained under `cypress/` for reference.

# Migration notes

- Angular `HttpClient` + RxJS services → `fetch` + `async/await` with `AbortController` for request cancellation.
- Angular components → React function components with hooks (`useState`, `useEffect`).
- Angular Router → `react-router-dom` v6 (same URLs, route resolver replicated with a pre-fetch effect).
- Angular Material UI → reimplemented with plain CSS to preserve the look without adding a new UI library.
