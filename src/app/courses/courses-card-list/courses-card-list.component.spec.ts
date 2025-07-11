import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';
import { render, screen } from '@testing-library/angular';


describe('CoursesCardListComponent', () => {

    let component: CoursesCardListComponent;
    let fixture: ComponentFixture<CoursesCardListComponent>;
    let el: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [CoursesModule]
        })
        .compileComponents()
        .then(() => {

            fixture = TestBed.createComponent(CoursesCardListComponent);
            component = fixture.componentInstance;
            el = fixture.debugElement;

        });
    }));

    it('should create the component', () => {

        expect(component).toBeTruthy();

    });

    it('should display the course list', () => {

        component.courses = setupCourses();

        fixture.detectChanges();

        const cards = el.queryAll(By.css(".course-card"));

        expect(cards).toBeTruthy("Could not find cards");
        expect(cards.length).toBe(12, "Unexpected number of courses");

    });

    it('should display the first course', () => {

        component.courses = setupCourses();

        fixture.detectChanges();

        const course = component.courses[0];

        const card = el.query(By.css(".course-card:first-child")),
                title = card.query(By.css("mat-card-title")),
                image = card.query(By.css("img"));

        expect(card).toBeTruthy("Could not find course card");

        expect(title.nativeElement.textContent).toBe(course.titles.description);

        expect(image.nativeElement.src).toBe(course.iconUrl);

    });

});

describe('CoursesCardListComponent (Angular Testing Library)', () => {

    it('should display the first course', async () => {

        const courses = setupCourses();
        
        await render(CoursesCardListComponent, {
            imports: [CoursesModule],
            componentProperties: {
                courses: courses
            }
        });

        const firstCourse = courses[0];
        
        const titleElement = screen.getByText(firstCourse.titles.description);
        expect(titleElement).toBeTruthy();
        
        const courseImages = screen.getAllByRole('img');
        expect(courseImages[0].getAttribute('src')).toBe(firstCourse.iconUrl);

    });

});


