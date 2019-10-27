import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { GroupType, GroupResponse, GroupV2 } from 'bungie-api-ts/groupv2/interfaces';
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

  public clans: object[];

  constructor(
    private http: HttpClient,
    private bHttp: BungieHttpService,
    private router: Router
  ) { }

  ngOnInit() {
    this.name = '';
    this.names = [];
    this.clans = [];
  }

  searchClans(): void {
    if (this.clans.length) this.clans = [];

    if (this.names.length) {
      this.names.forEach(name => {
        this.bHttp.get('/GroupV2/Name/' + name + '/' + GroupType.Clan + '/')
          .subscribe(
            (res: ServerResponse<GroupResponse>) => {
              let group: GroupV2 = res.Response.detail;

              this.addClan(group.name, true, group.groupId);
            },
            (err: HttpErrorResponse) => {
              this.addClan(name, false);
            });
      });
    }
  }

  addName(): void {
    this.names.push(this.name);
    this.name = '';
  }

  addClan(name: string, found: boolean, id: string = null): void {
    this.clans.push({
      name: name,
      found: found,
      id: id
    });

    this.clans.sort((a, b) => {
      return a['name'] > b['name'] ? 1 : -1;
    });
  }
}
