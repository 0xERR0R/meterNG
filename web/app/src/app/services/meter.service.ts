import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Meter } from '../models/meter';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MeterService {
  meters: Meter[]

  constructor(private http: HttpClient) { }

  // TODO cache once
  getMeters(): Observable<Meter[]> {
    return this.http.get<Meter[]>('/api/meters')
  }
}
