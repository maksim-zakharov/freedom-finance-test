import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {distinctUntilKeyChanged, tap} from 'rxjs/operators';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  username: string;

  constructor(private _authService: AuthService) {
  }

  ngOnInit() {
    this._authService.userObservable
      .pipe(
        untilDestroyed(this),
        distinctUntilKeyChanged('firstName'),
        tap((user) => this.username = user.firstName),
      )
      .subscribe();
  }

  logout() {
    this._authService.logout();
  }

  ngOnDestroy(): void {
  }
}
