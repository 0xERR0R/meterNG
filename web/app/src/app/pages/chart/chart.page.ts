import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Chart, ChartData, ChartOptions, registerables} from 'chart.js';
import {ChartService} from '../../services/chart.service';
import 'chartjs-adapter-moment';
import {Meter} from "../../models/meter";
import {MeterService} from "../../services/meter.service";
import {ChartType} from "../../models/chartType";
import {ViewDidEnter} from "@ionic/angular";
import {GuiService} from "../../services/gui.service";

Chart.register(...registerables)

@Component({
  selector: 'app-chart',
  templateUrl: './chart.page.html',
  styleUrls: ['./chart.page.scss'],
})
export class ChartPage implements OnInit, ViewDidEnter {
  // Importing ViewChild. We need @ViewChild decorator to get a reference to the local variable
  // that we have added to the canvas element in the HTML template.
  @ViewChild('baseChart') private baseChart: ElementRef;


  meters: Map<string, Meter> = new Map<string, Meter>();

  public chartOptions: ChartOptions;
  public chartData: ChartData;
  selectedMeter: string;
  selectedChartType: ChartType = ChartType.total
  selectedYears: string[] = [];
  chartType: any;

  constructor(private chartService: ChartService, private meterService: MeterService, private gui: GuiService) {
  }

  getPossibleChartTypes(): Array<ChartType> {
    return Object.values(ChartType)
  }

  ngOnInit() {
    this.gui.wrapLoading(this.meterService.getMeters()).subscribe(res => {
      res.forEach(meter => this.meters.set(meter.name, meter))
      this.selectedMeter = res[0].name;
    });

  }

  ionViewDidEnter(): void {
    this.loadChartData()
  }

  loadChartData() {
    this.chartData = null;
    if (this.selectedMeter) {
      this.gui.wrapLoading(this.chartService.createChartData(this.meters.get(this.selectedMeter), this.selectedYears, this.selectedChartType)).subscribe(chartDefinition => {
        this.chartData = chartDefinition.chartData;
        this.chartType = chartDefinition.chartType;
        this.chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: chartDefinition.showLegend,
              position: "top"
            }
          },
          // TODO: pan/zoom
          scales: chartDefinition.scales
        };
      });
    }
  }

  onFilterChanged() {
    this.loadChartData();
  }

  onYearsChanged(y: string[]) {
    this.selectedYears = y;
    this.onFilterChanged();
  }
}
