import {render, screen} from '@testing-library/angular';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {setupCourses} from '../common/setup-test-data';


describe('CoursesCardListComponent', () => {

    async function renderComponent(courses = setupCourses()) {
        const renderResult = await render(CoursesCardListComponent, {
            imports: [CoursesModule],
            excludeComponentDeclaration: true,
            componentProperties: {courses}
        });
        return renderResult;
    }

    it('should create the component', async () => {

        const {fixture} = await renderComponent();
        expect(fixture.componentInstance).toBeTruthy();

    });

    it('should display the course list', async () => {

        const courses = setupCourses();
        const {container} = await renderComponent(courses);

        const cards = container.querySelectorAll('.course-card');

        expect(cards).toBeTruthy('Could not find cards');
        expect(cards.length).toBe(12, 'Unexpected number of courses');

    });

    it('should display the first course', async () => {

        const courses = setupCourses();
        await renderComponent(courses);

        const firstCourse = courses[0];

        expect(screen.getByText(firstCourse.titles.description)).toBeTruthy();

        const image = screen.getAllByRole('img')[0] as HTMLImageElement;
        expect(image.src).toBe(firstCourse.iconUrl);

    });

});


