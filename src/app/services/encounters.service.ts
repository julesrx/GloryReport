import { Injectable } from '@angular/core';

import { BehaviorSubject, forkJoin } from 'rxjs';
import { filter, retry } from 'rxjs/operators';
import * as _ from 'lodash';
import {
  DestinyProfileComponent,
  DestinyCharacterComponent,
  DestinyActivityModeType,
  DestinyPostGameCarnageReportData,
  DestinyPostGameCarnageReportEntry,
  DestinyHistoricalStatsPeriodGroup,
  DestinyActivityHistoryResults
} from 'bungie-api-ts/destiny2/interfaces';
import { BungieMembershipType, ServerResponse, PlatformErrorCodes } from 'bungie-api-ts/common';

import { DestinyService } from './destiny.service';
import { SessionService, SessionProfile } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class EncountersService {

  public activities$: BehaviorSubject<DestinyHistoricalStatsPeriodGroup[]>;
  public encounters$: BehaviorSubject<PlayerEncounter[]>;

  public fetched: BehaviorSubject<number>;

  private charDoneActivities: BehaviorSubject<number>;
  public charDoneLoading: BehaviorSubject<boolean>;

  private profile: DestinyProfileComponent;
  private characters: DestinyCharacterComponent[];
  private displayName: string;

  private activities: DestinyHistoricalStatsPeriodGroup[];

  private encounters: PlayerEncounter[];

  constructor(
    private session: SessionService,
    private destiny: DestinyService
  ) {
    this.encounters$ = new BehaviorSubject([]);
    this.activities$ = new BehaviorSubject([]);

    this.charDoneActivities = new BehaviorSubject(0);
    this.charDoneLoading = new BehaviorSubject(false);
    this.fetched = new BehaviorSubject(0);

    this.activities = [];
    this.encounters = [];

    this.session.uniqueProfile.subscribe((profile: SessionProfile) => {
      this.profile = profile.profile;
      this.characters = profile.characters;

      this.displayName = this.profile.userInfo.displayName;

      this.characters.forEach((c: DestinyCharacterComponent) => {
        this.getActivities({ character: c, mode: DestinyActivityModeType.AllPvP, page: 0, count: 250 });
      });

      this.charDoneActivities.pipe(filter(n => n === this.characters.length)).subscribe(() => {
        this.charDoneLoading.next(true);
        this.fetchChunks(_.chunk(this.activities, 25), 0);
      });
    });
  }

  private getActivities(params: GetActivitiesParams) {
    const options: any = {
      count: params.count,
      mode: params.mode,
      page: params.page
    };

    // request still in progress after the encounters component is destroyed
    this.destiny.getActivities(params.character.membershipType, params.character.membershipId, params.character.characterId, options)
      .subscribe((res: ServerResponse<DestinyActivityHistoryResults>) => {
        if (res.ErrorCode !== PlatformErrorCodes.DestinyPrivacyRestriction) {
          if (res.Response.activities && res.Response.activities.length) {
            // remove this.activities and only use activities$ ? (same for encounters$)
            this.activities = _.concat(this.activities, res.Response.activities);
            this.activities$.next(this.activities);

            params.page += 1;
            this.getActivities(params);
          } else {
            this.charDoneActivities.next(this.charDoneActivities.value + 1);
          }
        } else {
          // TODO: Fix error handling, does not enter subscribe when error in response (500)
          // this.private = true;
          // this.message = res.ErrorStatus;
        }
      });
  }

  private fetchChunks(chunks: DestinyHistoricalStatsPeriodGroup[][], chunkId: number): void {
    if (chunkId < chunks.length) {
      forkJoin(chunks[chunkId].map((act: DestinyHistoricalStatsPeriodGroup) => this.destiny.getPGCR(act.activityDetails.instanceId).pipe(
        retry(3)
      )))
        .subscribe((res: DestinyPostGameCarnageReportData[]) => {
          this.fetched.next(this.fetched.value + res.length);
          res.forEach(pgcr => { this.getEncounters(pgcr); });
          this.fetchChunks(chunks, chunkId += 1);
        });
    }
  }

  private getEncounters(pgcr: DestinyPostGameCarnageReportData) {
    pgcr.entries.forEach((entry: DestinyPostGameCarnageReportEntry) => {
      if (entry.player.destinyUserInfo.displayName !== this.displayName) { // TODO: Compare membershipId instead
        const enc: PlayerEncounter = this.encounters.find((e: PlayerEncounter) => {
          return e.membershipId === entry.player.destinyUserInfo.membershipId;
        });

        if (enc != null && enc.count) {
          // TODO: remove pgcrs from encounters to improve performances and memory usage
          enc.count++;
          enc.instanceIds.push(pgcr.activityDetails.instanceId);
        } else {
          this.encounters.push({
            membershipId: entry.player.destinyUserInfo.membershipId,
            membershipType: entry.player.destinyUserInfo.membershipType,
            displayName: entry.player.destinyUserInfo.displayName,
            iconPath: entry.player.destinyUserInfo.iconPath,
            instanceIds: [pgcr.activityDetails.instanceId],
            count: 1
          });
        }

        this.encounters.sort((a, b) => {
          return a.count < b.count ? 1 : -1;
        });

        this.encounters$.next(this.encounters);
      } else {
        // this.fetched++;
      }
    });
  }

}

export interface PlayerEncounter {
  displayName: string;
  membershipId: string;
  membershipType: BungieMembershipType;
  iconPath: string;
  instanceIds: string[];
  count: number;
}

export interface GetActivitiesParams {
  character: DestinyCharacterComponent;
  mode: DestinyActivityModeType;
  page: number;
  count: number;
}

