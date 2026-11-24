import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import {Course} from "../model/course";
import {CoursesService} from "../services/courses.service";
import {sortCoursesBySeqNo} from './sort-course-by-seq';
import { Subscription } from 'rxjs';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    imports: [MatTabGroup, MatTab, CoursesCardListComponent]
})
export class HomeComponent implements OnInit {
    private coursesService = inject(CoursesService);


    private readonly courses = signal<Course[]>([]);

    private coursesLoad?: Subscription;

    constructor() {
      inject(DestroyRef).onDestroy(() => this.coursesLoad?.unsubscribe());
    }

    readonly beginnerCourses = computed(() => this.filterByCategory('BEGINNER'));

    readonly advancedCourses = computed(() => this.filterByCategory('ADVANCED'));

    ngOnInit() {

      this.reloadCourses();

    }


    reloadCourses() {

      this.coursesLoad?.unsubscribe();
      this.coursesLoad = this.coursesService.findAllCourses()
        .subscribe(courses => this.courses.set(courses));

    }

    private filterByCategory(category: string) {
      return this.courses()
        .filter(course => course.category === category)
        .sort(sortCoursesBySeqNo);
    }

}


