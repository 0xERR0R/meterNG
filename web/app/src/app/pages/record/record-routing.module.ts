import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordPage } from './record.page';

const routes: Routes = [
  {
    path: '',
    component: RecordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordPageRoutingModule {}
