import {Injectable} from '@angular/core';
import {ChartType} from '../model/chart-type.enum';
import {Observable} from 'rxjs';
import {ChartDataSets, TimeScale} from 'chart.js';
import {MeterService} from './meter.service';
import {Meter} from '../model/meter';
import {map} from 'rxjs/operators';
import {TranslateService} from "@ngx-translate/core";
import {ReadingType} from "../model/reading";

export interface ChartDefinition {
    chartTitle: string;
    showLegend?: boolean;
    xLabel: string;
    yLabel: string;
    xAxisType?: string;
    xAxisTime?: TimeScale;
    chartLabels: string[];
    chartData: ChartDataSets[];
    chartType: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChartService {

    constructor(private meterService: MeterService, private translateService: TranslateService) {
    }

    createChartDefinition(meter: Meter, meterChartType: ChartType): Observable<ChartDefinition> {
        switch (meterChartType) {
            case ChartType.total:
                return this.createTotalChart(meter);
            case ChartType.month:
                return this.createMonthChart(meter);
            case ChartType.monthAll:
                return this.createMonthAllChart(meter);
            case ChartType.year:
                return this.createYearChart(meter);
        }
    }

    createTotalChart(meter: Meter): Observable<ChartDefinition> {
        return this.meterService.getReadings(meter.name).pipe(map(result => {
            const labels: any[] = [];
            const data: number[] = [];
            result.filter(r => r.type == ReadingType.MEASURE) //
                .forEach(r => {
                    labels.push(r.date);
                    data.push(r.value);
                });
            let chartTittleString = '', xLabelString = '';
            this.translateService.get("chartType.total").subscribe(val => chartTittleString = val);
            this.translateService.get("readingDate").subscribe(val => xLabelString = val);
            return {
                chartTitle: chartTittleString + ': ' + meter.name,
                xLabel: xLabelString,
                yLabel: meter.unit,
                xAxisType: 'time',
                xAxisTime: {
                    unit: 'month',
                    tooltipFormat: 'LL'
                },
                chartLabels: labels,
                chartData: [
                    {data, label: meter.name, fill: false}
                ],
                chartType: 'line'
            };
        }));
    }

    createMonthChart(meter: Meter): Observable<ChartDefinition> {
        return this.meterService.getAggregationsMonth(meter.name).pipe(map(result => {
            // map with year as key and array with 12 values (12 months)
            const yearToAggregations = new Map<number, number[]>();
            result.forEach(r => {
                if (!yearToAggregations.has(r.year)) {
                    yearToAggregations.set(r.year, Array(12).fill(0));
                }
                yearToAggregations.get(r.year)[r.month - 1] = r.value;
            });

            const chartData: ChartDataSets[] = [];
            const keys = Array.from(yearToAggregations.keys());
            keys.sort().forEach((key: number) => {
                chartData.push({data: yearToAggregations.get(key), label: key + ' ' + meter.name});

            });
            let chartTittleString = '', xLabelString = '';
            this.translateService.get("chartType.month").subscribe(val => chartTittleString = val);
            this.translateService.get("month").subscribe(val => xLabelString = val);
            return {
                chartTitle: chartTittleString + ': ' + meter.name,
                xLabel: xLabelString,
                yLabel: meter.unit,
                showLegend: true,
                chartLabels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                chartData,
                chartType: 'bar'
            };
        }));
    }

    createMonthAllChart(meter: Meter): Observable<ChartDefinition> {
        return this.meterService.getAggregationsMonth(meter.name).pipe(map(result => {
            const labels: any[] = [];
            const data: number[] = [];
            result.forEach(r => {
                labels.push(r.month + '/' + r.year);
                data.push(r.value);
            });

            let chartTittleString = '', xLabelString = '';
            this.translateService.get("chartType.monthAll").subscribe(val => chartTittleString = val);
            this.translateService.get("monthYear").subscribe(val => xLabelString = val);
            return {
                chartTitle: chartTittleString + ': ' + meter.name,
                xLabel: xLabelString,
                yLabel: meter.unit,
                chartLabels: labels,
                chartData: [
                    {data, label: meter.name}
                ],
                chartType: 'bar'
            };
        }));
    }

    createYearChart(meter: Meter): Observable<ChartDefinition> {
        return this.meterService.getAggregationsYear(meter.name).pipe(map(result => {
            const labels: any[] = [];
            const data: number[] = [];
            result.forEach(r => {
                labels.push(r.year);
                data.push(r.value);
            });
            let chartTittleString = '', xLabelString = '';
            this.translateService.get("chartType.year").subscribe(val => chartTittleString = val);
            this.translateService.get("year").subscribe(val => xLabelString = val);
            return {
                chartTitle: chartTittleString + ': ' + meter.name,
                xLabel: xLabelString,
                yLabel: meter.unit,
                chartLabels: labels,
                chartData: [
                    {data, label: meter.name}
                ],
                chartType: 'bar'
            };
        }));
    }
}
