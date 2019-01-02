import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable, Subject } from 'rxjs';

import { ServerResponse } from 'bungie-api-ts/user';
import { DestinyProfileResponse, DestinyActivityHistoryResults, DestinyCharacterComponent, DictionaryComponentResponse } from 'bungie-api-ts/destiny2';

import { BungieHttpService } from '../services/bungie-http.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {

  public destinyProfile: DestinyProfileResponse;
  public characters: DictionaryComponentResponse<DestinyCharacterComponent>;

  private accountResponse: Observable<ServerResponse<DestinyProfileResponse>>;
  private accountSubscription: Subscription;

  constructor(
    private bHttp: BungieHttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const membershipType = this.activatedRoute.snapshot.params['membershipType'];
    const membershipId = this.activatedRoute.snapshot.params['membershipId'];

    this.accountResponse = this.bHttp.get(
      'https://www.bungie.net/Platform/Destiny2/' + membershipType + '/Profile/' + membershipId + '/?components=100,200'
    );

    this.accountSubscription = this.accountResponse.subscribe(
      ((res: ServerResponse<DestinyProfileResponse>) => {
        this.destinyProfile = res.Response;
        console.log(this.destinyProfile)

        this.characters = this.destinyProfile.characters;
        console.log(this.characters);
      })
    );
  }

  ngOnDestroy() {
    this.accountSubscription.unsubscribe();
  }
}
