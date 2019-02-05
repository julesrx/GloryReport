import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { BungieHttpService } from '../services/bungie-http.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  public title: string;
  public searchName: string;

  public globalAlerts: [];

  constructor(
    private router: Router,
    private titleService: Title,
    private bHttp: BungieHttpService,
  ) { }

  ngOnInit() {
    this.title = this.titleService.getTitle();
    this.searchName = '';

    this.bHttp
      .get(this.bHttp.bungiePlatformEndpoint + 'GlobalAlerts/')
      .subscribe((res) => {
        this.globalAlerts = res.Response;
      });
  }

  search() {
    if (this.searchName.length) {
      this.router.navigate(['/search', this.searchName]);
    }
  }

}
