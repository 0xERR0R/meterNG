import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChartPageRoutingModule } from './chart-routing.module';

import { ChartPage } from './chart.page';
import {NgChartsModule} from 'ng2-charts';
import {YearsFilterComponent} from "../../components/years-filter/years-filter.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartPageRoutingModule,
    NgChartsModule
  ],
  exports: [
    YearsFilterComponent
  ],
  declarations: [ChartPage, YearsFilterComponent]
})
export class ChartPageModule {}
