import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faPlus, faCircleNotch } from '@fortawesome/free-solid-svg-icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ReportComponent } from './components/report/report.component';
import { ManifestService } from './services/manifest.service';
import { DestinyItemHashPipe } from './pipes/destiny-item-hash.pipe';
import { HomeComponent } from './components/home/home.component';
import { GlobalAlertsComponent } from './components/global-alerts/global-alerts.component';
import { ReportHeaderComponent } from './components/report/report-header/report-header.component';
import { ReportSessionComponent } from './components/report/report-session/report-session.component';
import { ReportSessionWeaponComponent } from './components/report/report-session-details/report-session-weapon/report-session-weapon.component';
import { ReportSessionDetailsComponent } from './components/report/report-session-details/report-session-details.component';
import { EncountersComponent } from './components/encounters/encounters.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ReportComponent,
    DestinyItemHashPipe,
    HomeComponent,
    GlobalAlertsComponent,
    ReportHeaderComponent,
    ReportSessionComponent,
    ReportSessionWeaponComponent,
    ReportSessionDetailsComponent,
    EncountersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [
    ManifestService,
    { provide: APP_INITIALIZER, useFactory: manifestFactory, deps: [ManifestService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private library: FaIconLibrary) {
    this.library.addIcons(faGithub, faTwitter, faPlus, faCircleNotch);
  }

}

export function manifestFactory(provider: ManifestService) {
  return () => provider.load();
}
