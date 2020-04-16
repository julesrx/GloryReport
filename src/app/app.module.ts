import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ReportComponent } from './components/report/report.component';
import { ManifestService } from './services/manifest.service';
import { DestinyItemHashPipe } from './pipes/destiny-item-hash.pipe';
import { CharacterCardComponent } from './components/character-card/character-card.component';
import { HomeComponent } from './components/home/home.component';
import { BungieAlertsComponent } from './components/bungie-alerts/bungie-alerts.component';
import { GlobalAlertsComponent } from './components/global-alerts/global-alerts.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ReportComponent,
    DestinyItemHashPipe,
    CharacterCardComponent,
    HomeComponent,
    BungieAlertsComponent,
    GlobalAlertsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    ManifestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
