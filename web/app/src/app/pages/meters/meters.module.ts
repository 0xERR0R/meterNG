import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetersPageRoutingModule } from './meters-routing.module';

import { MetersPage } from './meters.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetersPageRoutingModule
  ],
  declarations: [MetersPage]
})
export class MetersPageModule {}
