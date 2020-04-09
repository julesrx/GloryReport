import { Component, OnInit } from '@angular/core';
import { FormBuilder, Form, FormGroup } from '@angular/forms';

import { UserInfoCard } from 'bungie-api-ts/user/interfaces';
import { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';

import { BungieHttpService } from 'src/app/services/bungie-http.service';
import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public globalAlerts: any[];
  public users: UserInfoCard[];

  public searchForm: FormGroup;

  constructor(
    private bHttp: BungieHttpService,
    private formBuilder: FormBuilder,
    private typeIdService: MembershipTypeIdService
  ) {
    this.searchForm = this.formBuilder.group({
      gamertag: ''
    })
  }

  ngOnInit(): void {
    this.users = [];

    this.bHttp.get('GlobalAlerts/')
      .subscribe((res: ServerResponse<any>) => {
        this.globalAlerts = res.Response;
      });
  }

  search(formData: { gamertag: string }): void {
    if (formData.gamertag.length) {
      this.bHttp.get(`Destiny2/SearchDestinyPlayer/${BungieMembershipType.All}/${encodeURIComponent(formData.gamertag)}/`)
        .subscribe((res: ServerResponse<UserInfoCard[]>) => {
          this.users = res.Response;
        });
    }
  }

  getMembershipTypeId(user: UserInfoCard): string {
    return this.typeIdService.combine(user.membershipType, user.membershipId);
  }
}
