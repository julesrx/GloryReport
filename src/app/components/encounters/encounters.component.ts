import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription, forkJoin, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { observable, computed } from 'mobx';
import * as _ from 'lodash';
import {
  DestinyProfileComponent,
  DestinyCharacterComponent,
  DestinyActivityHistoryResults,
  DestinyHistoricalStatsPeriodGroup,
  DestinyActivityModeType,
  DestinyPostGameCarnageReportData,
  DestinyPostGameCarnageReportEntry
} from 'bungie-api-ts/destiny2/interfaces';
import { ServerResponse, PlatformErrorCodes, BungieMembershipType } from 'bungie-api-ts/common';

import { DestinyService } from 'src/app/services/destiny.service';
import { SessionService, SessionProfile } from 'src/app/services/session.service';

@Component({
  selector: 'app-encounters',
  templateUrl: './encounters.component.html',
  styleUrls: ['./encounters.component.scss']
})
export class EncountersComponent implements OnInit, OnDestroy {

  private subs: Subscription[];

  public profile: DestinyProfileComponent;
  public displayName: string;
  public characters: DestinyCharacterComponent[];

  public private: boolean;
  public message: string;

  public charDoneActivities: BehaviorSubject<number>;

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
    private session: SessionService
  ) { }

  ngOnInit() {
    this.subs = [];

    this.characters = [];
    this.activities = [];
    this.fetched = 0;
    this.encounters = [];
    this.filter = '';

    this.charDoneActivities = new BehaviorSubject(0);

    // TODO: Add different modes for different types of connection => slow (wait and add seconds before next request) or fast
    this.session.uniqueProfile.subscribe((profile: SessionProfile) => {
      this.private = false;

      this.profile = profile.profile;
      this.characters = profile.characters;

      this.displayName = this.profile.userInfo.displayName;

      this.characters.forEach((c: DestinyCharacterComponent) => {
        this.getActivities({ character: c, mode: DestinyActivityModeType.AllPvP, page: 0, count: 250 });
      });

      this.charDoneActivities.pipe(filter(n => n === this.characters.length)).subscribe(n => {
        this.fetchChunks(_.chunk(this.activities, 20), 0);
      });
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

              params.page += 1;
              this.getActivities(params);
            } else {
              this.charDoneActivities.next(this.charDoneActivities.value + 1);
            }
          } else {
            // TODO: Fix error handling, does not enter subscribe when error in response (500)
            this.private = true;
            this.message = res.ErrorStatus;
          }
        })
    );
  }

  // TODO: trash code, improve memory usage
  fetchChunks(chunks: DestinyHistoricalStatsPeriodGroup[][], chunkId: number): void {
    if (chunkId < chunks.length) {
      this.subs.push(
        forkJoin(chunks[chunkId].map((act: DestinyHistoricalStatsPeriodGroup) => this.destiny.getPGCR(act.activityDetails.instanceId)))
          .subscribe((res: DestinyPostGameCarnageReportData[]) => {
            res.forEach(pgcr => { this.getEncounters(pgcr); });
            this.fetchChunks(chunks, chunkId += 1);
          })
      );
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
            iconPath: entry.player.destinyUserInfo.iconPath,
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
  iconPath: string;
  count: number;
}

export interface GetActivitiesParams {
  character: DestinyCharacterComponent;
  mode: DestinyActivityModeType;
  page: number;
  count: number;
}
