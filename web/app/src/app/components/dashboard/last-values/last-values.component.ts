import {Component, OnInit} from '@angular/core';
import {MeterService} from '../../../services/meter.service';
import {Reading} from '../../../model/reading';
import {
    faListAlt
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-last-values',
    templateUrl: './last-values.component.html',
    styleUrls: ['./last-values.component.css']
})
export class LastValuesComponent implements OnInit {
    faListAlt = faListAlt;

    constructor(private meterService: MeterService) {
    }

    values: Map<string, object> = new Map<string, object>();

    ngOnInit() {
        this.meterService.getMeters().subscribe(meters => {
            this.meterService.getReadings().subscribe(readings => {
                readings = readings.sort((a: Reading, b: Reading) => a.date > b.date ? -1 : 1);
                readings.forEach(r => {
                    if (!this.values.has(r.meterId)) {
                        const meter = meters.filter(m => m.name === r.meterId)[0];
                        this.values.set(r.meterId, {value: r.value, unit: meter.unit});
                    }
                });
            });
        });
    }

}
