import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { ServerResponse, UserInfoCard } from 'bungie-api-ts/user';

import { BungieHttpService } from '../services/bungie-http.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  public searching: boolean;
  public players: UserInfoCard[];

  private searchResponse: Observable<ServerResponse<UserInfoCard[]>>;
  private searchSubscription: Subscription;

  constructor(
    private bHttp: BungieHttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.searching = true;

    const membershipType = this.activatedRoute.snapshot.params['membershipType'];
    const guardian = this.activatedRoute.snapshot.params['guardian'];

    this.searchResponse = this.bHttp.get(
      'https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/' + encodeURIComponent(membershipType) + '/' + encodeURIComponent(guardian) + '/'
    );

    this.searchSubscription = this.searchResponse.subscribe(
      ((res: ServerResponse<UserInfoCard[]>) => {
        this.players = res.Response;
        console.log(this.players)

        if (this.players.length == 1) {
          var player = this.players[0];
          this.router.navigate(['/report', player.membershipType, player.membershipId]);
        }
      })
    );

    this.searching = false;
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  route(route: any[]) {
    this.router.navigate(route);
  }
}
