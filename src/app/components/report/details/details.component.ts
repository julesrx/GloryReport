import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, /*DoCheck, IterableDiffers*/ } from '@angular/core';

import * as moment from 'moment';
import { ServerResponse } from 'bungie-api-ts/common';
import { DestinyPostGameCarnageReportData } from 'bungie-api-ts/destiny2/interfaces';
import { BehaviorSubject, Subscription } from 'rxjs';

import { Encounter } from 'src/app/interfaces/encounter';
import { BungieHttpService } from 'src/app/services/bungie-http.service';
import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';

@Component({
  selector: 'report-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, /*DoCheck,*/ OnDestroy {

  @Input() membershipTypeId: BehaviorSubject<string>;
  @Input() encounter: Encounter;

  @Output() close: EventEmitter<any> = new EventEmitter();

  private subs: Subscription[];
  // private differ: any;

  public displayTeams: boolean;
  public ally: number;
  public adv: number;

  constructor(
    private typeIdServive: MembershipTypeIdService,
    private bHttp: BungieHttpService,
    // private differs: IterableDiffers
  ) {
    // this.differ = differs.find([]).create(null);
  }

  ngOnInit() {
    this.subs = [];

    this.displayTeams = false;
    this.ally = 0;
    this.adv = 0;
  }

  ngDoCheck() {
    // const change = this.differ.diff(this.encounter.activities);
    // console.log(change);
  }

  // TODO: Do this in report component with entries
  getTeams(): void {
    this.displayTeams = true;
    this.ally = 0;
    this.adv = 0;

    let playerTeamId: number;
    let encounterTeamId: number;

    this.membershipTypeId.subscribe((mti: string) => {
      let membershipId: string = this.typeIdServive.getMembershipId(mti);

      this.encounter.activities.forEach(a => {
        this.subs.push(
          this.bHttp.get('Destiny2/Stats/PostGameCarnageReport/' + a.instanceId + '/', true)
            .subscribe((res: ServerResponse<DestinyPostGameCarnageReportData>) => {
              // TODO: Can be rumble, i.e: no teams, so errors
              playerTeamId = res.Response.entries.find(e => e.player.destinyUserInfo.membershipId == membershipId).values['team'].basic.value;
              encounterTeamId = res.Response.entries.find(e => e.player.destinyUserInfo.membershipId == this.encounter.membershipId).values['team'].basic.value;

              playerTeamId == encounterTeamId ? this.ally++ : this.adv++;
            })
        );
      });
    });
  }

  getDate(period: string): string {
    return moment(period).format('DD/MM/YYYY HH:mm:ss');
  }

  ngOnDestroy() {
    this.encounter = null;
    this.subs.forEach(s => s.unsubscribe());
  }

}
