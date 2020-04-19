import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import {
  DestinyProfileResponse,
  DestinyProfileComponent,
  DestinyCharacterComponent,
  DestinyActivityModeType,
  DestinyActivityHistoryResults,
  DestinyHistoricalStatsPeriodGroup,
  DestinyPostGameCarnageReportData
} from 'bungie-api-ts/destiny2/interfaces';
import { ServerResponse, PlatformErrorCodes } from 'bungie-api-ts/common';

import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';
import { BungieHttpService } from 'src/app/services/bungie-http.service';
import { GameSession } from 'src/app/interfaces/game-session';
import { CurrentUserService } from 'src/app/services/current-user.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  // TODO: add all to this array and unsub on destroy
  // private subs: Subscription[];

  private membershipTypeId: BehaviorSubject<string>;
  private selectedCharacter$: BehaviorSubject<DestinyCharacterComponent>;

  public profile: DestinyProfileComponent;
  public characters: DestinyCharacterComponent[];
  public selectedCharacter: DestinyCharacterComponent;

  public activities: DestinyHistoricalStatsPeriodGroup[];
  public sessions: GameSession[];

  // TODO: add loading object array with loading type (activities, characters, pgcrs...)
  public more = true;
  public searchOptions: ReportSearchOptions;

  constructor(
    private bHttp: BungieHttpService,
    private route: ActivatedRoute,
    private typeIdService: MembershipTypeIdService,
    private currentUserService: CurrentUserService
  ) { }

  ngOnInit(): void {
    this.membershipTypeId = new BehaviorSubject('');
    this.selectedCharacter$ = new BehaviorSubject(null);

    this.route.params.subscribe((params: Params) => {
      if (params.membershipTypeId) {
        this.membershipTypeId.next(params.membershipTypeId);
      }
    });

    this.membershipTypeId.subscribe((membershipTypeId: string) => {
      this.initSessions();
      this.characters = [];

      const membershipType: number = this.typeIdService.getMembershipType(membershipTypeId);
      const membershipId: string = this.typeIdService.getMembershipId(membershipTypeId);

      this.bHttp.get(`Destiny2/${membershipType}/Profile/${membershipId}/`, false, { components: '100,200' })
        .subscribe((res: ServerResponse<DestinyProfileResponse>) => {
          this.profile = res.Response.profile.data;
          this.currentUserService.updateDisplayName(this.profile.userInfo.displayName);

          Object.keys(res.Response.characters.data).forEach(key => {
            this.characters.push(res.Response.characters.data[key]);
          });
          this.characters.sort((a, b) => a.dateLastPlayed < b.dateLastPlayed ? 1 : -1);

          // TODO: add to settings
          this.selectedCharacter$.next(this.characters[0]);
          this.selectedCharacter$.subscribe((char: DestinyCharacterComponent) => {
            // TODO: abort current requests if selectedCharacter is changed
            this.selectedCharacter = char;
            this.searchOptions = this.initSearchOptions();
            this.initSessions();

            this.currentUserService.updateEmblemPath(char.emblemPath);

            this.getActivities(char);
          });
        });
    });
  }

  getActivities(character: DestinyCharacterComponent): void {
    const options: any = {
      count: this.searchOptions.count,
      page: this.searchOptions.page,
      mode: this.searchOptions.mode
    };

    this.bHttp.get(
      `/Destiny2/${character.membershipType}/Account/${character.membershipId}/Character/${character.characterId}/Stats/Activities/`,
      false,
      options)
      .subscribe((res: ServerResponse<DestinyActivityHistoryResults>) => {
        if (res.ErrorCode !== PlatformErrorCodes.DestinyPrivacyRestriction) {
          if (res.Response.activities && res.Response.activities.length) {
            this.more = res.Response.activities.length >= options.count;

            this.activities = _.concat(this.activities, res.Response.activities);

            this.getSessions(res.Response.activities);
            this.sessions.slice(0, 3).forEach(s => this.getPGCRs(character, s));

            if (options.page < 4) {
              this.searchOptions.page += 1;
              this.getActivities(character);
            }
          }
        } else { console.error('Profile in private'); }
      });
  }

  getSessions(activities: DestinyHistoricalStatsPeriodGroup[]): void {
    // TODO: group by date difference (1h)
    // no need to order for the moment
    const groups: _.Dictionary<DestinyHistoricalStatsPeriodGroup[]> = _.groupBy(activities, act => {
      return moment(act.period).startOf('day').format();
    });

    const sessions: GameSession[] = _.map(groups, (group, day) => {
      return {
        day,
        activities: group,
        weapons: [],
        fetched: false
      };
    });

    sessions.forEach((session: GameSession) => {
      const sess = this.sessions.find(s => s.day === session.day);
      if (sess) {
        // TODO: check if session complete
        sess.activities = _.concat(sess.activities, session.activities);
        if (sess.fetched) {
          // TODO: if loadmore is clicked and is fetched, get pgcrs (with lodash debounce), reload PGCRs on session
          // this.getPGCRs(character, sess);
        }
      } else {
        this.sessions.push(session);
      }
    });
  }

  // TODO: display medals and 'medalMatchMostDamage' in priority
  getPGCRs(character: DestinyCharacterComponent, session: GameSession): void {
    if (!session.fetched) {
      session.activities.forEach(act => {
        this.bHttp.get(`Destiny2/Stats/PostGameCarnageReport/${act.activityDetails.instanceId}/`, true)
          .subscribe((res: ServerResponse<DestinyPostGameCarnageReportData>) => {
            const pgcr: DestinyPostGameCarnageReportData = res.Response;

            pgcr.entries.filter(e => e.characterId === character.characterId).forEach(e => {
              // e.extended.weapons is undefined if the player has 0 kills 😥
              if (e.extended.weapons) {
                e.extended.weapons.forEach(weapon => {
                  if (session.weapons.some(w => w.referenceId === weapon.referenceId)) {
                    const stat = session.weapons.find(w => w.referenceId === weapon.referenceId);
                    stat.uniqueWeaponKills += weapon.values['uniqueWeaponKills'].basic.value;
                    stat.uniqueWeaponPrecisionKills += weapon.values['uniqueWeaponPrecisionKills'].basic.value;
                    stat.uniqueWeaponKillsPrecisionKills += weapon.values['uniqueWeaponKillsPrecisionKills'].basic.value;
                  } else {
                    session.weapons.push({
                      referenceId: weapon.referenceId,
                      uniqueWeaponKills: weapon.values['uniqueWeaponKills'].basic.value,
                      uniqueWeaponPrecisionKills: weapon.values['uniqueWeaponPrecisionKills'].basic.value,
                      uniqueWeaponKillsPrecisionKills: weapon.values['uniqueWeaponKillsPrecisionKills'].basic.value
                    });
                  }
                });
              }
            });
          });
      });

      session.fetched = true;
    }
  }

  onCharacterSelect(character: DestinyCharacterComponent): void {
    this.selectedCharacter$.next(character);
  }

  loadMore(): void {
    this.searchOptions.page += 1;
    this.getActivities(this.selectedCharacter);
  }

  initSessions(): void {
    this.activities = [];
    this.sessions = [];
  }

  initSearchOptions(): ReportSearchOptions {
    return {
      count: 100,
      page: 0,
      mode: DestinyActivityModeType.AllPvP
    };
  }

}

export interface ReportSearchOptions {
  count: number;
  page: number;
  mode: DestinyActivityModeType;
}
