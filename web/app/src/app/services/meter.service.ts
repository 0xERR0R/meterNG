import {Injectable} from '@angular/core';
import {Meter} from '../model/meter';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Reading} from '../model/reading';
import {Aggregation} from '../model/aggregation';
import {map} from "rxjs/operators";
import {BuildInfo} from "../model/buildInfo";


@Injectable({
    providedIn: 'root'
})
export class MeterService {

    constructor(private http: HttpClient) {
    }

    public getMeters(): Observable<Meter[]> {
        return this.http.get<Meter[]>('/api/meters')
    }


    public getAggregationsMonth(meterId: string): Observable<Aggregation[]> {
        return this.http.get<Aggregation[]>('/api/aggregation/month/' + meterId);
    }

    public getAggregationsYear(meterId: string): Observable<Aggregation[]> {
        return this.http.get<Aggregation[]>('/api/aggregation/year/' + meterId);
    }

    public getReadings(meterId?: string): Observable<Reading[]> {
        return this.http.get<Reading[]>('/api/reading', meterId ? {params: {meter: meterId}} : {})
            .pipe(map((r: Reading[]) => {
                r.forEach(reading => {
                    reading.date = new Date(reading.date)
                });
                return r;
            }));
    }


    public storeReadings(readings: Reading[]): Observable<Object> {
        return this.http.post('/api/reading', readings)
    }

    public deleteReading(id: number): Observable<Object> {
        return this.http.delete('/api/reading/' + id)
    }

    public getExportedReadingsAsFile(): Observable<string> {
        return this.http.get('/api/admin/export').pipe(map(r => {
            return r.toString()
        }))
    }

    public uploadImportFile(file: File, incremental: boolean): Observable<number> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        formData.append('incremental', '' + incremental);
        return this.http.post('/api/admin/import', formData)
            .pipe(map(response => <number>response));
    }

    public getBuildInfo(): Observable<string> {
        return this.http.get<BuildInfo>('/api/admin/buildInfo').pipe(map(r => {
            return r.version;
        }))
    }
}
