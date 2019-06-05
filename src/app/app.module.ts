import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BungieHttpService } from './services/bungie-http.service';
import { RoutesModule } from './routes/routes.module';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { SearchComponent } from './components/search/search.component';
import { ReportComponent } from './components/report/report.component';
import { DetailsComponent } from './components/report/details/details.component';
import { PlayerCardComponent } from './components/player-card/player-card.component';
import { SortByPipe } from './pipes/sort-by.pipe';
import { FaqComponent } from './components/faq/faq.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    SearchComponent,
    ReportComponent,
    DetailsComponent,
    PlayerCardComponent,
    SortByPipe,
    FaqComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RoutesModule
  ],
  providers: [
    BungieHttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
