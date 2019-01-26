import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {
  Subscription,
  BehaviorSubject,
  empty as observableEmpty,
  throwError as observableThrowError
} from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ServerResponse, UserInfoCard } from 'bungie-api-ts/user';

import { BungieHttpService } from '../services/bungie-http.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  public searching: boolean;

  public searchResults: UserInfoCard[];

  private searchName: BehaviorSubject<string>;
  private searchResponse: Subscription;
  private params$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bHttp: BungieHttpService,
  ) { }

  ngOnInit() {
    this.searchName = new BehaviorSubject('');
    this.searching = true;

    this.params$ = this.route.params.subscribe((params: Params) => {
      if (params['searchName']) {
        this.searchName.next(params['searchName']);
      }
    });

    this.searchResponse = this.searchName
      .pipe(
        map(searchName => {
          this.searching = true;
          return searchName.length ? this.bHttp.endpointDestiny2 + 'SearchDestinyPlayer/-1/' + encodeURIComponent(searchName) + '/' : '';
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
      )
      .subscribe((res: ServerResponse<UserInfoCard[]>) => {
        this.searchResults = res.Response;
        if (this.searchResults.length == 1) {
          let result = this.searchResults[0];
          this.router.navigate(['/report', result.membershipType, result.membershipId]);
        }
        this.searching = false;
      })
  }

  ngOnDestroy() {
    this.searchResponse.unsubscribe();
    this.params$.unsubscribe();
  }
}
