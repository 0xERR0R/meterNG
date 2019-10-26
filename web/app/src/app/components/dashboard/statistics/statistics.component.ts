import {Component, OnInit} from '@angular/core';
import {MeterService} from "../../../services/meter.service";
import {Aggregation} from "../../../model/aggregation";

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

    constructor(private meterService: MeterService) {
    }

    values: Map<string, object> = new Map<string, object>()

    ngOnInit() {
        this.meterService.getMeters().subscribe(meters => {
            meters.forEach(m => {
                this.meterService.getAggregationsMonth(m.name).subscribe(aggregations => {
                    aggregations = aggregations.sort((a: Aggregation, b: Aggregation) => ((a.year > b.year) || ((a.year == b.year) && (a.month > b.month))) ? -1 : 1);
                    if (aggregations.length >= 13) {
                        let tmp: number[] = [];
                        // collect last 12 month, skip current month
                        for (let i = 1; i < 13; i++) {
                            tmp.push(Number(aggregations[i].value));
                        }
                        let sum = tmp.reduce(function (a, b) {
                            return a + b;
                        });
                        let avg = sum / tmp.length;
                        this.values.set(m.name, {
                            avg: avg,
                            min: Math.min.apply(Math, tmp),
                            max: Math.max.apply(Math, tmp),
                            unit: m.unit
                        })
                    }
                })
            })
        })
    }


}
