import { NgModule } from '@angular/core';
import { Routes, RouterModule, Params } from '@angular/router';

import { ReportComponent } from './components/report/report.component';
import { HomeComponent } from './components/home/home.component';
import { EncountersComponent } from './components/encounters/encounters.component';

const baseProfileRoute = ':membershipType/:membershipId/';

const routes: Routes = [
  { path: `${baseProfileRoute}encounters`, component: EncountersComponent },
  { path: `${baseProfileRoute}report`, component: ReportComponent },
  { path: '', component: HomeComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
