import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {delay, flatMap} from 'rxjs/operators';
import {User} from './_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public readonly _authKey = 'authUser';

  public get userObservable(): Observable<User> {
    return this._userSubject.asObservable();
  }

  public get user(): User {
    return this._userSubject.getValue();
  }

  private _userSubject: BehaviorSubject<User> = new BehaviorSubject(undefined);

  constructor(
    private activatedRoute: ActivatedRoute,
    private _http: HttpClient,
    private router: Router,
  ) {
  }

  public login(login: string, password: string) {
    return this.authorization(login, password).pipe(flatMap(() => this.redirectIfNeed()));
  }

  public logout(currentUrl?: string): Promise<boolean> {
    this.clearSession();

    return this._saveCurrentUrl(currentUrl);
  }

  get haveAuth(): boolean {
    return !!localStorage.getItem(this._authKey);
  }

  private redirectIfNeed() {
    const url = this.activatedRoute.snapshot.queryParamMap.get('redirectUrl');
    if (url) {
      // Получаем путь
      const redirectUrl = url.split('?')[0];

      if (!url.split('?')[1]) {
        return this.router.navigate([redirectUrl]);
      }

      const params = {};
      // Получаем строку с параметрами
      url
        .split('?')[1]
        // Преобразуем строку в массив из строк с параметрами
        .split('&')
        // Берем ключи и значения и заполняем пустой объект
        .map((elem) => {
          params[elem.split('=')[0]] = elem.split('=')[1];
        });
      return this.router.navigate([redirectUrl], {queryParams: params});
    } else {
      return this.router.navigate(['']);
    }
  }

  private clearSession() {
    localStorage.removeItem(this._authKey);
    this._userSubject.next(undefined);
  }

  /**
   * Сохраняем текущий урл в браузере чтобы при логине вернуться обратно
   * @param currentUrl Текущий урл
   * @private
   */
  private _saveCurrentUrl(currentUrl?: string): Promise<boolean> {
    // Урл на котором находимся сейчас
    if (!currentUrl) {
      currentUrl = this.router.url;
    }

    // Если мы уже находимся на странице логина, никуда не редиректим
    if (currentUrl.slice(0, 6) === '/login') {
      return;
    }

    // Если мы не в руте, сохраняем редирект на текущую страницу.
    if (currentUrl && currentUrl !== '/') {
      return this.router.navigate(['/', 'login'], {queryParams: {redirectUrl: currentUrl}});
    } else {
      // Если мы в руте, сохраняем редирект на рут.
      return this.router.navigate(['/', 'login']);
    }
  }

  private authorization(login: string, password: string): Observable<any> {
    const MOCK_LOGIN = 'ivanov';
    const MOCK_PASSWORD = 'ivanov';

    if (MOCK_LOGIN === login && MOCK_PASSWORD === password) {
      const user = {id: 1, firstName: 'Иван', lastName: 'Иванов'} as User;

      localStorage.setItem(this._authKey, JSON.stringify(user));
      this._userSubject.next(user);

      return of(true).pipe(delay(2000));
    } else {
      return throwError(new Error('Неправильный логин или пароль'));
    }
  }

  requestTokenUpdate(): Observable<any> {
    if (this.haveAuth) {
      const existUser = JSON.parse(localStorage.getItem(this._authKey)) as User;
      this._userSubject.next(existUser);

      return of(existUser);
    }
    return of();
  }
}
