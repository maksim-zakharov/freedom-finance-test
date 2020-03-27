import {Component, OnDestroy, OnInit} from '@angular/core';
import {TitleService} from '../core/title-service.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {DocumentsService} from './documents.service';
import {catchError, debounceTime, filter, flatMap, pluck, tap} from 'rxjs/operators';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../core/auth.service';
import {AcceptRequest} from './_models/accept-request';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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
  form: FormGroup;

  constructor(private _fb: FormBuilder, private titleService: TitleService, private authService: AuthService, private activatedRoute: ActivatedRoute, private notificationService: NzNotificationService, private documentsService: DocumentsService) {
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      resolution: [undefined, [Validators.required]],
      comment: ['']
    });

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
    if (this.form.invalid) {
      for (const i in this.form.controls) {
        if (this.form.controls[i]) {
          this.form.controls[i].markAsDirty();
          this.form.controls[i].updateValueAndValidity();
        }
      }
      return;
    }

    const request = {
      approver: this.authService.user.firstName,
      comment: this.form.get('comment').value,
      state: 1,
      resolution: this.form.get('resolution').value
    } as AcceptRequest;

    this._taskSubject$.next(
      this.documentsService.accept(documentId, request).pipe(tap(document => {
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
    if (this.form.invalid) {
      for (const i in this.form.controls) {
        if (this.form.controls[i]) {
          this.form.controls[i].markAsDirty();
          this.form.controls[i].updateValueAndValidity();
        }
      }
      return;
    }

    const request = {
      approver: this.authService.user.firstName,
      comment: this.form.get('comment').value,
      state: 0,
      resolution: this.form.get('resolution').value
    } as AcceptRequest;

    this._taskSubject$.next(
      this.documentsService.decline(documentId, request).pipe(tap(document => {
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
