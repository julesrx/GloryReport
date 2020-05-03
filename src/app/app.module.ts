import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub, faTwitter, faXbox, faSteam, faPlaystation, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faPlus, faCircleNotch, faGamepad } from '@fortawesome/free-solid-svg-icons';

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
import { SessionService } from './services/session.service';
import { GuardianComponent } from './components/guardian/guardian.component';
import { EncounterDetailsComponent } from './components/encounters/encounter-details/encounter-details.component';
import { EncountersService } from './services/encounters.service';

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
    EncountersComponent,
    GuardianComponent,
    EncounterDetailsComponent
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
    SessionService,
    EncountersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private library: FaIconLibrary) {
    this.library.addIcons(
      faGithub,
      faTwitter,
      faPlus,
      faCircleNotch,
      faXbox,
      faSteam,
      faPlaystation,
      faGoogle,
      faGamepad
    );
  }

}
