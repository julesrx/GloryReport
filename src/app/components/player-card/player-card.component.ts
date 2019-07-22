import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ServerResponse } from 'bungie-api-ts/common';
import { DestinyProfileResponse } from 'bungie-api-ts/destiny2/interfaces';

import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';
import { Encounter } from 'src/app/interfaces/encounter';
import { BungieHttpService } from 'src/app/services/bungie-http.service';

// Reusable component, switch between encounter or membershipTypeId
@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss']
})
export class PlayerCardComponent implements OnInit {

  @Input() encounter: Encounter;
  @Input() membershipTypeId: string;

  @Output() select: EventEmitter<any> = new EventEmitter();

  public loading: boolean;

  constructor(
    private bHttp: BungieHttpService,
    private typeIdService: MembershipTypeIdService
  ) { }

  ngOnInit() {
    this.loading = false;
  }

  getStats() {
    let membershipId: string = this.typeIdService.getMembershipId(this.membershipTypeId);
    let membershipType: number = this.typeIdService.getMembershipType(this.membershipTypeId);;

    this.loading = true;

    this.bHttp.get('Destiny2/' + membershipType + '/Profile/' + membershipId + '/', false, { components: '100,200' })
      .subscribe((res: ServerResponse<DestinyProfileResponse>) => {
        console.log(res.Response);
        this.loading = false;
      });
  }

}
