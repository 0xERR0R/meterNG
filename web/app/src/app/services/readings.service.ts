import {Injectable} from '@angular/core';
import {Reading} from '../models/reading';
import {Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Aggregation} from "../models/aggregation";

@Injectable({
  providedIn: 'root'
})
export class ReadingsService {
  constructor(private http: HttpClient) {
  }

  public getReadingsYears(): Observable<string[]> {
    return this.http.get<string[]>('/api/readingsYears');
  }

  public getReadings(meterId?: string[], years?: string[]): Observable<Reading[]> {
    return this.http.get<Reading[]>('/api/reading', {
      params: {
        meter: meterId ? meterId : [],
        years: years ? years : []
      }
    }).pipe(map((r: Reading[]) => {
      r.forEach(reading => {
        reading.date = new Date(reading.date)
      });
      return r;
    }));
  }

  public getAggregationsMonth(meterId: string, years?: string[]): Observable<Aggregation[]> {
    return this.http.get<Aggregation[]>('/api/aggregation/month', {
      params: {
        meter: meterId,
        years: years ? years : []
      }
    });
  }

  public getAggregationsYear(meterId: string, years?: string[]): Observable<Aggregation[]> {
    return this.http.get<Aggregation[]>('/api/aggregation/year', {
      params: {
        meter: meterId,
        years: years ? years : []
      }
    });
  }

  public storeReadings(readings: Reading[]): Observable<Object> {
    return this.http.post('/api/reading', readings)
  }

  public deleteReading(id: number): Observable<Object> {
    return this.http.delete('/api/reading/' + id)
  }

  public uploadImportFile(file: File, incremental: boolean): Observable<number> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('incremental', '' + incremental);
    return this.http.post('/api/admin/import', formData)
      .pipe(map(response => <number>response));
  }
}
