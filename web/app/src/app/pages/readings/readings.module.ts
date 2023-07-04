import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadingsPageRoutingModule } from './readings-routing.module';

import { ReadingsPage } from './readings.page';
import {ChartPageModule} from "../chart/chart.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReadingsPageRoutingModule,
        ChartPageModule
    ],
  declarations: [ReadingsPage]
})
export class ReadingsPageModule {}
