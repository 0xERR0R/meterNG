import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MeterService} from '../../services/meter.service';
import {Meter} from '../../model/meter';
import {ChartType} from '../../model/chart-type.enum';
import {ChartDataSets, ChartOptions} from 'chart.js';
import {Color} from 'ng2-charts';
import {CHART_COlORS} from './chart-colors';
import 'chartjs-plugin-zoom';

import {ChartService} from '../../services/chart.service';
import {DeviceDetectorService} from "ngx-device-detector";


@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
    meter: Meter;
    chartTypeParam: ChartType
    allMeters: Meter[];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private chartService: ChartService,
                private meterService: MeterService,
                private deviceService: DeviceDetectorService) {
    }

    public chartOptions: (ChartOptions);
    public chartLabels: string[] = [];
    public chartType: string;
    public chartData: ChartDataSets[];
    public chartColors: Color[] = CHART_COlORS;

    ngOnInit() {
        this.meterService.getMeters().subscribe(meters => {
            this.allMeters = meters;
            // resolve meter name and chart type
            this.route.params.subscribe(p => {
                const meterId: string = p && p.meterId;
                this.chartTypeParam = p && p.chartType;
                let meterChartType = (ChartType as any)[this.chartTypeParam];
                if (meterId != null) {
                    this.meter = meters.find(m => m.name === meterId);
                }

                if (this.meter == null || meterChartType === undefined) {
                    //console.log('Fallback...');
                    this.meter = this.meter == null ? meters[0] : this.meter;
                    meterChartType = ChartType.total;
                    this.router.navigate(['chart', this.meter.name, ChartType[meterChartType]]);
                }

                this.loadChartData(meterChartType);
            });
        });


    }

    getPossibleChartTypes(): Array<String> {
        const keys = Object.keys(ChartType);
        return keys.slice(keys.length / 2)
            .filter(s => s !== this.chartTypeParam.toString());
    }

    getPossibleMeters(): Array<Meter> {
        return this.allMeters.filter(s => s !== this.meter);
    }

    loadChartData(meterChartType: ChartType) {
        this.chartData = null;
        this.chartType = null;

        this.chartService.createChartDefinition(this.meter, meterChartType).subscribe(
            chartDefinition => {
                this.chartType = chartDefinition.chartType;
                this.chartLabels = chartDefinition.chartLabels;
                this.chartData = chartDefinition.chartData;

                this.chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: !this.deviceService.isMobile() && chartDefinition.chartTitle !== null,
                        text: chartDefinition.chartTitle,
                        position: 'top'
                    },
                    legend: {
                        display: chartDefinition.showLegend,
                        position: 'bottom'
                    },
                    scales: {
                        xAxes: [{
                            type: chartDefinition.xAxisType,
                            time: chartDefinition.xAxisTime,
                            scaleLabel: {
                                display: !this.deviceService.isMobile() && chartDefinition.xLabel !== null,
                                labelString: chartDefinition.xLabel
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: !this.deviceService.isMobile() && chartDefinition.yLabel !== null,
                                labelString: chartDefinition.yLabel
                            },
                            ticks: {
                                min: 0,
                                beginAtZero: true
                            }
                        }],
                    },
                    plugins: {
                        zoom: {
                            zoom: {
                                enabled: true,
                                mode: 'x'
                            },
                            pan: {
                                enabled: true,
                                mode: 'x',
                                speed: 0.6
                            }
                        }
                    },
                };
            }
        )
    }
}
