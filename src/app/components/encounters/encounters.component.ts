import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { BehaviorSubject, Subscription, Subscriber, empty, EMPTY } from 'rxjs';
import * as _ from 'lodash';
import {
  DestinyProfileComponent,
  DestinyCharacterComponent,
  DestinyProfileResponse,
  DestinyActivityHistoryResults,
  DestinyHistoricalStatsPeriodGroup,
  DestinyActivityModeType,
  DestinyPostGameCarnageReportData
} from 'bungie-api-ts/destiny2/interfaces';
import { ServerResponse, PlatformErrorCodes, BungieMembershipType } from 'bungie-api-ts/common';

import { BungieHttpService } from 'src/app/services/bungie-http.service';
import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { delay, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-encounters',
  templateUrl: './encounters.component.html',
  styleUrls: ['./encounters.component.scss']
})
export class EncountersComponent implements OnInit, OnDestroy {

  private subs: Subscription[];

  private membershipTypeId: BehaviorSubject<string>;

  public profile: DestinyProfileComponent;
  public characters: DestinyCharacterComponent[];
  public activities: DestinyHistoricalStatsPeriodGroup[];

  public playerEncounters: PlayerEncounter[];

  public fetched: number;
  public retryLater: DestinyHistoricalStatsPeriodGroup[];

  constructor(
    private bHttp: BungieHttpService,
    private route: ActivatedRoute,
    private typeIdService: MembershipTypeIdService,
    private currentUserService: CurrentUserService
  ) { }

  ngOnInit(): void {
    this.activities = [];
    this.playerEncounters = [];

    this.fetched = 0;
    this.retryLater = [];

    this.subs = [];
    this.membershipTypeId = new BehaviorSubject('');

    this.route.params.subscribe((params: Params) => {
      if (params.membershipTypeId) {
        this.membershipTypeId.next(params.membershipTypeId);
      }
    });

    this.membershipTypeId.subscribe((membershipTypeId: string) => {
      this.characters = [];

      const membershipType: number = this.typeIdService.getMembershipType(membershipTypeId);
      const membershipId: string = this.typeIdService.getMembershipId(membershipTypeId);

      this.bHttp.get(`Destiny2/${membershipType}/Profile/${membershipId}/`, false, { components: '100,200' })
        .subscribe((res: ServerResponse<DestinyProfileResponse>) => {
          this.profile = res.Response.profile.data;
          this.currentUserService.updateDisplayName(this.profile.userInfo.displayName);
          this.currentUserService.updateMembershipTypeId(this.profile.userInfo.membershipId, this.profile.userInfo.membershipType);

          Object.keys(res.Response.characters.data).forEach(key => {
            this.characters.push(res.Response.characters.data[key]);
          });
          this.characters.sort((a, b) => a.dateLastPlayed < b.dateLastPlayed ? 1 : -1);

          this.currentUserService.updateEmblemPath(this.characters[0].emblemPath);

          this.characters.forEach((char: DestinyCharacterComponent) => {
            this.getActivities(char, 0);
          });
        });
    });
  }

  getActivities(character: DestinyCharacterComponent, page: number): void {
    const options: any = {
      count: 250,
      page: page,
      mode: DestinyActivityModeType.AllPvP
    };

    this.subs.push(
      this.bHttp.get(
        `/Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
        true,
        options)
        .subscribe((res: ServerResponse<DestinyActivityHistoryResults>) => {
          if (res.ErrorCode !== PlatformErrorCodes.DestinyPrivacyRestriction) {
            if (res.Response.activities && res.Response.activities.length) {
              this.activities = _.concat(this.activities, res.Response.activities);
              this.getPGCR(res.Response.activities, 0);

              this.getActivities(character, page += 1);
            }
          } else { console.error('Profile in private'); }
        })
    );
  }

  getPGCR(activities: DestinyHistoricalStatsPeriodGroup[], index: number): void {
    const activity = activities[index];

    this.subs.push(
      this.bHttp.get(`Destiny2/Stats/PostGameCarnageReport/${activity.activityDetails.instanceId}/`, true)
        .pipe(
          delay(50),
          catchError((e) => {
            if (e.error.ErrorCode == PlatformErrorCodes.PerEndpointRequestThrottleExceeded) {
              this.retryLater.push(activity);
            }

            return EMPTY;
          })
        )
        .subscribe((res: ServerResponse<DestinyPostGameCarnageReportData>) => {
          const pgcr: DestinyPostGameCarnageReportData = res.Response;

          pgcr.entries
            .filter(e => e.player.destinyUserInfo.membershipId != this.profile.userInfo.membershipId)
            .forEach(entry => {
              if (this.playerEncounters.some(e => e.membershipId == entry.player.destinyUserInfo.membershipId)) {
                this.playerEncounters.find(e => e.membershipId == entry.player.destinyUserInfo.membershipId).count++;
              } else {
                this.playerEncounters.push({
                  displayName: entry.player.destinyUserInfo.displayName,
                  membershipId: entry.player.destinyUserInfo.membershipId,
                  membershipType: entry.player.destinyUserInfo.membershipType,
                  count: 1,
                });
              }
            });

          this.fetched++;

          if (index < activities.length) {
            this.getPGCR(activities, index += 1);
          }
        })
    );
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.forEach(s => s.unsubscribe());
    }
  }

}

export interface PlayerEncounter {
  displayName: string;
  membershipId: string;
  membershipType: BungieMembershipType;
  count: number;
}
