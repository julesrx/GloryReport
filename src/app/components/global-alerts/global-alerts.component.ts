import { Component, OnInit } from '@angular/core';

import { ServerResponse } from 'bungie-api-ts/common';

import { BungieHttpService } from 'src/app/services/bungie-http.service';

@Component({
  selector: 'app-global-alerts',
  templateUrl: './global-alerts.component.html',
  styleUrls: ['./global-alerts.component.scss']
})
export class GlobalAlertsComponent implements OnInit {

  public globalAlerts: any[];

  constructor(private bHttp: BungieHttpService) { }

  ngOnInit(): void {
    this.bHttp.get('GlobalAlerts/')
      .subscribe((res: ServerResponse<any>) => {
        this.globalAlerts = res.Response;
      });
  }

}
