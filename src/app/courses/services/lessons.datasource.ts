


import {signal} from "@angular/core";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable, BehaviorSubject, of} from "rxjs";
import {Lesson} from "../model/lesson";
import {CoursesService} from "./courses.service";
import {catchError, finalize} from "rxjs/operators";



export class LessonsDataSource implements DataSource<Lesson> {

    private lessonsSubject = new BehaviorSubject<Lesson[]>([]);

    private readonly loadingState = signal(false);

    readonly loading = this.loadingState.asReadonly();

    constructor(private coursesService: CoursesService) {

    }

    loadLessons(courseId:number,
                filter:string,
                sortDirection:string,
                pageIndex:number,
                pageSize:number) {

        this.loadingState.set(true);

        this.coursesService.findLessons(courseId, filter, sortDirection,
            pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingState.set(false))
            )
            .subscribe(lessons => this.lessonsSubject.next(lessons));

    }

    connect(collectionViewer: CollectionViewer): Observable<Lesson[]> {
        console.log("Connecting data source");
        return this.lessonsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.lessonsSubject.complete();
    }

}

