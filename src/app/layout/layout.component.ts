import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {TitleService} from '../core/title-service.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  modelSubject: BehaviorSubject<any> = new BehaviorSubject<any>({
    isCollapsed: false,
  });

  pageTitle$: Observable<string>;

  model$: Observable<any> = this.modelSubject
    .pipe(
      tap((value) =>
        value.isCollapsed
          ? localStorage.setItem('left-side-collapse', `${value.isCollapsed}`)
          : localStorage.removeItem('left-side-collapse'),
      ),
    );

  constructor(public _authService: AuthService, private titleService: TitleService) {}

  ngOnInit() {
    this.pageTitle$ = this.titleService.getTitle();

    if (localStorage.getItem('left-side-collapse')) {
      this.modelSubject.next({ isCollapsed: localStorage.getItem('left-side-collapse') === 'true' });
    }
  }
}
