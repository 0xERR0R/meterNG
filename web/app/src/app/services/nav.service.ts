import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor(private http: HttpClient) { }

  public getLabel(): Observable<String> {
    return this.http.get<string>('/api/nav/label').pipe(map(r => r
    ))
  }
}
