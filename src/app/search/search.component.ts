import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription, BehaviorSubject, empty as observableEmpty, throwError as observableThrowError } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { ServerResponse, UserInfoCard } from 'bungie-api-ts/user';

import { BungieHttpService } from '../services/bungie-http.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  public searching: boolean;

  public player: UserInfoCard;

  private membershipType: BehaviorSubject<string>;
  private playerName: BehaviorSubject<string>;

  private searchResponse: Subscription;
  private params$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private bHttp: BungieHttpService,
  ) { }

  ngOnInit() {
    // this.membershipType = new BehaviorSubject('');
    this.playerName = new BehaviorSubject('');

    this.searching = true;

    this.params$ = this.route.params.subscribe((params: Params) => {
      if (params['player']) {
        // this.membershipType.next(params['membershipType']);
        this.playerName.next(params['player']);
      }
    });

    // this.searchResponse = this.membershipType
    //   .subscribe(res => {
    //     console.log(res);
    //   });

    this.searchResponse = this.playerName
      .pipe(
        map(playerName => {
          this.searching = true;
          if (playerName.length) {
            return 'https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/1/' + encodeURIComponent(playerName) + '/';
          } else {
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
      )
      .subscribe((res: ServerResponse<UserInfoCard[]>) => {
        this.player = res.Response[0];
        console.log(this.player);

        this.searching = false;
      });

    this.searching = false;
  }

  ngOnDestroy() {
    this.searchResponse.unsubscribe();
    this.params$.unsubscribe();
  }
}
