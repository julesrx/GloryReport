import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportComponent } from '../components/report/report.component';
import { SearchComponent } from '../components/search/search.component';
import { ChangelogComponent } from '../components/changelog/changelog.component';
import { FaqComponent } from '../components/faq/faq.component';
import { HomeComponent } from '../components/home/home.component';
import { ClansComponent } from '../components/clans/clans.component';

const routes: Routes = [
  { path: 'report/:membershipTypeId', component: ReportComponent },
  { path: 'search/:gamertag', component: SearchComponent },
  { path: 'changelog', component: ChangelogComponent },
  { path: 'clans', component: ClansComponent },
  { path: 'faq', component: FaqComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutesModule { }
