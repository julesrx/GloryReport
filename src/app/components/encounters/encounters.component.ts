import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { BehaviorSubject, Subscription, forkJoin } from 'rxjs';
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

import { DestinyService } from 'src/app/services/destiny.service';
import { routeHasProfile, getMembershipTypeFromRoute, getMembershipIdFromRoute } from 'src/app/utils/route-utils';

@Component({
  selector: 'app-encounters',
  templateUrl: './encounters.component.html',
  styleUrls: ['./encounters.component.scss']
})
export class EncountersComponent implements OnInit, OnDestroy {

  private subs: Subscription[];

  public user: BehaviorSubject<any>;

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
    return this.filter === ''
      ? this.encounters
      : this.encounters.filter(occ => {
        return occ.displayName.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1;
      });
  }

  constructor(
    private destiny: DestinyService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subs = [];

    this.user = new BehaviorSubject(null);
    this.characters = [];
    this.activities = [];
    this.fetched = 0;
    this.encounters = [];
    this.filter = '';

    this.route.params
      .subscribe((params: Params) => {
        if (routeHasProfile(params)) {
          this.user.next({
            membershipType: getMembershipTypeFromRoute(params),
            membershipId: getMembershipIdFromRoute(params)
          });
        }
      });

    // TODO: Add different modes for different types of connection => slow (wait and add seconds before next request) or fast
    this.user.subscribe(user => {
      this.private = false;

      this.subs.push(
        this.destiny.getProfile(user.membershipType, user.membershipId)
          .subscribe((res: ServerResponse<DestinyProfileResponse>) => {
            this.profile = res.Response.profile.data;
            this.displayName = this.profile.userInfo.displayName;
            Object.keys(res.Response.characters.data).forEach(key => {
              this.characters.push(res.Response.characters.data[key]);
            });

            this.characters.forEach((c: DestinyCharacterComponent) => {
              this.getActivities({ character: c, mode: DestinyActivityModeType.AllPvP, page: 0, count: 250 });
            });
          })
      );
    });
  }

  getActivities(params: GetActivitiesParams) {
    const options: any = {
      count: params.count,
      mode: params.mode,
      page: params.page
    };

    this.subs.push(
      this.destiny.getActivities(params.character.membershipType, params.character.membershipId, params.character.characterId, options)
        .subscribe((res: ServerResponse<DestinyActivityHistoryResults>) => {
          if (res.ErrorCode !== PlatformErrorCodes.DestinyPrivacyRestriction) {
            if (res.Response.activities && res.Response.activities.length) {
              this.activities = _.concat(this.activities, res.Response.activities);
              this.fetchChunks(_.chunk(res.Response.activities, 20), 0, params);
            }
          } else {
            // TODO: Fix error handling, does not enter subscribe when error in response (500)
            this.private = true;
            this.message = res.ErrorStatus;
          }
        })
    );
  }

  // instead of waiting for the interval, use forkjoin and to requests
  // trash code
  // TODO: improve memory usage
  fetchChunks(chunks: DestinyHistoricalStatsPeriodGroup[][], chunkId: number, actParams: GetActivitiesParams): void {
    if (chunkId >= chunks.length) {
      actParams.page += 1;
      this.getActivities(actParams);
    } else {
      forkJoin(chunks[chunkId].map((act: DestinyHistoricalStatsPeriodGroup) => this.destiny.getPGCR(act.activityDetails.instanceId)))
        .pipe(
          // delay(1000) // TODO: remove this (used because all the characters are loaded at the same time)
        )
        .subscribe((res: DestinyPostGameCarnageReportData[]) => {
          res.forEach(pgcr => { this.getEncounters(pgcr); });
          this.fetchChunks(chunks, chunkId += 1, actParams);
        });
    }
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
    this.subs.forEach(s => s.unsubscribe());
  }

}

export interface PlayerEncounter {
  displayName: string;
  membershipId: string;
  membershipType: BungieMembershipType;
  count: number;
}

export interface GetActivitiesParams {
  character: DestinyCharacterComponent;
  mode: DestinyActivityModeType;
  page: number;
  count: number;
}
