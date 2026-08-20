
## Courses Testing Course (React + TypeScript + Vite)

This repository contains a courses/lessons sample application, originally built with Angular and now migrated to
React 19 + TypeScript, built with Vite. The Node/Express mock REST API in `server/` is unchanged.

# Installation pre-requisites

Please install Node 20 Long Term Support Edition (LTS).

# How To install this repository

    git clone https://github.com/angular-university/angular-testing-course.git
    cd angular-testing-course
    npm install

The root `postinstall` script also installs the dependencies of the React app in `react-app/`.

# Project structure

    react-app/           React + TypeScript + Vite frontend
      src/types/         TypeScript models (Course, Lesson)
      src/services/      API services (fetch + AbortController)
      src/context/       React context providers
      src/hooks/         Data hooks (useCourse, useLessons)
      src/components/    Reusable UI components
      src/pages/         Route level pages (Home, About, Course)
      src/styles/        Global SCSS (Material-like theme, plain CSS)
    server/              Express mock REST API (unchanged)
    cypress/             Cypress e2e tests

# To Run the Development Backend Server

    npm run server

This is a small Node REST API server listening on port 9000. The Vite dev server (and `vite preview`)
proxy `/api` to it, so the frontend keeps calling the same endpoints.

# To run the Development UI Server

    npm start

The application is visible at port 4200: [http://localhost:4200](http://localhost:4200)

To run backend and frontend together:

    npm run dev

# Build, test and lint

    npm run build     # type-check + Vite production build into dist/
    npm test          # Vitest + React Testing Library unit tests
    npm run lint      # oxlint
    npm run e2e       # production build + preview + Cypress e2e
    npm run cypress:open

# Other Courses
# Modern Angular With Signals

If you are looking for the [Modern Angular With Signals Course](https://angular-university.io/course/angular-signals-course), the repo with the full code can be found here:

![Modern Angular With Signals Course](https://d3vigmphadbn9b.cloudfront.net/course-images/large-images/angular-signals-course.jpg)

# Angular Core Deep Dive Course

If you are looking for the [Angular Core Deep Dive Course](https://angular-university.io/course/angular-course), the repo with the full code can be found here:

![Angular Core Deep Dive](https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-core-in-depth-small.png)

# RxJs In Practice

If you are looking for the [RxJs In Practice](https://angular-university.io/course/rxjs-course), the repo with the full code can be found here:

![RxJs In Practice Course](https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png)


# NgRx In Depth

If you are looking for the [NgRx In Depth](https://angular-university.io/course/angular-ngrx-course), the repo with the full code can be found here:

![Angular Ngrx Course](https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-ngrx-course.png)

# Serverless Angular with Firebase Course

If you are looking for the [Serverless Angular with Firebase Course](https://angular-university.io/course/firebase-course), the repo with the full code can be found here:

![Serverless Angular with Firebase Course](https://s3-us-west-1.amazonaws.com/angular-university/course-images/serverless-angular-small.png)

# Angular Universal Course

If you are looking for the [Angular Universal Course](https://angular-university.io/course/angular-universal-course), the repo with the full code can be found here:

![Angular Universal Course](https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-universal-small.png)

# Angular PWA Course

If you are looking for the [Angular PWA Course](https://angular-university.io/course/angular-pwa-course), the repo with the full code can be found here:

![Angular PWA Course - Build the future of the Web Today](https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-pwa-course.png)

# Angular Security Masterclass

If you are looking for the [Angular Security Masterclass](https://angular-university.io/course/angular-security-course), the repo with the full code can be found here:

[Angular Security Masterclass](https://github.com/angular-university/angular-security-course).

![Angular Security Masterclass](https://s3-us-west-1.amazonaws.com/angular-university/course-images/security-cover-small-v2.png)

# Angular Advanced Library Laboratory Course

If you are looking for the Angular Advanced Course, the repo with the full code can be found here:

[Angular Advanced Library Laboratory Course: Build Your Own Library](https://angular-university.io/course/angular-advanced-course).

![Angular Advanced Library Laboratory Course: Build Your Own Library](https://angular-academy.s3.amazonaws.com/thumbnails/advanced_angular-small-v3.png)


## RxJs and Reactive Patterns Angular Architecture Course

If you are looking for the RxJs and Reactive Patterns Angular Architecture Course code, the repo with the full code can be found here:

[RxJs and Reactive Patterns Angular Architecture Course](https://angular-university.io/course/reactive-angular-architecture-course)

![RxJs and Reactive Patterns Angular Architecture Course](https://s3-us-west-1.amazonaws.com/angular-academy/blog/images/rxjs-reactive-patterns-small.png)


## Complete Typescript Course - Build A REST API

If you are looking for the Complete Typescript 2 Course - Build a REST API, the repo with the full code can be found here:

[https://angular-university.io/course/typescript-2-tutorial](https://github.com/angular-university/complete-typescript-course)

[Github repo for this course](https://github.com/angular-university/complete-typescript-course)

![Complete Typescript Course](https://angular-academy.s3.amazonaws.com/thumbnails/typescript-2-small.png)

