import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CourseDialogComponent } from './course-dialog.component';
import { CoursesModule } from '../courses.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoursesService } from '../services/courses.service';
import { of } from 'rxjs';
import { Course } from '../model/course';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CourseDialogComponent', () => {
  let component: CourseDialogComponent;
  let fixture: ComponentFixture<CourseDialogComponent>;
  let coursesService: any;
  let dialogRef: any;

  const mockCourse: Course = {
    id: 1,
    titles: {
      description: 'Angular Testing Course',
      longDescription: 'Learn Angular testing in depth'
    },
    iconUrl: 'https://example.com/icon.png',
    uploadedImageUrl: 'https://example.com/uploaded.png',
    courseListIcon: 'https://example.com/list-icon.png',
    category: 'BEGINNER',
    seqNo: 1,
    lessonsCount: 10
  };

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['saveCourse']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [
        { provide: CoursesService, useValue: coursesServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockCourse }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CourseDialogComponent);
        component = fixture.componentInstance;
        coursesService = TestBed.inject(CoursesService);
        dialogRef = TestBed.inject(MatDialogRef);
      });
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with course data', () => {
    expect(component.course).toEqual(mockCourse);
  });

  it('should initialize form with course values', () => {
    expect(component.form).toBeDefined();
    expect(component.form.value.description).toBe(mockCourse.titles.description);
    expect(component.form.value.category).toBe(mockCourse.category);
    expect(component.form.value.longDescription).toBe(mockCourse.titles.longDescription);
  });

  it('should have required validators on form fields', () => {
    const form = component.form;

    expect(form.get('description').hasError('required')).toBeFalsy();
    
    form.get('description').setValue('');
    expect(form.get('description').hasError('required')).toBeTruthy();

    form.get('category').setValue('');
    expect(form.get('category').hasError('required')).toBeTruthy();

    form.get('longDescription').setValue('');
    expect(form.get('longDescription').hasError('required')).toBeTruthy();
  });

  it('should save course and close dialog on save', () => {
    coursesService.saveCourse.and.returnValue(of(mockCourse));

    component.form.patchValue({
      description: 'Updated Course',
      longDescription: 'Updated Description'
    });

    component.save();

    expect(coursesService.saveCourse).toHaveBeenCalledWith(
      mockCourse.id,
      {
        titles: {
          description: 'Updated Course',
          longDescription: 'Updated Description'
        }
      }
    );

    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should close dialog without saving on close', () => {
    component.close();

    expect(dialogRef.close).toHaveBeenCalled();
    expect(coursesService.saveCourse).not.toHaveBeenCalled();
  });

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});
