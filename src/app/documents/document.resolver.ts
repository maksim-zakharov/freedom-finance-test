import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';

import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {DocumentsService} from './documents.service';
import {NzNotificationService} from 'ng-zorro-antd';

@Injectable()
export class DocumentResolver implements Resolve<any> {
  constructor(private documentsService: DocumentsService, private notificationService: NzNotificationService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> {
    const documentId = parseInt(route.params.id, 10);

    if (!documentId) {
      return this.router.navigate(['not-found']);
    }

    return this.documentsService.getById(documentId).pipe(
      catchError((err: Error) => {
        this.notificationService.error(err.message, null);
        return this.router.navigate(['not-found']);
      }),
    );
  }
}
