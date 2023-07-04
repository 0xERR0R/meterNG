import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChartPage } from './chart.page';

const routes: Routes = [
  {
    path: '',
    component: ChartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartPageRoutingModule {}
