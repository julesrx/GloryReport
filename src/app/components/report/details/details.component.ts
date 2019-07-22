import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';

import * as moment from 'moment';
import { ServerResponse } from 'bungie-api-ts/common';
import { DestinyPostGameCarnageReportData } from 'bungie-api-ts/destiny2/interfaces';
import { BehaviorSubject, Subscription } from 'rxjs';

import { Encounter } from 'src/app/interfaces/encounter';
import { BungieHttpService } from 'src/app/services/bungie-http.service';
import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';
import { ActivityShort } from 'src/app/interfaces/activity-short';

@Component({
  selector: 'report-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  @Input() membershipTypeId: BehaviorSubject<string>;
  @Input() encounter: Encounter;

  @Output() close: EventEmitter<any> = new EventEmitter();

  private subs: Subscription[];

  public displayTeams: boolean;
  public ally: number;
  public adv: number;

  public allys: string[];
  public advs: string[];

  public filter: string;
  get filteredActs(): ActivityShort[] {
    switch (this.filter) {
      case 'ally':
        return this.encounter.activities.filter(a => this.allys.indexOf(a.instanceId) > 1);

      case 'adv':
        return this.encounter.activities.filter(a => this.advs.indexOf(a.instanceId) > 1);

      default:
        return this.encounter.activities;
    }
  }

  constructor(
    private typeIdServive: MembershipTypeIdService,
    private bHttp: BungieHttpService
  ) { }

  ngOnInit() {
    this.subs = [];

    this.displayTeams = false;
    this.ally = 0;
    this.adv = 0;
    this.filter = 'all';
  }

  // TODO: Do this in report component with entries
  getTeams(): void {
    this.displayTeams = true;
    this.ally = 0;
    this.adv = 0;
    this.allys = [];
    this.advs = [];

    let playerTeamId: number;
    let encounterTeamId: number;

    this.membershipTypeId.subscribe((mti: string) => {
      let membershipId: string = this.typeIdServive.getMembershipId(mti);

      this.encounter.activities.forEach(a => {
        this.subs.push(
          this.bHttp.get('Destiny2/Stats/PostGameCarnageReport/' + a.instanceId + '/', true)
            .subscribe((res: ServerResponse<DestinyPostGameCarnageReportData>) => {
              // TODO: Can be rumble, i.e: no teams, so errors
              try {
                playerTeamId = res.Response.entries.find(e => e.player.destinyUserInfo.membershipId == membershipId).values['team'].basic.value;
                encounterTeamId = res.Response.entries.find(e => e.player.destinyUserInfo.membershipId == this.encounter.membershipId).values['team'].basic.value;

                if (playerTeamId == encounterTeamId) {
                  this.ally++;
                  this.allys.push(res.Response.activityDetails.instanceId);
                } else {
                  this.adv++;
                  this.advs.push(res.Response.activityDetails.instanceId);
                }
              } catch (e) {
                this.adv++;
                this.advs.push(res.Response.activityDetails.instanceId);
              }
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
