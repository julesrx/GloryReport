import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';
import { UserInfoCard } from 'bungie-api-ts/user';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { BungieHttpService } from '../services/bungie-http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public searching: boolean;
  public displayResults: boolean;
  public errors: string[];

  public player: UserInfoCard[];
  public opponent: UserInfoCard[];

  private playerObs: Observable<ServerResponse<UserInfoCard[]>>;
  private opponentObs: Observable<ServerResponse<UserInfoCard[]>>;

  private searchResponse: Subscription;

  public searchForm: FormGroup;
  public membershipTypes: any[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private bHttp: BungieHttpService,
  ) { }

  ngOnInit() {
    this.errors = [];

    this.initForm();

    this.membershipTypes = [
      { title: 'Xbox', icon: 'fab fa-xbox', value: BungieMembershipType.TigerXbox },
      { title: 'Playstation', icon: 'fab fa-playstation', value: BungieMembershipType.TigerPsn },
      { title: 'PC', icon: 'fab fa-windows', value: BungieMembershipType.TigerBlizzard }
    ];
  }

  initForm() {
    this.searchForm = this.formBuilder.group({
      membershipType: [BungieMembershipType.TigerXbox, Validators.required],
      player: ['Myjulot', Validators.required],
      opponent: ['NeqZaah', Validators.required]
    })
  }

  search() {
    this.errors = [];

    const membershipType = this.searchForm.get('membershipType').value;
    const playerName = this.searchForm.get('player').value;
    const opponentName = this.searchForm.get('opponent').value;

    this.searching = true;

    this.playerObs = this.bHttp.get(
      'https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/' + encodeURIComponent(membershipType) + '/' + encodeURIComponent(playerName) + '/'
    );
    this.opponentObs = this.bHttp.get(
      'https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/' + encodeURIComponent(membershipType) + '/' + encodeURIComponent(opponentName) + '/'
    );

    this.searchResponse = forkJoin([this.playerObs, this.opponentObs]).subscribe(
      (results) => {
        this.player = results[0].Response;
        this.opponent = results[1].Response;

        console.log(this.player)
        console.log(this.opponent)

        if (!this.player.length) {
          this.errors.push('The player ' + playerName + ' was not found');
        }
        if (!this.opponent.length) {
          this.errors.push('The player ' + opponentName + ' was not found');
        }

        if (this.player.length && this.opponent.length) {
          console.log('ALL OK');
        }
      },
      (error) => {
        console.log('ERROR')
      },
      () => {
        this.displayResults = true;
      }
    );

    // this.bHttp.get(
    //   'https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/' + encodeURIComponent(membershipType) + '/' + encodeURIComponent(playerName) + '/'
    // ).subscribe(
    //   ((res: ServerResponse<UserInfoCard[]>) => {
    //     this.player = res.Response;
    //     console.log(this.player)
    //   })
    // );

    // this.bHttp.get(
    //   'https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/' + encodeURIComponent(membershipType) + '/' + encodeURIComponent(opponentName) + '/'
    // ).subscribe(
    //   ((res: ServerResponse<UserInfoCard[]>) => {
    //     this.opponent = res.Response;
    //     console.log(this.opponent)
    //   })
    // );

    this.searching = false;
  }

  ngOnDestroy() {
    this.searchResponse.unsubscribe();
  }
}
