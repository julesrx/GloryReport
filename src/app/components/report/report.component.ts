import { Component, OnInit, OnDestroy } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  DestinyProfileComponent,
  DestinyCharacterComponent,
  DestinyActivityModeType,
  DestinyActivityHistoryResults,
  DestinyHistoricalStatsPeriodGroup
} from 'bungie-api-ts/destiny2/interfaces';
import { ServerResponse, PlatformErrorCodes } from 'bungie-api-ts/common';

import { GameSession } from 'src/app/interfaces/game-session';
import { DestinyService } from 'src/app/services/destiny.service';
import { SessionService, SessionProfile } from 'src/app/services/session.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {

  public user: BehaviorSubject<any>;
  private selectedCharacter$: BehaviorSubject<DestinyCharacterComponent>;

  private activitySubs: Subscription[] = [];

  public profile: DestinyProfileComponent;
  public characters: DestinyCharacterComponent[];
  public selectedCharacter: DestinyCharacterComponent;

  public activities: DestinyHistoricalStatsPeriodGroup[];
  public sessions: GameSession[];

  public sessionLimit = 10;

  // TODO: add loading object array with loading type (activities, characters, pgcrs...)
  public searchOptions: ReportSearchOptions;

  constructor(
    private destiny: DestinyService,
    private session: SessionService
  ) { }

  ngOnInit(): void {
    this.user = new BehaviorSubject(null);
    this.selectedCharacter$ = new BehaviorSubject(null);

    this.session.uniqueProfile.subscribe((profile: SessionProfile) => {
      this.initSessions();
      this.characters = [];

      this.profile = profile.profile;
      this.characters = profile.characters;

      this.selectedCharacter$.next(this.characters[0]);
      this.selectedCharacter$.subscribe((char: DestinyCharacterComponent) => {
        this.selectedCharacter = char;
        this.searchOptions = this.getNewSearchOptions();

        this.initSessions();
        this.getActivities(char);
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
