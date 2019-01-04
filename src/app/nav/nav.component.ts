import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BungieMembershipType } from 'bungie-api-ts/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  public playerName: string;
  public opponentName: string;
  public membershipType: number;

  public membershipTypes: any[];

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.membershipTypes = [
      { title: 'Xbox', icon: 'fab fa-xbox', value: BungieMembershipType.TigerXbox },
      { title: 'Playstation', icon: 'fab fa-playstation', value: BungieMembershipType.TigerPsn },
      { title: 'PC', icon: 'fab fa-windows', value: BungieMembershipType.TigerBlizzard }
    ];

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
