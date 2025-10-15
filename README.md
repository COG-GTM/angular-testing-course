
## Angular Testing Course

This repository contains the code of the [Angular Testing Course](https://angular-university.io/course/angular-testing-course).

This course repository is updated to Angular v19, and there is a  package-lock.json file available, for avoiding semantic versioning installation issues.

![Angular Testing Course](https://s3-us-west-1.amazonaws.com/angular-university/course-images/angular-testing-small.png)


# Installation pre-requisites

Please install Node 18 Long Term Support Edition (LTE).

# Installing the Angular CLI

With the following command the angular-cli will be installed globally in your machine:

    npm install -g @angular/cli 


# How To install this repository

We can install the master branch using the following commands:

    git clone https://github.com/angular-university/angular-testing-course.git
    
This repository is made of several separate npm modules, that are installable separately. For example, to run the au-input module, we can do the following:
    
    cd angular-testing-course
    npm install

Its also possible to install the modules as usual using npm:

    npm install 

NPM 5 or above has the big advantage that if you use it you will be installing the exact same dependencies than I installed in my machine, so you wont run into issues caused by semantic versioning updates.

This should take a couple of minutes. If there are issues, please post the complete error message in the Questions section of the course.

# To Run the Development Backend Server

We can start the sample application backend with the following command:

    npm run server

This is a small Node REST API server.

# To run the Development UI Server

To run the frontend part of our code, we will use the Angular CLI:

    npm start 

The application is visible at port 4200: [http://localhost:4200](http://localhost:4200)

# Testing

This repository demonstrates comprehensive Angular testing practices using Karma and Jasmine.

## Running Tests

To run the test suite:

    npm test

To run tests in watch mode during development:

    npm test -- --watch

## Angular Testing Library

This repository is in the process of migrating select tests to Angular Testing Library, a user-centric testing approach that focuses on testing components from the user's perspective rather than implementation details.

### What is Angular Testing Library?

Angular Testing Library is built on top of DOM Testing Library and provides utilities to test Angular components in a way that resembles how users interact with your application. It encourages better testing practices by:

- Querying elements by accessibility attributes and visible text rather than CSS selectors
- Automatically handling change detection
- Focusing on user-facing behavior rather than internal component state
- Making tests more maintainable and resilient to refactoring

### Current Implementation

Selected tests have been migrated to demonstrate Angular Testing Library patterns. For example, see the `CoursesCardListComponent` tests which show both traditional TestBed-based tests and Angular Testing Library-based tests for comparison.

**Key differences in the migrated tests:**
- Uses `render()` function instead of `TestBed.createComponent()`
- Uses `screen.getByText()`, `screen.getAllByRole()` instead of `By.css()` selectors
- No manual `fixture.detectChanges()` calls needed
- More readable and maintainable test code

### Package Versions

The repository uses `@testing-library/angular@17.3.7` for compatibility with Angular 19. Note that Angular Testing Library v18+ requires Angular 20+.

### Learn More

- [Angular Testing Library Documentation](https://testing-library.com/docs/angular-testing-library/intro/)
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles/)

# Important

This repository has multiple branches, have a look at the beginning of each section to see the name of the branch.

At certain points along the course, you will be asked to checkout other remote branches other than master. You can view all branches that you have available remotely using the following command:

    git branch -a

  The remote branches have their starting in origin, such as for example 1-navigation-and-containers.

We can checkout the remote branch and start tracking it with a local branch that has the same name, by using the following command:

      git checkout -b section-1 origin/1-navigation-and-containers

It's also possible to download a ZIP file for a given branch,  using the branch dropdown on this page on the top left, and then selecting the Clone or Download / Download as ZIP button.

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

