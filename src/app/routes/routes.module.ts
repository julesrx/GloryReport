import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { SearchComponent } from '../search/search.component';
import { ReportComponent } from '../report/report.component';
import { FaqComponent } from '../faq/faq.component';

const appRoutes: Routes = [
  { path: 'search/:searchName', component: SearchComponent },
  { path: 'report/:membershipType/:membershipId', component: ReportComponent },
  { path: 'faq', component: FaqComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutesModule { }
