import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportComponent } from './components/report/report.component';
import { HomeComponent } from './components/home/home.component';
import { EncountersComponent } from './components/encounters/encounters.component';

const routes: Routes = [
  { path: 'report/:membershipTypeId', component: ReportComponent },
  { path: 'encounters/:membershipTypeId', component: EncountersComponent },
  { path: '', component: HomeComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
