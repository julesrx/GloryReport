import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import {
  Observable,
  empty as observableEmpty,
  combineLatest as observableCombineLatest,
  throwError as observableThrowError,
  Subscription,
} from 'rxjs';
import {
  map,
  switchMap,
  catchError,
  distinctUntilChanged
} from 'rxjs/operators';

import { ServerResponse } from 'bungie-api-ts/user';
import {
  DestinyProfileResponse,
  DestinyCharacterComponent,
  DestinyActivityHistoryResults,
  DestinyPostGameCarnageReportData,
  DestinyPostGameCarnageReportEntry,
  DestinyHistoricalStatsPeriodGroup,
} from 'bungie-api-ts/destiny2';

import { BungieHttpService } from '../services/bungie-http.service';
import { Occurence } from '../models/occurence';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {

  public loadings: { loading: boolean }[];

  private subs: Subscription[];

  private membershipType: Observable<string>;
  private membershipId: Observable<string>;

  private accountResponse: Observable<ServerResponse<DestinyProfileResponse>>;

  public displayName: Observable<string>;
  public characters: Observable<DestinyCharacterComponent[]>;
  public minutesPlayedTotal: Observable<number>;

  public activities: DestinyHistoricalStatsPeriodGroup[];

  public occurences: Occurence[];

  public filter: string;

  public selection: Occurence;

  // Computed property, bad performances
  get filteredOccurences() {
    if (this.filter === '') return this.occurences;
    return this.occurences.filter(occ => {
      return occ.displayName.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1;
    });
  }

  constructor(
    private route: ActivatedRoute,
    private bHttp: BungieHttpService
  ) { }

  ngOnInit() {
    this.loadings = [];
    this.subs = [];
    this.activities = [];
    this.occurences = [];

    this.filter = '';

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
                return this.bHttp.bungiePlatformEndpoint + 'Destiny2/' + membershipType + '/Profile/' + membershipId + '/?components=100,200';
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
          characters.forEach((character) => {
            const url = this.bHttp.bungiePlatformEndpoint + 'Destiny2/' + membershipType + '/Account/' + membershipId + '/Character/' + character.characterId + '/Stats/Activities/?mode=5&count=250&page=';
            this.getActivites(url, 0);
            // this.getActivites(url, 1);
            // this.getActivites(url, 2);
          });
        })
    );
  }

  getActivites(url: string, page: number) {
    const loading = { loading: true };
    this.loadings.push(loading);

    this.subs.push(
      this.bHttp
        .get(url + page)
        .subscribe((res: ServerResponse<DestinyActivityHistoryResults>) => {
          if (res.Response.activities) {
            this.getPGCR(res.Response.activities);
            // res.Response.activities.forEach(activity => {
            //   this.activities.push(activity);
            //   this.bHttp
            //     .get(this.bHttp.statsPlatformEndpoint + 'Destiny2/Stats/PostGameCarnageReport/' + activity.activityDetails.instanceId + '/')
            //     .subscribe((res: ServerResponse<DestinyPostGameCarnageReportData>) => {
            //       this.addOccurences(res.Response.entries);
            //     });
            // });
            this.getActivites(url, page + 1);
          } else { }
          loading.loading = false;
        })
    );
  }

  getPGCR(activities: DestinyHistoricalStatsPeriodGroup[]) {
    activities.forEach((activity, i) => {
      // setTimeout(() => {
      this.activities.push(activity);
      this.bHttp
        .get(this.bHttp.statsPlatformEndpoint + 'Destiny2/Stats/PostGameCarnageReport/' + activity.activityDetails.instanceId + '/')
        .subscribe((res: ServerResponse<DestinyPostGameCarnageReportData>) => {
          this.addOccurences(res.Response.entries, activity);
        });
      // }, 200 * i);
    });
  }

  addOccurences(entries: DestinyPostGameCarnageReportEntry[], activity: DestinyHistoricalStatsPeriodGroup) {
    entries.forEach((entry: DestinyPostGameCarnageReportEntry) => {
      let occurence = new Occurence(
        entry.player.destinyUserInfo.membershipId,
        entry.player.destinyUserInfo.displayName
      );

      const found = this.occurences.find((o: Occurence) => {
        if (o.membershipId == occurence.membershipId) {
          o.count++;
          o.activities.push(activity);
          return true;
        }
        return false;
      });

      if (!found) {
        occurence.activities.push(activity);
        this.occurences.push(occurence);
      }
    });

    this.occurences.sort((a, b) => {
      return a.count > b.count ? -1 : 1;
    });
    this.occurences.forEach(occ => {
      occ.activities.sort((a, b) => {
        return a.period > b.period ? -1 : 1;
      });
    });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
