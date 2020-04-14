import { Component, OnInit } from '@angular/core';

import { BungieHttpService } from 'src/app/services/bungie-http.service';

@Component({
  selector: 'app-bungie-alerts',
  templateUrl: './bungie-alerts.component.html',
  styleUrls: ['./bungie-alerts.component.scss']
})
export class BungieAlertsComponent implements OnInit {

  public globalAlerts: any[];

  constructor(private bHttp: BungieHttpService) {
    this.bHttp.get('GlobalAlerts/')
      .subscribe((res) => {
        this.globalAlerts = res.Response;
      });
  }

  ngOnInit(): void { }

}
