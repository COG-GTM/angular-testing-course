import { Routes } from '@angular/router';
import { courseResolver } from './courses/services/course.resolver';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./courses/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'about',
        loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
    },
    {
        path: 'courses/:id',
        loadComponent: () => import('./courses/course/course.component').then(m => m.CourseComponent),
        resolve: {
            course: courseResolver
        }
    },
    {
        path: '**',
        redirectTo: '/'
    }
];
