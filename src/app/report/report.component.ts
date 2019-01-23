import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  Observable,
  empty as observableEmpty,
  combineLatest as observableCombineLatest,
  throwError as observableThrowError,
} from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { ServerResponse } from 'bungie-api-ts/user';
import { DestinyProfileResponse, DestinyCharacterComponent } from 'bungie-api-ts/destiny2';

import { BungieHttpService } from '../services/bungie-http.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {

  private membershipType: Observable<string>;
  private membershipId: Observable<string>;

  private accountResponse: Observable<ServerResponse<DestinyProfileResponse>>;

  public displayName: Observable<string>;
  public characters: Observable<DestinyCharacterComponent[]>;
  public minutesPlayedTotal: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private bHttp: BungieHttpService
  ) { }

  ngOnInit() {
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
              return membershipType && membershipId ? 'https://www.bungie.net/Platform/Destiny2/' + membershipType + '/Profile/' + membershipId + '/?components=100,200' : '';
            }
          } catch (e) {
            return '';
          }
        }),
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
  }

  ngOnDestroy() {

  }
}
