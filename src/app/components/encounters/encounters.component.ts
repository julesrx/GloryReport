import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { BehaviorSubject, Subscription } from 'rxjs';
import { observable, computed } from 'mobx';
import * as _ from 'lodash';
import {
  DestinyProfileComponent,
  DestinyCharacterComponent,
  DestinyProfileResponse,
  DestinyActivityHistoryResults,
  DestinyHistoricalStatsPeriodGroup,
  DestinyActivityModeType,
  DestinyPostGameCarnageReportData,
  DestinyPostGameCarnageReportEntry
} from 'bungie-api-ts/destiny2/interfaces';
import { ServerResponse, PlatformErrorCodes, BungieMembershipType } from 'bungie-api-ts/common';

import { BungieHttpService } from 'src/app/services/bungie-http.service';
import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';

@Component({
  selector: 'app-encounters',
  templateUrl: './encounters.component.html',
  styleUrls: ['./encounters.component.scss']
})
export class EncountersComponent implements OnInit, OnDestroy {

  private subs: Subscription[];

  public membershipTypeId: BehaviorSubject<string>;

  public profile: DestinyProfileComponent;
  public displayName: string;
  public characters: DestinyCharacterComponent[];

  public private: boolean;
  public message: string;

  public activities: DestinyHistoricalStatsPeriodGroup[];
  public fetched: number;

  public encounters: PlayerEncounter[];

  @observable public filter: string;
  @computed get filteredEncounters() {
    if (this.filter === '') return this.encounters;
    return this.encounters.filter(occ => {
      return occ.displayName.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1;
    });
  }

  constructor(
    private bHttp: BungieHttpService,
    private route: ActivatedRoute,
    private typeIdService: MembershipTypeIdService,
    // private localReportService: LocalstorageReportService
  ) { }

  ngOnInit() {
    this.subs = [];

    this.membershipTypeId = new BehaviorSubject('');
    this.characters = [];
    this.activities = [];
    this.fetched = 0;
    this.encounters = [];
    this.filter = '';

    this.route.params.subscribe((params: Params) => {
      if (params['membershipTypeId']) {
        this.membershipTypeId.next(params['membershipTypeId']);
      }
    });

    // TODO: Add different modes for different types of connection => slow (wait and add seconds before next request) or fast
    this.membershipTypeId.subscribe((membershipTypeId: string) => {
      let membershipType: number = this.typeIdService.getMembershipType(membershipTypeId);
      let membershipId: string = this.typeIdService.getMembershipId(membershipTypeId);

      this.private = false;

      this.subs.push(
        this.bHttp.get('Destiny2/' + membershipType + '/Profile/' + membershipId + '/', false, { components: '100,200' })
          .subscribe((res: ServerResponse<DestinyProfileResponse>) => {
            this.profile = res.Response.profile.data;
            this.displayName = this.profile.userInfo.displayName;
            Object.keys(res.Response.characters.data).forEach(key => {
              this.characters.push(res.Response.characters.data[key]);
            });

            this.characters.forEach((c: DestinyCharacterComponent) => {
              this.getActivities(c, DestinyActivityModeType.AllPvP);
            });
          })
      );
    });
  }

  getActivities(c: DestinyCharacterComponent, mode: DestinyActivityModeType, page: number = 0, count: number = 100) {
    let options: any = {
      count: 100,
      mode: mode,
      page: page
    };

    this.subs.push(
      this.bHttp.get('/Destiny2/' + c.membershipType + '/Account/' + c.membershipId + '/Character/' + c.characterId + '/Stats/Activities/', false, options)
        .subscribe((res: ServerResponse<DestinyActivityHistoryResults>) => {
          if (res.ErrorCode != PlatformErrorCodes.DestinyPrivacyRestriction) {
            if (res.Response.activities && res.Response.activities.length) {
              res.Response.activities.forEach((act: DestinyHistoricalStatsPeriodGroup) => {
                this.activities.push(act);
                this.getPGCR(act.activityDetails.instanceId);

                // TODO: Check the last update
                // this.localReportService.saveActivity(act, this.typeIdService.combine(c.membershipType, c.membershipId));
              });

              this.getActivities(c, mode, page += 1, count);
            }
          } else {
            // TODO: Fix error handling, does not enter subscribe when error in response (500)
            this.private = true;
            this.message = res.ErrorStatus;
          }
        })
    );
  }

  getPGCR(instanceId: string) {
    this.subs.push(
      this.bHttp.get('Destiny2/Stats/PostGameCarnageReport/' + instanceId + '/', true)
        .subscribe((res: ServerResponse<DestinyPostGameCarnageReportData>) => {
          this.getEncounters(res.Response);
        })
    );
  }

  getEncounters(pgcr: DestinyPostGameCarnageReportData) {
    pgcr.entries.forEach((entry: DestinyPostGameCarnageReportEntry) => {
      if (entry.player.destinyUserInfo.displayName !== this.displayName) { // TODO: Compare membershipId instead
        let enc: PlayerEncounter = this.encounters.find((e: PlayerEncounter) => {
          return e.membershipId == entry.player.destinyUserInfo.membershipId
        });

        if (enc != null && enc.count) {
          // TODO: remove pgcrs from encounters to improve performances and memory usage
          enc.count++;
        } else {
          let encounter: PlayerEncounter = {
            membershipId: entry.player.destinyUserInfo.membershipId,
            membershipType: entry.player.destinyUserInfo.membershipType,
            displayName: entry.player.destinyUserInfo.displayName,
            count: 1
          };

          this.encounters.push(encounter);
        }

        this.encounters.sort((a, b) => {
          return a.count < b.count ? 1 : -1;
        });
      } else {
        this.fetched++;
      }
    });
  }

  ngOnDestroy() {
    this.membershipTypeId.unsubscribe();
    this.subs.forEach(s => s.unsubscribe());
  }

}

export interface PlayerEncounter {
  displayName: string;
  membershipId: string;
  membershipType: BungieMembershipType;
  count: number;
}
