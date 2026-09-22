import {render, screen} from '@testing-library/angular';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';


describe('CoursesCardListComponent', () => {

    const renderComponent = (courses: Course[] = []) =>
        render(CoursesCardListComponent, {
            imports: [CoursesModule],
            excludeComponentDeclaration: true,
            componentProperties: {courses}
        });

    it('should create the component', async () => {

        const {fixture} = await renderComponent();

        expect(fixture.componentInstance).toBeTruthy();

    });

    it('should display the course list', async () => {

        const courses = setupCourses();

        await renderComponent(courses);

        expect(screen.getAllByRole('button', {name: /view course/i}).length)
            .toBe(courses.length, 'Unexpected number of courses');

    });

    it('should display the first course', async () => {

        const courses = setupCourses();

        await renderComponent(courses);

        const course = courses[0];

        expect(screen.getByText(course.titles.description)).toBeTruthy();

        expect(screen.getByAltText(course.titles.description).getAttribute('src'))
            .toBe(course.iconUrl);

    });

});
