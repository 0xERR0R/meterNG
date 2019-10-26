import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChartComponent} from './components/chart/chart.component';
import {NewRecordComponent} from './components/new-record/new-record.component';
import {ReadingsComponent} from "./components/readings/readings.component";
import {AdminComponent} from "./components/admin/admin.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";


const routes: Routes = [
  { path: 'chart/:meterId/:chartType', component: ChartComponent },
  { path: 'chart/:meterId', component: ChartComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'readings', component: ReadingsComponent },
  { path: 'record', component: NewRecordComponent },
  { path: 'admin', component: AdminComponent },
    {path: 'dashboard', component: DashboardComponent},
  {
    path: '',
      redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
      redirectTo: '/dashboard',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
