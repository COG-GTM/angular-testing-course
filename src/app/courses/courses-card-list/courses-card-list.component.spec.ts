import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('CoursesCardListComponent', () => {

    let component: CoursesCardListComponent;
    let fixture: ComponentFixture<CoursesCardListComponent>;
    let el: DebugElement;
    let dialog: any;

    beforeEach(waitForAsync(() => {
        const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

        TestBed.configureTestingModule({
            imports: [CoursesModule, NoopAnimationsModule],
            providers: [
                { provide: MatDialog, useValue: dialogSpy }
            ]
        })
        .compileComponents()
        .then(() => {

            fixture = TestBed.createComponent(CoursesCardListComponent);
            component = fixture.componentInstance;
            el = fixture.debugElement;
            dialog = TestBed.inject(MatDialog);

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

    it('should call ngOnInit without errors', () => {
        expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should emit courseEdited when dialog closes with value', () => {
        const mockCourse = setupCourses()[0];
        const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        dialogRefSpy.afterClosed.and.returnValue(of({ description: 'Updated' }));
        dialog.open.and.returnValue(dialogRefSpy);

        spyOn(component.courseEdited, 'emit');

        component.editCourse(mockCourse);

        expect(dialog.open).toHaveBeenCalled();
        expect(component.courseEdited.emit).toHaveBeenCalled();
    });

    it('should not emit courseEdited when dialog closes without value', () => {
        const mockCourse = setupCourses()[0];
        const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        dialogRefSpy.afterClosed.and.returnValue(of(null));
        dialog.open.and.returnValue(dialogRefSpy);

        spyOn(component.courseEdited, 'emit');

        component.editCourse(mockCourse);

        expect(dialog.open).toHaveBeenCalled();
        expect(component.courseEdited.emit).not.toHaveBeenCalled();
    });

    it('should open dialog with correct configuration', () => {
        const mockCourse = setupCourses()[0];
        const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        dialogRefSpy.afterClosed.and.returnValue(of(null));
        dialog.open.and.returnValue(dialogRefSpy);

        component.editCourse(mockCourse);

        expect(dialog.open).toHaveBeenCalled();
        const dialogConfig = dialog.open.calls.mostRecent().args[1];
        expect(dialogConfig.disableClose).toBe(true);
        expect(dialogConfig.autoFocus).toBe(true);
        expect(dialogConfig.data).toBe(mockCourse);
    });

});


