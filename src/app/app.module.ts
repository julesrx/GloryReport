import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BungieHttpService } from './services/bungie-http.service';
import { HttpClientModule } from '@angular/common/http';
import { RoutesModule } from './routes/routes.module';
import { SearchComponent } from './search/search.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { NavComponent } from './nav/nav.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    HomeComponent,
    FooterComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RoutesModule,
  ],
  providers: [
    BungieHttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
