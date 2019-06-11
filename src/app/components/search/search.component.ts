import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { BehaviorSubject, Subscription } from 'rxjs';
import { UserInfoCard } from 'bungie-api-ts/user/interfaces';
import { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';

import { BungieHttpService } from 'src/app/services/bungie-http.service';
import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  private subs: Subscription[];

  public gamertag: BehaviorSubject<string>;
  public results: UserInfoCard[];

  constructor(
    private bHttp: BungieHttpService,
    private route: ActivatedRoute,
    private router: Router,
    private typeIdService: MembershipTypeIdService
  ) { }

  ngOnInit() {
    this.subs = [];

    this.gamertag = new BehaviorSubject('');
    this.results = [];

    this.route.params.subscribe((params: Params) => {
      if (params['gamertag']) {
        this.gamertag.next(params['gamertag']);
      }
    });

    this.gamertag.subscribe((gamertag: string) => {
      this.subs.push(
        this.bHttp.get('Destiny2/SearchDestinyPlayer/' + BungieMembershipType.All + '/' + encodeURIComponent(gamertag) + '/')
          .subscribe((res: ServerResponse<UserInfoCard[]>) => {
            this.results = res.Response;

            if (this.results.length == 1) {
              this.router.navigate(['/report', this.membershipTypeId(this.results[0])]);
            }
          })
      );
    })
  }

  membershipTypeId(user: UserInfoCard): string {
    return this.typeIdService.combine(user.membershipType, user.membershipId);
  }

  ngOnDestroy() {
    this.gamertag.unsubscribe();
    this.subs.forEach(s => s.unsubscribe());
  }

}
