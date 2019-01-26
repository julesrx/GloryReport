import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  Observable,
  empty as observableEmpty,
  combineLatest as observableCombineLatest,
  throwError as observableThrowError,
  Subscription,
} from 'rxjs';
import { map, switchMap, catchError, distinctUntilChanged } from 'rxjs/operators';

import { ServerResponse } from 'bungie-api-ts/user';
import { DestinyProfileResponse, DestinyCharacterComponent, DestinyActivityHistoryResults, DestinyItemResponse, DestinyPostGameCarnageReportData, DestinyPostGameCarnageReportEntry } from 'bungie-api-ts/destiny2';

import { BungieHttpService } from '../services/bungie-http.service';
import { PlayerOccurence } from '../player-occurence';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {

  private subs: Subscription[];

  private membershipType: Observable<string>;
  private membershipId: Observable<string>;

  private accountResponse: Observable<ServerResponse<DestinyProfileResponse>>;

  public displayName: Observable<string>;
  public characters: Observable<DestinyCharacterComponent[]>;
  public minutesPlayedTotal: Observable<number>;

  public activities: DestinyActivityHistoryResults[];
  public pgcr: DestinyPostGameCarnageReportData[];

  public playersOccurences: PlayerOccurence[];

  constructor(
    private route: ActivatedRoute,
    private bHttp: BungieHttpService
  ) { }

  ngOnInit() {
    this.subs = [];
    this.activities = [];
    this.pgcr = [];
    this.playersOccurences = [];

    this.membershipType = this.route.params
      .pipe(
        map((params: Params) => {
          return params['membershipType'];
        })
      );

    this.membershipId = this.route.params
      .pipe(
        map((params: Params) => {
          return params['membershipId'];
        })
      );

    this.accountResponse = observableCombineLatest(
      this.membershipType,
      this.membershipId
    )
      .pipe(
        map(([membershipType, membershipId]) => {
          try {
            if (membershipType && membershipId) {
              if (membershipType && membershipId) {
                return this.bHttp.endpointDestiny2 + membershipType + '/Profile/' + membershipId + '/?components=100,200';
              } else {
                return '';
              }
            }
          } catch (e) {
            return '';
          }
        }),
        distinctUntilChanged(),
        switchMap(url => {
          if (url.length) {
            return this.bHttp
              .get(url)
              .pipe(
                catchError((error: any) =>
                  observableThrowError(error.json().error || 'Server error')
                )
              );
          } else {
            return observableEmpty();
          }
        })
      );

    this.displayName = this.accountResponse
      .pipe(
        map(res => {
          return res.Response.profile.data.userInfo.displayName;
        })
      );

    this.characters = this.accountResponse
      .pipe(
        map(res => {
          const characters = [];
          try {
            Object.keys(res.Response.characters.data).forEach(key => {
              characters.push(res.Response.characters.data[key]);
            });
          } catch (e) { }
          return characters;
        })
      );

    this.minutesPlayedTotal = this.characters
      .pipe(
        map(characters => {
          let minutesPlayed = 0;
          characters.forEach(character => {
            minutesPlayed += +character.minutesPlayedTotal;
          });
          return minutesPlayed;
        })
      );

    this.subs.push(
      observableCombineLatest(
        this.membershipId,
        this.membershipType,
        this.characters
      )
        .pipe(
          distinctUntilChanged()
        )
        .subscribe(([membershipId, membershipType, characters]) => {
          this.activities = [];
          characters.forEach(character => {
            const url =
              this.bHttp.endpointDestiny2 + membershipType + '/Account/' + membershipId + '/Character/' + character.characterId + '/Stats/Activities/?mode=5&count=250&page=';
            // Search the first 3 pages of 250 activites, if there is still activites, repeat until none are found
            // addActivity is called 3 times at the same time
            for (let i = 0; i < characters.length; i++) {
              this.getActivites(url, i);
            }
          });
        })
    );
  }

  getActivites(url: string, page: number) {
    this.subs.push(
      this.bHttp
        .get(url + page)
        .subscribe((res: ServerResponse<DestinyActivityHistoryResults>) => {
          // console.log(res.Response);
          if (res.Response.activities && res.Response.activities.length) {
            this.getActivites(url, page + 3);
            res.Response.activities.forEach(activity => {
              // var act = res.Response.activities[0];
              this.bHttp
                .get('https://www.bungie.net/Platform/Destiny2/Stats/PostGameCarnageReport/' + activity.activityDetails.instanceId + '/')
                .subscribe((res: ServerResponse<DestinyPostGameCarnageReportData>) => {
                  // console.log(res.Response);
                  this.pgcr.push(res.Response);
                  this.pgcr.sort((a, b) => {
                    return new Date(a.period) > new Date(b.period) ? -1 : 1;
                  });
                  this.addPlayers(res.Response.entries);
                })
            });
          } else {
          }
        })
    )
  }

  addPlayers(entries: DestinyPostGameCarnageReportEntry[]) {
    entries.forEach((entry: DestinyPostGameCarnageReportEntry) => {
      if (this.playersOccurences) {

      }
      this.playersOccurences.push();
    })
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
