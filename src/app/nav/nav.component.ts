import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BungieMembershipType } from 'bungie-api-ts/user';
import { BungieHttpService } from '../services/bungie-http.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  public membershipType: number;
  public playerName: string;
  public opponentName: string;

  public membershipTypes: any[];

  constructor(
    private router: Router,
    private bHttp: BungieHttpService
  ) { }

  ngOnInit() {
    this.membershipTypes = this.bHttp.membershipTypes;

    this.membershipType = BungieMembershipType.TigerXbox;
    this.playerName = 'Myjulot';
    this.opponentName = 'NeqZaah';
  }

  search() {
    if (this.playerName.length && this.opponentName.length) {
      this.router.navigate(['/search', this.membershipType, this.playerName, this.opponentName]);
    }
  }
}
