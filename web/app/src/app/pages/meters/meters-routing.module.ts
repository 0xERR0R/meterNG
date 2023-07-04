import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MetersPage } from './meters.page';

const routes: Routes = [
  {
    path: '',
    component: MetersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetersPageRoutingModule {}
