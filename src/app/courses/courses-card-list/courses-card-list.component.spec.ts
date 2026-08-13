import {render, screen, within} from '@testing-library/angular';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';


describe('CoursesCardListComponent', () => {

    const renderComponent = (courses: Course[] = []) =>
        render(CoursesCardListComponent, {
            imports: [CoursesModule],
            inputs: {courses}
        });

    const courseCards = () =>
        screen.queryAllByRole('button', {name: /view course/i})
            .map(button => button.closest<HTMLElement>('mat-card'));

    it('should create the component', async () => {

        const {fixture} = await renderComponent();

        expect(fixture.componentInstance).toBeTruthy();

    });

    it('should display the course list', async () => {

        await renderComponent(setupCourses());

        expect(courseCards().length).toBe(12, "Unexpected number of courses");

    });

    it('should display the first course', async () => {

        const courses = setupCourses();

        await renderComponent(courses);

        const course = courses[0];

        const card = within(courseCards()[0]);

        expect(card.getByText(course.titles.description)).toBeTruthy();

        expect(card.getByRole('img').getAttribute('src')).toBe(course.iconUrl);

    });

});
