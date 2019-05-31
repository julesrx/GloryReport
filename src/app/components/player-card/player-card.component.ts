import { Component, OnInit, Input } from '@angular/core';

import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';
import { Encounter } from 'src/app/interfaces/encounter';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss']
})
export class PlayerCardComponent implements OnInit {

  @Input() encounter: Encounter;
  @Input() membershipTypeId: string;

  // Reusable component, switch between encounter or membershipTypeId

  // TODO: Add custom event for selection

  constructor(private typeIdService: MembershipTypeIdService) { }

  ngOnInit() { }

  getStats() {
    console.log(this.typeIdService.getMembershipId(this.membershipTypeId));
  }

}
