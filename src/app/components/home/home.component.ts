import { Component, OnInit, OnDestroy } from '@angular/core';

import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Subscription, BehaviorSubject, EMPTY } from 'rxjs';
import { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';
import { UserInfoCard } from 'bungie-api-ts/user/interfaces';

import { BungieHttpService } from 'src/app/services/bungie-http.service';
import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public title = 'Glory.report';

  public gamertag: BehaviorSubject<string>;
  public users: UserInfoCard[];

  private response: Subscription;

  constructor(
    private bHttp: BungieHttpService,
    private typeIdService: MembershipTypeIdService
  ) { }

  ngOnInit(): void {
    this.users = [];
    this.gamertag = new BehaviorSubject('');
    this.response = this.gamertag
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((value: string) => {
          if (value) {
            this.users = [];
            return this.bHttp.get(`Destiny2/SearchDestinyPlayer/${BungieMembershipType.All}/${encodeURIComponent(value)}/`);
          } else { return EMPTY; }
        })
      )
      .subscribe((res: ServerResponse<UserInfoCard[]>) => {
        this.users = res.Response;
      });
  }

  get name(): string {
    return this.title.split('.')[0];
  }

  get extention(): string {
    return this.title.split('.')[1];
  }

  search(event: any): void {
    this.gamertag.next(event.target.value);
  }

  getMembershipTypeId(user: UserInfoCard): string {
    return this.typeIdService.combine(user.membershipType, user.membershipId);
  }

  ngOnDestroy(): void {
    if (this.response) {
      this.response.unsubscribe();
    }
  }

}
