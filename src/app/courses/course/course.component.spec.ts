import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CourseComponent } from './course.component';
import { CoursesModule } from '../courses.module';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../services/courses.service';
import { of } from 'rxjs';
import { Course } from '../model/course';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';

describe('CourseComponent', () => {
  let component: CourseComponent;
  let fixture: ComponentFixture<CourseComponent>;
  let coursesService: any;
  let el: DebugElement;

  const mockCourse: Course = {
    id: 1,
    titles: {
      description: 'Angular Testing Course',
      longDescription: 'Learn Angular testing'
    },
    iconUrl: 'https://example.com/icon.png',
    uploadedImageUrl: 'https://example.com/uploaded.png',
    courseListIcon: 'https://example.com/list-icon.png',
    category: 'BEGINNER',
    seqNo: 1,
    lessonsCount: 10
  };

  const mockLessons = [
    { id: 1, description: 'Lesson 1', duration: '5:00', seqNo: 1, courseId: 1 },
    { id: 2, description: 'Lesson 2', duration: '10:00', seqNo: 2, courseId: 1 },
    { id: 3, description: 'Lesson 3', duration: '15:00', seqNo: 3, courseId: 1 }
  ];

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findLessons']);

    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                course: mockCourse
              }
            }
          }
        },
        { provide: CoursesService, useValue: coursesServiceSpy }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CourseComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load course from route data on init', () => {
    coursesService.findLessons.and.returnValue(of(mockLessons));

    fixture.detectChanges();

    expect(component.course).toEqual(mockCourse);
  });

  it('should initialize data source on init', () => {
    coursesService.findLessons.and.returnValue(of(mockLessons));

    fixture.detectChanges();

    expect(component.dataSource).toBeDefined();
  });

  it('should load lessons on init', () => {
    coursesService.findLessons.and.returnValue(of(mockLessons));

    fixture.detectChanges();

    expect(coursesService.findLessons).toHaveBeenCalledWith(1, '', 'asc', 0, 3);
  });

  it('should have correct displayed columns', () => {
    expect(component.displayedColumns).toEqual(['seqNo', 'description', 'duration']);
  });

  it('should call loadLessonsPage when paginator changes', waitForAsync(() => {
    coursesService.findLessons.and.returnValue(of(mockLessons));

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      spyOn(component, 'loadLessonsPage');

      component.paginator.page.emit();

      expect(component.loadLessonsPage).toHaveBeenCalled();
    });
  }));

  it('should call loadLessonsPage when sort changes', waitForAsync(() => {
    coursesService.findLessons.and.returnValue(of(mockLessons));

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      spyOn(component, 'loadLessonsPage');

      component.sort.sortChange.emit();

      expect(component.loadLessonsPage).toHaveBeenCalled();
    });
  }));

  it('should reset paginator index when sort changes', waitForAsync(() => {
    coursesService.findLessons.and.returnValue(of(mockLessons));

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      component.paginator.pageIndex = 5;

      component.sort.sortChange.emit();

      expect(component.paginator.pageIndex).toBe(0);
    });
  }));
});
