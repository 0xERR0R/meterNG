import {Injectable} from '@angular/core';
import {MeterService} from './meter.service';
import {Observable, of} from 'rxjs';
import {ChartData, ChartDataset, TimeScale} from 'chart.js/auto';
import {ReadingsService} from './readings.service';
import {map} from 'rxjs/operators';
import {Meter} from '../models/meter';
import {ChartType} from "../models/chartType";
import {ReadingType} from "../models/reading";
import {ScaleType} from "chart.js";

export interface ChartDefinition {
  showLegend?: boolean;
  // chartLabels: string[];
  chartData: ChartData;
  chartType: string;
  scales: any;
}

@Injectable({
  providedIn: 'root'
})
export class ChartService {


  constructor(private readingsService: ReadingsService) {
  }

  createChartData(meter: Meter, selectedYears: string[], meterChartType: ChartType): Observable<ChartDefinition> {
    switch (meterChartType) {
      case ChartType.total:
        return this.createTotalChart(meter, selectedYears);
      case ChartType.month:
        return this.createMonthChart(meter, selectedYears);
      case ChartType.monthAll:
        return this.createMonthAllChart(meter, selectedYears);
       case ChartType.year:
         return this.createYearChart(meter, selectedYears);
    }

  }

  createTotalChart(meter: Meter, selectedYears: string[]): Observable<ChartDefinition> {
    return this.readingsService.getReadings([meter.name], selectedYears).pipe(map(result => {
      const labels: any[] = [];
      const data: number[] = [];
      result.filter(r => r.type == ReadingType.MEASURE) //
        .forEach(r => {
          labels.push(r.date);
          data.push(r.value);
        });

      return {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month'
            },
          }
        },
        showLegend: false,
        chartData: {
          labels,
          datasets: [
            {
              data
            },
          ]

        },
        chartType: 'line'
      };
    }))
  }

  createMonthChart(meter: Meter, selectedYears: string[]): Observable<ChartDefinition> {
    return this.readingsService.getAggregationsMonth(meter.name, selectedYears).pipe(map(result => {

      // map with year as key and array with 12 values (12 months)
      const yearToAggregations = new Map<number, number[]>();
      result.forEach(r => {
        if (!yearToAggregations.has(r.year)) {
          yearToAggregations.set(r.year, Array(12).fill(0));
        }
        yearToAggregations.get(r.year)[r.month - 1] = r.value;
      });

      let datasets: ChartDataset[] = [];
      const keys = Array.from(yearToAggregations.keys());
      keys.sort().forEach((key: number) => {
        datasets.push({data: yearToAggregations.get(key), label: key + ' ' + meter.name + " ("  + meter.unit + ")"})
      });

      return {
        showLegend: true,
        scales: {
          x: {
            type: 'category',
          }
        },
        chartData: {
          labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
          datasets
        },
        chartType: 'bar'
      };
    }));
  }

  createMonthAllChart(meter: Meter, selectedYears: string[]): Observable<ChartDefinition> {
    return this.readingsService.getAggregationsMonth(meter.name, selectedYears).pipe(map(result => {
      const labels: any[] = [];
      const monthVals: number[] = [];
      const perDayVals: number[] = [];

      result.forEach(r => {
        labels.push(r.month + '/' + r.year);
        monthVals.push(r.value);
        perDayVals.push(r.normalizedPerDay)
      });


      return {
        showLegend: true,
        scales: {
          x: {
            type: 'category',
          },
          y1: {
            type: 'linear',
            position: 'left',
          },
          y2: {
            type: 'linear',
            position: 'right',
          },
        },
        chartData: {
          labels,
          datasets: [
            {
              data: monthVals,
              label: "per month (" + meter.unit + ")",
              yAxisID: 'y1',
            },
            {
              data: perDayVals,
              label: "per day (" + meter.unit + ")",
              yAxisID: 'y2',
              type: 'line',
            },
          ]

        },
        chartType: 'bar'
      };
    }));
  }

  private createYearChart(meter: Meter, selectedYears: string[]): Observable<ChartDefinition> {
    return this.readingsService.getAggregationsYear(meter.name, selectedYears).pipe(map(result => {
      const labels: any[] = [];
      const data: number[] = [];
      result
        .forEach(r => {
          labels.push(r.year);
          data.push(r.value);
        });

      return {
        scales: {
          x: {
            type: 'category',
          },
        },
        showLegend: false,
        chartData: {
          labels,
          datasets: [
            {
              data
            },
          ]

        },
        chartType: 'bar'
      };
    }))
  }
}
