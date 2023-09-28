
import { ErrorHandler, Injector, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {ToastController} from "@ionic/angular";

@Injectable()
export class NotificationErrorHandler implements ErrorHandler {

  constructor(private toastController: ToastController) {
  }

  handleError(error) {
    let errorText: String  = error;
    if (error instanceof HttpErrorResponse) {
      let errorResp: HttpErrorResponse = error;
      errorText = errorResp.message + " (" + errorResp.error + ")"
    }
    this.presentToast('Error! is occurred, more information in console log: ' + errorText).then();
    throw (error);
  }

  async presentToast(text: string) {
    const toast = await this.toastController.create({
      message: text,
      color: "danger",
      duration: 10000,
      position: 'top',
      icon: 'sad-outline'
    });

    await toast.present();
  }
}
