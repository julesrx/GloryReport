import { Component, OnInit, OnDestroy } from '@angular/core';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subscription, BehaviorSubject, EMPTY } from 'rxjs';
import { ServerResponse, BungieMembershipType } from 'bungie-api-ts/common';
import { UserInfoCard } from 'bungie-api-ts/user/interfaces';
import * as _ from 'lodash';

import { DestinyService } from 'src/app/services/destiny.service';
import { getBranding } from 'src/app/utils/branding';

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

  constructor(private destiny: DestinyService) { }

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

  getIcon(membershipType: BungieMembershipType): string {
    return getBranding(membershipType).name;
  }

  getColor(membershipType: BungieMembershipType): string {
    return getBranding(membershipType).textClass;
  }

  ngOnDestroy(): void {
    if (this.response) {
      this.response.unsubscribe();
    }
  }

}
