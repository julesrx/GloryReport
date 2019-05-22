import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { UserInfoCard } from 'bungie-api-ts/user/interfaces';
import { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';

import { BungieHttpService } from 'src/app/services/bungie-http.service';
import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public gamertag: BehaviorSubject<string>;
  public results: UserInfoCard[];

  constructor(
    private bHttp: BungieHttpService,
    private route: ActivatedRoute,
    private typeIdService: MembershipTypeIdService
  ) { }

  ngOnInit() {
    this.gamertag = new BehaviorSubject('');
    this.results = [];

    this.route.params.subscribe((params: Params) => {
      if (params['gamertag']) {
        this.gamertag.next(params['gamertag']);
      }
    });

    this.gamertag.subscribe((gamertag: string) => {
      this.bHttp.get('Destiny2/SearchDestinyPlayer/' + BungieMembershipType.All + '/' + encodeURIComponent(gamertag) + '/')
        .subscribe((res: ServerResponse<UserInfoCard[]>) => {
          this.results = res.Response;

          if (this.results.length == 1) {
            console.log(this.results[0].displayName + ' found');
          }
        });
    })
  }

  membershipTypeId(user: UserInfoCard): string {
    return this.typeIdService.combine(user.membershipType, user.membershipId);
  }

}
