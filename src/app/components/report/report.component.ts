import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Subscription } from 'rxjs';
import {
  DestinyProfileResponse,
  DestinyProfileComponent,
  DestinyCharacterComponent,
  DestinyActivityModeType,
  DestinyActivityHistoryResults,
  DestinyHistoricalStatsPeriodGroup,
  DestinyPostGameCarnageReportData
} from 'bungie-api-ts/destiny2/interfaces';
import { ServerResponse, PlatformErrorCodes } from 'bungie-api-ts/common';

import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';
import { BungieHttpService } from 'src/app/services/bungie-http.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  // TODO: add all to this array and unsub on destroy
  // private subs: Subscription[];

  public membershipTypeId: BehaviorSubject<string>;

  public profile: DestinyProfileComponent;
  public characters: DestinyCharacterComponent[];

  public selectedCharacter: DestinyCharacterComponent;
  public activities: DestinyHistoricalStatsPeriodGroup[];

  constructor(
    private bHttp: BungieHttpService,
    private route: ActivatedRoute,
    private typeIdService: MembershipTypeIdService,
  ) { }

  ngOnInit(): void {
    this.characters = [];
    this.activities = [];

    this.membershipTypeId = new BehaviorSubject('');

    this.route.params.subscribe((params: Params) => {
      if (params['membershipTypeId']) {
        this.membershipTypeId.next(params['membershipTypeId']);
      }
    });

    this.membershipTypeId.subscribe((membershipTypeId: string) => {
      let membershipType: number = this.typeIdService.getMembershipType(membershipTypeId);
      let membershipId: string = this.typeIdService.getMembershipId(membershipTypeId);

      this.bHttp.get(`Destiny2/${membershipType}/Profile/${membershipId}/`, false, { components: '100,200' })
        .subscribe((res: ServerResponse<DestinyProfileResponse>) => {
          this.profile = res.Response.profile.data;
          Object.keys(res.Response.characters.data).forEach(key => {
            this.characters.push(res.Response.characters.data[key]);
          });
          this.selectedCharacter = this.characters[0];

          this.getActivities();
        });
    });
  }

  getActivities(): void {
    let options: any = {
      count: 100,
      mode: DestinyActivityModeType.AllPvP,
      page: 0
    };

    this.bHttp.get(
      `/Destiny2/${this.selectedCharacter.membershipType}/Account/${this.selectedCharacter.membershipId}/Character/${this.selectedCharacter.characterId}/Stats/Activities/`,
      false,
      options)
      .subscribe((res: ServerResponse<DestinyActivityHistoryResults>) => {
        if (res.ErrorCode != PlatformErrorCodes.DestinyPrivacyRestriction) {
          if (res.Response.activities && res.Response.activities.length) {
            this.activities = res.Response.activities;
            this.activities.forEach((act: DestinyHistoricalStatsPeriodGroup) => {
              this.getPGCR(act.activityDetails.instanceId);
            });
          }
        } else { console.log('Profile in private'); }
      });
  }

  getPGCR(instanceId: string): void {
    this.bHttp.get('Destiny2/Stats/PostGameCarnageReport/' + instanceId + '/', true)
      .subscribe((res: ServerResponse<DestinyPostGameCarnageReportData>) => { });
  }
}
