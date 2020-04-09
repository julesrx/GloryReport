import { Component, OnInit } from '@angular/core';
import { FormBuilder, Form, FormGroup } from '@angular/forms';

import { UserInfoCard } from 'bungie-api-ts/user/interfaces';
import { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';
import { DestinyProfileResponse, DestinyProfileComponent, DestinyCharacterComponent } from 'bungie-api-ts/destiny2/interfaces';

import { BungieHttpService } from 'src/app/services/bungie-http.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public globalAlerts: any[];
  public users: UserInfoCard[];
  public profile: DestinyProfileComponent;
  public characters: DestinyCharacterComponent[];

  public searchForm: FormGroup;

  constructor(
    private bHttp: BungieHttpService,
    private formBuilder: FormBuilder,
  ) {
    this.searchForm = this.formBuilder.group({
      gamertag: ''
    })
  }

  ngOnInit(): void {
    this.users = [];
    this.characters = [];

    this.bHttp.get('GlobalAlerts/')
      .subscribe((res: ServerResponse<any>) => {
        this.globalAlerts = res.Response;
      });
  }

  search(formData: { gamertag: string }) {
    if (formData.gamertag.length) {
      this.bHttp.get(`Destiny2/SearchDestinyPlayer/${BungieMembershipType.All}/${encodeURIComponent(formData.gamertag)}/`)
        .subscribe((res: ServerResponse<UserInfoCard[]>) => {
          this.users = res.Response;
        });
    }
  }

  selectUser(selectedUser: UserInfoCard) {
    this.bHttp.get(`Destiny2/${selectedUser.membershipType}/Profile/${selectedUser.membershipId}/`, false, { components: '100,200' })
      .subscribe((res: ServerResponse<DestinyProfileResponse>) => {
        this.profile = res.Response.profile.data;
        Object.keys(res.Response.characters.data).forEach(key => {
          this.characters.push(res.Response.characters.data[key]);
        });

        console.log(this.characters);
      });
  }

  selectCharacter(selectedCharacter: DestinyCharacterComponent) {
    console.log(selectedCharacter);
  }
}
