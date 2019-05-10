import { Component, OnInit } from '@angular/core';

import { BungieHttpService } from '../services/bungie-http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public globalAlerts: [];

  constructor(private bHttp: BungieHttpService) { }

  ngOnInit() {
    this.bHttp
      .get('GlobalAlerts/')
      .subscribe((res) => {
        this.globalAlerts = res.Response;
      });
  }

}
