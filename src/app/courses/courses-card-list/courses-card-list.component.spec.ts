import {render, screen} from '@testing-library/angular';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {setupCourses} from '../common/setup-test-data';

describe('CoursesCardListComponent', () => {

    async function renderComponent() {
        const courses = setupCourses();

        const {fixture} = await render(CoursesCardListComponent, {
            imports: [CoursesModule],
            inputs: {courses}
        });

        return {courses, fixture};
    }

    it('should create the component', async () => {

        const {fixture} = await renderComponent();

        expect(fixture.componentInstance).toBeTruthy();

    });

    it('should display the course list', async () => {

        await renderComponent();

        const cards = screen.getAllByText(/./, {selector: 'mat-card-title'});

        expect(cards.length).toBe(12);

    });

    it('should display the first course', async () => {

        const {courses} = await renderComponent();

        const firstCourse = courses[0];

        expect(screen.getByText(firstCourse.titles.description)).toBeTruthy();

        const images = screen.getAllByRole('img');

        expect(images[0].getAttribute('src')).toBe(firstCourse.iconUrl);

    });

});
