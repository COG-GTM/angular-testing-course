import { render, screen } from '@testing-library/angular';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';


describe('CoursesCardListComponent', () => {

    it('should create the component', async () => {

        await render(CoursesCardListComponent, {
            imports: [CoursesModule],
            componentProperties: {
                courses: []
            }
        });

        expect(document.body).toBeTruthy();

    });

    it('should display the course list', async () => {

        await render(CoursesCardListComponent, {
            imports: [CoursesModule],
            componentProperties: {
                courses: setupCourses()
            }
        });

        const cards = document.querySelectorAll('.course-card');

        expect(cards).toBeTruthy();
        expect(cards.length).toBe(12);

    });

    it('should display the first course', async () => {

        const courses = setupCourses();
        const firstCourse = courses[0];

        await render(CoursesCardListComponent, {
            imports: [CoursesModule],
            componentProperties: {
                courses: courses
            }
        });

        expect(screen.getByText(firstCourse.titles.description)).toBeTruthy();

        const image = document.querySelector('img') as HTMLImageElement;
        expect(image).toBeTruthy();
        expect(image.src).toBe(firstCourse.iconUrl);

    });

});


