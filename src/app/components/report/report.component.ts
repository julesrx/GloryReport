import { Component, OnInit, OnDestroy } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import * as moment from 'moment';
import { BehaviorSubject, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import {
  DestinyProfileResponse,
  DestinyProfileComponent,
  DestinyCharacterComponent,
  DestinyActivityModeType,
  DestinyActivityHistoryResults,
  DestinyHistoricalStatsPeriodGroup
} from 'bungie-api-ts/destiny2/interfaces';
import { ServerResponse, PlatformErrorCodes } from 'bungie-api-ts/common';

import { GameSession } from 'src/app/interfaces/game-session';
import { CurrentUserService, CurrentUser } from 'src/app/services/current-user.service';
import { DestinyService } from 'src/app/services/destiny.service';
import { routeHasProfile, getMembershipTypeFromRoute, getMembershipIdFromRoute } from 'src/app/utils/route-utils';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {

  // TODO: add all to this array and unsub on destroy
  // private subs: Subscription[];

  public user: BehaviorSubject<any>;
  private selectedCharacter$: BehaviorSubject<DestinyCharacterComponent>;

  private activitySubs: Subscription[] = [];

  public profile: DestinyProfileComponent;
  public characters: DestinyCharacterComponent[];
  public selectedCharacter: DestinyCharacterComponent;

  public activities: DestinyHistoricalStatsPeriodGroup[];
  public sessions: GameSession[];

  public sessionLimit: number = 10;

  // TODO: add loading object array with loading type (activities, characters, pgcrs...)
  // TODO: add loadMore button
  public searchOptions: ReportSearchOptions;


  constructor(
    private destiny: DestinyService,
    private route: ActivatedRoute,
    private currentUser: CurrentUserService
  ) { }

  ngOnInit(): void {
    this.user = new BehaviorSubject(null);
    this.selectedCharacter$ = new BehaviorSubject(null);

    this.route.params
      .subscribe((params: Params) => {
        if (routeHasProfile(params)) {
          this.user.next({
            membershipType: getMembershipTypeFromRoute(params),
            membershipId: getMembershipIdFromRoute(params)
          });
        }
      });

    this.user.subscribe(user => {
      console.log(user);

      this.initSessions();
      this.characters = [];

      this.destiny.getProfile(user.membershipType, user.membershipId)
        .subscribe((res: ServerResponse<DestinyProfileResponse>) => {
          this.profile = res.Response.profile.data;
          this.currentUser.updateDisplayName(this.profile.userInfo.displayName);

          Object.keys(res.Response.characters.data).forEach(key => {
            this.characters.push(res.Response.characters.data[key]);
          });
          this.characters.sort((a, b) => a.dateLastPlayed < b.dateLastPlayed ? 1 : -1);

          // TODO: add to settings
          this.selectedCharacter$.next(this.characters[0]);
          this.selectedCharacter$.subscribe((char: DestinyCharacterComponent) => {
            // TODO: abort current requests if selectedCharacter is changed
            this.selectedCharacter = char;
            this.searchOptions = this.getNewSearchOptions();
            this.initSessions();

            this.currentUser.updateEmblemPath(char.emblemPath);

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

    this.activitySubs.push(
      this.destiny.getActivities(character.membershipType, character.membershipId, character.characterId, options)
        .subscribe((res: ServerResponse<DestinyActivityHistoryResults>) => {
          if (res.ErrorCode !== PlatformErrorCodes.DestinyPrivacyRestriction) {
            if (res.Response.activities && res.Response.activities.length) {
              this.activities = _.concat(this.activities, res.Response.activities);

              this.getSessions(res.Response.activities);
              // this.sessions.slice(0, 3).forEach(s => this.getPGCRs(character, s));

              this.searchOptions.page += 1;
              this.getActivities(character);
            }
          } else { console.error('Profile in private'); }
        })
    );
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

  // TODO: Add loadAll() and handle api ThrottleSeconds
  loadMore(): void {
    this.sessionLimit += 5;
  }

  onCharacterSelect(character: DestinyCharacterComponent): void {
    this.unsubscribeToActivitySubs();

    this.selectedCharacter$.next(character);
  }

  initSessions(): void {
    this.activities = [];
    this.sessions = [];
  }

  getNewSearchOptions(): ReportSearchOptions {
    return {
      count: 250,
      page: 0,
      mode: DestinyActivityModeType.AllPvP
    };
  }

  unsubscribeToActivitySubs(): void {
    if (this.activitySubs) {
      this.activitySubs.forEach(a => a.unsubscribe());
    }

    this.activitySubs = [];
  }

  ngOnDestroy(): void {
    this.unsubscribeToActivitySubs();
  }

}

export interface ReportSearchOptions {
  count: number;
  page: number;
  mode: DestinyActivityModeType;
}
