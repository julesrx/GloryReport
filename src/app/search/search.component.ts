import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable, forkJoin } from 'rxjs';

import { ServerResponse, UserInfoCard, BungieMembershipType } from 'bungie-api-ts/user';

import { BungieHttpService } from '../services/bungie-http.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  public searching: boolean;

  public player: UserInfoCard;
  public opponent: UserInfoCard;

  private playerObs: Observable<ServerResponse<UserInfoCard>>;
  private opponentObs: Observable<ServerResponse<UserInfoCard>>;

  private searchResponse: Subscription;

  private params$: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bHttp: BungieHttpService,
  ) { }

  ngOnInit() {
    this.searching = true;

    const membershipType = +this.route.snapshot.paramMap.get('membershipType');
    const playerName = this.route.snapshot.paramMap.get('player');
    const opponentName = this.route.snapshot.paramMap.get('opponent');

    this.playerObs = this.bHttp.get(
      'https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/' + membershipType + '/' + encodeURIComponent(playerName) + '/'
    );
    this.opponentObs = this.bHttp.get(
      'https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/' + membershipType + '/' + encodeURIComponent(opponentName) + '/'
    );

    this.searchResponse = forkJoin([this.playerObs, this.opponentObs]).subscribe(
      (results) => {
        this.player = results[0].Response;
        this.opponent = results[1].Response;

        console.log(this.player)
        console.log(this.opponent)

        // this.router.navigate(['/report',this.player.membershipId, this.opponent.membershipId]);
      },
      (error) => {
        console.log(error)
      },
      () => { }
    );

    this.searching = false;
  }

  ngOnDestroy() {
    this.searchResponse.unsubscribe();
  }
}
