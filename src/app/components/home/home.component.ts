import { Component, OnInit, OnDestroy } from '@angular/core';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subscription, BehaviorSubject, EMPTY } from 'rxjs';
import { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';
import { UserInfoCard } from 'bungie-api-ts/user/interfaces';

import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';
import { DestinyService } from 'src/app/services/destiny.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public gamertag: BehaviorSubject<string>;
  public users: UserInfoCard[];

  public loading: boolean;
  public noMatch: boolean;

  private response: Subscription;

  constructor(
    private destiny: DestinyService,
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
            this.loading = true;
            return this.destiny.searchPlayer(value);
          } else { return EMPTY; }
        })
      )
      .subscribe((res: ServerResponse<UserInfoCard[]>) => {
        this.users = res.Response;
        this.loading = false;

        this.noMatch = !this.users.length;
      });
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
