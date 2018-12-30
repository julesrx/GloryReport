import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { ServerResponse, UserInfoCard } from 'bungie-api-ts/user';
import { BungieMembershipType } from 'bungie-api-ts/common'

import { BungieHttpService } from '../services/bungie-http.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  public searching: boolean;
  public searchResults: UserInfoCard[];

  private search: Observable<any>;
  private searchResponse: Subscription;

  constructor(
    private bHttp: BungieHttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.searching = true;

    const platform = this.activatedRoute.snapshot.params['platform'];
    const guardian = this.activatedRoute.snapshot.params['guardian'];

    this.search = this.bHttp.get(
      'https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/' + encodeURIComponent(platform) + '/' + encodeURIComponent(guardian) + '/'
    );

    this.searchResponse = this.search.subscribe(
      ((res: ServerResponse<UserInfoCard[]>) => {
        this.searchResults = res.Response;
        const result = this.searchResults[0];
      })
    );

    this.searching = false;
  }

  ngOnDestroy() {
    this.searchResponse.unsubscribe();
  }

  route(route: any[]) {
    this.router.navigate(route);
  }
}
