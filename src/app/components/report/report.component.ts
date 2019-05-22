import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ServerResponse } from 'bungie-api-ts/common';
import {
  DestinyProfileResponse,
  DestinyProfileComponent,
  DestinyCharacterComponent,
  DestinyActivityHistoryResults,
  DestinyActivityModeType,
  DestinyHistoricalStatsPeriodGroup
} from 'bungie-api-ts/destiny2/interfaces';
import { BehaviorSubject } from 'rxjs';

import { BungieHttpService } from 'src/app/services/bungie-http.service';
import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  public membershipTypeId: BehaviorSubject<string>;

  public profile: DestinyProfileComponent;
  public characters: DestinyCharacterComponent[];
  public displayName: string;

  public activities: DestinyHistoricalStatsPeriodGroup[];

  constructor(
    private bHttp: BungieHttpService,
    private route: ActivatedRoute,
    private typeIdService: MembershipTypeIdService
  ) { }

  ngOnInit() {
    this.membershipTypeId = new BehaviorSubject('');
    this.characters = [];
    this.activities = [];

    this.route.params.subscribe((params: Params) => {
      if (params['membershipTypeId']) {
        this.membershipTypeId.next(params['membershipTypeId']);
      }
    });

    this.membershipTypeId.subscribe((membershipTypeId: string) => {
      let membershipType: number = this.typeIdService.getMembershipType(membershipTypeId);
      let membershipId: string = this.typeIdService.getMembershipId(membershipTypeId);

      this.bHttp.get('Destiny2/' + membershipType + '/Profile/' + membershipId + '/', { components: '100,200' })
        .subscribe((res: ServerResponse<DestinyProfileResponse>) => {
          this.profile = res.Response.profile.data;
          Object.keys(res.Response.characters.data).forEach(key => {
            this.characters.push(res.Response.characters.data[key]);
          });

          this.displayName = this.profile.userInfo.displayName;

          this.characters.forEach((c: DestinyCharacterComponent) => {
            this.getActivities(c, DestinyActivityModeType.AllPvP);
          })
        });
    });
  }

  getActivities(c: DestinyCharacterComponent, mode: DestinyActivityModeType, page: number = 0, count: number = 100) {
    this.bHttp.get('/Destiny2/' + c.membershipType + '/Account/' + c.membershipId + '/Character/' + c.characterId + '/Stats/Activities/', {
      count: 100,
      mode: mode,
      page: page
    }).subscribe((res: ServerResponse<DestinyActivityHistoryResults>) => {
      if (res.Response.activities && res.Response.activities.length) {
        res.Response.activities.forEach((act: DestinyHistoricalStatsPeriodGroup) => {
          this.activities.push(act);
        });

        this.getActivities(c, mode, page += 1, count);
      }
    });
  }

}
