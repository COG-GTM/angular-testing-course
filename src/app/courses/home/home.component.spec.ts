import {render, screen, within} from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {HomeComponent} from './home.component';
import {CoursesModule} from '../courses.module';
import {CoursesService} from '../services/courses.service';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';


describe('HomeComponent', () => {

  const beginnerCourses = setupCourses()
      .filter(course => course.category == 'BEGINNER');

  const advancedCourses = setupCourses()
      .filter(course => course.category == 'ADVANCED');

  const renderComponent = (courses: Course[]) => {

      const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

      coursesServiceSpy.findAllCourses.and.returnValue(of(courses));

      return render(HomeComponent, {
          imports: [
              CoursesModule,
              NoopAnimationsModule
          ],
          providers: [
              {provide: CoursesService, useValue: coursesServiceSpy}
          ]
      });
  };

  it("should create the component", async () => {

    const {fixture} = await renderComponent([]);

    expect(fixture.componentInstance).toBeTruthy();

  });


  it("should display only beginner courses", async () => {

      await renderComponent(beginnerCourses);

      expect(screen.getAllByRole('tab').length).toBe(1, "Unexpected number of tabs found");

      expect(screen.getByRole('tab', {name: "Beginners"})).toBeTruthy();

  });


  it("should display only advanced courses", async () => {

      await renderComponent(advancedCourses);

      expect(screen.getAllByRole('tab').length).toBe(1, "Unexpected number of tabs found");

      expect(screen.getByRole('tab', {name: "Advanced"})).toBeTruthy();

  });


  it("should display both tabs", async () => {

      await renderComponent(setupCourses());

      expect(screen.getAllByRole('tab').length).toBe(2, "Expected to find 2 tabs");

  });


  it("should display advanced courses when tab clicked", async () => {

      await renderComponent(setupCourses());

      await userEvent.click(screen.getByRole('tab', {name: "Advanced"}));

      const activeTabPanel = await screen.findByRole('tabpanel');

      expect(within(activeTabPanel).getByText(/Angular Security Course/)).toBeTruthy();

  });

});
