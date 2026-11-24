import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {Course} from "../model/course";
import {CoursesService} from "../services/courses.service";
import {sortCoursesBySeqNo} from './sort-course-by-seq';
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

    readonly beginnerCourses = computed(() => this.filterByCategory('BEGINNER'));

    readonly advancedCourses = computed(() => this.filterByCategory('ADVANCED'));

    ngOnInit() {

      this.reloadCourses();

    }


    reloadCourses() {

      this.coursesService.findAllCourses()
        .subscribe(courses => this.courses.set(courses));

    }

    private filterByCategory(category: string) {
      return this.courses()
        .filter(course => course.category === category)
        .sort(sortCoursesBySeqNo);
    }

}


