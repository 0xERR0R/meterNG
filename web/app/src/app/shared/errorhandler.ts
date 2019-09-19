import { ErrorHandler, Injector, Injectable } from '@angular/core';
import { NotificationsService, Notification } from 'angular2-notifications';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class NotificationErrorHandler implements ErrorHandler {

  constructor(private notificationsService: NotificationsService) {
  }

  handleError(error) {
    let errorText: String  = error;
    if (error instanceof HttpErrorResponse) {
      let errorResp: HttpErrorResponse = error;
      errorText = errorResp.message + " (" + errorResp.error + ")"
    }
    this.notificationsService.error('Error',
      'Error! is occured, more information in console log: ' + errorText, { timeOut: 0 });
    throw (error);
  }
}
