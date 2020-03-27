import {
  ErrorHandler,
  Injectable,
  Injector,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '../shared/services/logger.service';
import { ErrorService } from '../shared/services/error.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse) {
    const errorService = this.injector.get(ErrorService);
    const logger = this.injector.get(LoggerService);

    let message: string;

    if (error instanceof HttpErrorResponse) {
      // Server error
      // message = errorService.getServerErrorMessage(error);
      // stackTrace = errorService.getServerErrorStackTrace(error);
      // notifier.showError(message);
      if (error && error.error && error.error.error) {
        logger.logError(error.error.error);
      }

      console.error(error);
    } else if ((<any> error)._body) {
      message = (<any> error)._body;

      // Если ошибка с бека
      if (message.indexOf('ERROR ') > -1) {
        message = message.slice(6);
      }

      // // Если ошибка с бека
      // if (message.indexOf('(addr=)') > -1) {
      //   message = message.slice(message.indexOf('(addr=)'));
      // }
      logger.logError(message);
      console.error(error);
    } else if (this.IsExpressionChangedAfterItHasBeenCheckedError(error)) {
    } else {
      // Client Error
      message = errorService.getClientErrorMessage(error);

      logger.logError(message);
      console.error(error);
    }
    // Always log errors
    // console.error(error);
  }
}
