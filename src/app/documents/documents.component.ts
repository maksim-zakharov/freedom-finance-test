import {Component, OnDestroy, OnInit} from '@angular/core';
import {TitleService} from '../core/title-service.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {DocumentsService} from './documents.service';
import {catchError, debounceTime, filter, flatMap, pluck, switchMap, tap} from 'rxjs/operators';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {
  isAccepted?: boolean;
  message?: string;

  document$: Observable<any>;

  private _taskSubject$: BehaviorSubject<Observable<any>> = new BehaviorSubject<Observable<any>>(undefined);

  constructor(private titleService: TitleService, private activatedRoute: ActivatedRoute, private notificationService: NzNotificationService, private documentsService: DocumentsService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Утверждение документа');

    this.document$ = this.activatedRoute.data.pipe(pluck('document'));

    this._taskSubject$.pipe(
      untilDestroyed(this),
      debounceTime(500),
      filter(value => !!value),
      flatMap(obs => obs)
    ).subscribe();
  }

  accept(documentId: number) {

    this._taskSubject$.next(
      this.documentsService.accept(documentId).pipe(tap(document => {
          this.message = 'Документ успешно утвержден';
          this.isAccepted = true;

          this.notificationService.success(this.message, null);
        }),
        catchError((err: Error) => {
          this.notificationService.error(err.message, null);
          return of();
        })
      )
    );
  }

  decline(documentId: number) {

    this._taskSubject$.next(
      this.documentsService.decline(documentId).pipe(tap(document => {
          this.message = 'Документ успешно отклонен';
          this.isAccepted = false;

          this.notificationService.success(this.message, null);
        }),
        catchError((err: Error) => {
          this.notificationService.error(err.message, null);
          return of();
        })
      )
    );
  }

  clearState() {
    this.isAccepted = undefined;
    this.message = undefined;
  }

  ngOnDestroy(): void {
  }
}
