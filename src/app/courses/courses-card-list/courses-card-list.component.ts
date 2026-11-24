import { Component, OnInit, ViewEncapsulation, inject, input, output } from '@angular/core';
import {Course} from '../model/course';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import {filter, tap} from 'rxjs/operators';
import { MatCard, MatCardHeader, MatCardTitle, MatCardImage, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css'],
    imports: [MatCard, MatCardHeader, MatCardTitle, MatCardImage, MatCardContent, MatCardActions, MatButton, RouterLink]
})
export class CoursesCardListComponent implements OnInit {
  private dialog = inject(MatDialog);


  readonly courses = input<Course[]>();

  readonly courseEdited = output();

  ngOnInit() {

  }

  editCourse(course: Course) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);


    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => this.courseEdited.emit())
      )
      .subscribe();

  }

}









