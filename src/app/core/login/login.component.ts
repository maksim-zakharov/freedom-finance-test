import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AuthService } from '../auth.service';
import {
  catchError,
  filter,
  finalize,
  flatMap,
} from 'rxjs/operators';
import {
  BehaviorSubject,
  fromEvent,
  merge,
  of,
} from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;

  form: FormGroup;

  submitSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private _authService: AuthService, private notificationsService: NzNotificationService, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    merge(
      fromEvent(document, 'keyup').pipe(filter((event: KeyboardEvent) => (event.key === 'Enter') || event.code === 'Enter')),
      this.submitSubject.pipe(filter((value) => value)),
    )
      .pipe(
        untilDestroyed(this),
        flatMap(() => this.loginUser()),
      )
      .subscribe();
  }

  ngOnDestroy(): void {}

  private loginUser() {
    if (this.form.invalid) {
      return of();
    }

    this.isLoading = true;
    return this._authService.login(this.form.get('login').value, this.form.get('password').value).pipe(
      catchError((err) => {
        this.notificationsService.error(err.message, null);
        return of(err);
      }),
      finalize(() => (this.isLoading = false)),
    );
  }
}
