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

import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';
import { DestinyService } from 'src/app/services/destiny.service';

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
    if (this.filter === '') { return this.encounters; }
    return this.encounters.filter(occ => {
      return occ.displayName.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1;
    });
  }

  constructor(
    private destiny: DestinyService,
    private route: ActivatedRoute,
    private typeIdService: MembershipTypeIdService
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
      const membershipType: number = this.typeIdService.getMembershipType(membershipTypeId);
      const membershipId: string = this.typeIdService.getMembershipId(membershipTypeId);

      this.private = false;

      this.subs.push(
        this.destiny.getProfile(membershipType, membershipId)
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
    const options: any = {
      count: 100,
      mode,
      page
    };

    this.subs.push(
      this.destiny.getActivities(c.membershipType, c.membershipId, c.characterId, options)
        .subscribe((res: ServerResponse<DestinyActivityHistoryResults>) => {
          if (res.ErrorCode !== PlatformErrorCodes.DestinyPrivacyRestriction) {
            if (res.Response.activities && res.Response.activities.length) {
              this.activities = _.concat(this.activities, res.Response.activities);

              let chunks = _.chunk(res.Response.activities, 20);
              let chunkId = 0;

              let interval = setInterval(() => {
                if (chunkId >= chunks.length) {
                  clearInterval(interval);
                  this.getActivities(c, mode, page += 1, count);
                } else {
                  chunks[chunkId].forEach((act: DestinyHistoricalStatsPeriodGroup) => {
                    this.getPGCR(act.activityDetails.instanceId);
                  });
                }

                chunkId++;
              }, 1000);
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
      this.destiny.getPGCR(instanceId)
        .subscribe((res: DestinyPostGameCarnageReportData) => {
          this.getEncounters(res);
        })
    );
  }

  getEncounters(pgcr: DestinyPostGameCarnageReportData) {
    pgcr.entries.forEach((entry: DestinyPostGameCarnageReportEntry) => {
      if (entry.player.destinyUserInfo.displayName !== this.displayName) { // TODO: Compare membershipId instead
        const enc: PlayerEncounter = this.encounters.find((e: PlayerEncounter) => {
          return e.membershipId === entry.player.destinyUserInfo.membershipId;
        });

        if (enc != null && enc.count) {
          // TODO: remove pgcrs from encounters to improve performances and memory usage
          enc.count++;
        } else {
          const encounter: PlayerEncounter = {
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
