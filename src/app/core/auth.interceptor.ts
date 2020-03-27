import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {
  Observable,
} from 'rxjs';
import {AuthService} from './auth.service';
import {
  catchError,
} from 'rxjs/operators';
import {NzNotificationService} from 'ng-zorro-antd';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private notificationService: NzNotificationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any> | any> {
    return this._sendRequest(next, request);
  }

  private _sendRequest(next, request): Observable<any> {
    return next.handle(this.addHeadersToRequest(request)).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 504:
              console.log('Gateway Timeout');
              break;
            case 502:
              console.log('Bad Gateway');
              break;
            case 500:
              console.log('Internal Server Error');
              break;
            default:
              console.log('Unknown Error');
              break; // Неизвестная ошибка
          }
        }
        throw this.logError(err, request.url);
      }),
    );
  }

  private logError(err, url) {
    if (err.status <= 0) {
      this.notificationService.error('Нет соединения с сервером.', `Повторите попытку позже. ${url}`);
      return err;
    }

    console.log(`Error: ${err.code} Message: ${err.message}`); // ПО ТЗ

    this.notificationService.error(err.error, err.message);
    return err;
  }

  private addHeadersToRequest(request: HttpRequest<any>): HttpRequest<any> {
    const headers: { [name: string]: string | string[], Authorization?: string } = {};

    if (this.authService.user) {
      headers.Authorization = `Bearer ${this.authService.user.token}`;
    }

    return request.clone({setHeaders: headers});
  }
}
