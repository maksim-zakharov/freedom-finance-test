import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class InitializationGuard implements CanActivate {
  constructor(public _authService: AuthService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this._authService.user) {
      return true;
    }

    if (this._authService.haveAuth) {
      return this._authService
        .requestTokenUpdate()
        .toPromise()
        .then(() => true);
    }


    this._authService.logout(state.url);
    return false;
  }
}
