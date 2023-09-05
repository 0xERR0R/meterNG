import { Injectable } from '@angular/core';
import {LoadingController} from "@ionic/angular";
import {from, mergeMap, Observable} from "rxjs";
import {finalize, map, tap} from "rxjs/operators";
import {flatMap} from "rxjs/internal/operators";

@Injectable({
  providedIn: 'root'
})
export class GuiService {

  constructor(private loadingController: LoadingController) { }


  public wrapLoading<T>(source: Observable<T>): Observable<T> {
    let loader: any;

    const obs = from(this.loadingController.create({
      message: 'Please wait ...'
    }));

    return obs.pipe(
      tap(loader2 => {
        loader = loader2;
        loader2.present();
      }),
      mergeMap(() => source),
      finalize(() => {
        loader.dismiss();
      })
    );

  }
}
