import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BungieHttpService } from 'src/app/services/bungie-http.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  public gamertag: string;
  public globalAlerts: [];

  constructor(
    private bHttp: BungieHttpService,
    private router: Router
  ) { }

  ngOnInit() {
    this.gamertag = '';

    this.bHttp.get('GlobalAlerts/')
      .subscribe((res) => {
        this.globalAlerts = res.Response;
      });
  }

  search() {
    if (this.gamertag.length) {
      this.router.navigate(['/search', this.gamertag]);
    }
  }

}
