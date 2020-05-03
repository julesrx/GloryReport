import { NgModule } from '@angular/core';
import { Routes, RouterModule, Params } from '@angular/router';

import { ReportComponent } from './components/report/report.component';
import { HomeComponent } from './components/home/home.component';
import { EncountersComponent } from './components/encounters/encounters.component';
import { GuardianComponent } from './components/guardian/guardian.component';

const routes: Routes = [
  {
    path: ':membershipType/:membershipId', children: [
      { path: `encounters`, component: EncountersComponent },
      { path: `report`, component: ReportComponent },
      { path: '', component: GuardianComponent }
    ]
  },
  { path: '', component: HomeComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
