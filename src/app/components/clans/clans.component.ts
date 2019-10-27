import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { GroupType, GroupResponse } from 'bungie-api-ts/groupv2/interfaces';
import { BungieHttpService } from 'src/app/services/bungie-http.service';
import { ServerResponse } from 'bungie-api-ts/common';

@Component({
  selector: 'app-clans',
  templateUrl: './clans.component.html',
  styleUrls: ['./clans.component.scss']
})
export class ClansComponent implements OnInit {

  private endpoint: string = 'https://api.datamuse.com/words';

  public name: string;
  public names: string[];

  constructor(
    private http: HttpClient,
    private bHttp: BungieHttpService,
    private router: Router
  ) { }

  ngOnInit() {
    this.name = '';
    this.names = [];
  }

  searchClans(): void {
    if (this.names.length) {
      this.names.forEach(name => {
        this.bHttp.get('/GroupV2/Name/' + name + '/' + GroupType.Clan + '/')
          .subscribe(
            (res: ServerResponse<GroupResponse>) => {
              console.log('Clan found : ' + res.Response.detail.motto);
            },
            (err: HttpErrorResponse) => {
              console.log('clan not found');
            });
      });
    }
  }

  addName(): void {
    this.names.push(this.name);
    this.name = '';
  }
}
