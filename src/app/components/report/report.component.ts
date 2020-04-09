import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
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
  public sessions: any;

  constructor(
    private bHttp: BungieHttpService,
    private route: ActivatedRoute,
    private typeIdService: MembershipTypeIdService,
  ) { }

  ngOnInit(): void {
    this.characters = [];
    this.activities = [];
    this.sessions = [];

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

          this.getActivities(100, 0);
        });
    });
  }

  getActivities(count: number, page: number): void {
    let options: any = {
      count: count,
      page: page,
      mode: DestinyActivityModeType.AllPvP
    };

    this.bHttp.get(
      `/Destiny2/${this.selectedCharacter.membershipType}/Account/${this.selectedCharacter.membershipId}/Character/${this.selectedCharacter.characterId}/Stats/Activities/`,
      false,
      options)
      .subscribe((res: ServerResponse<DestinyActivityHistoryResults>) => {
        if (res.ErrorCode != PlatformErrorCodes.DestinyPrivacyRestriction) {
          if (res.Response.activities && res.Response.activities.length) {
            this.activities = _.concat(this.activities, res.Response.activities);

            this.getSessions(res.Response.activities);
            if (page < 4) {
              this.getActivities(count, page += 1);
            }
          }
        } else { console.error('Profile in private'); }
      });
  }

  getSessions(activities: DestinyHistoricalStatsPeriodGroup[]): void {
    // TODO: group by date difference (1h)
    let groups: _.Dictionary<DestinyHistoricalStatsPeriodGroup[]> = _.groupBy(activities, (act: DestinyHistoricalStatsPeriodGroup) => {
      return moment(act.period).startOf('day').format();
    });

    let typedGroups = _.map(groups, (group: DestinyHistoricalStatsPeriodGroup[], day: string) => {
      return {
        day: moment(day).format('dddd, MMMM Do YYYY'),
        activities: group
      }
    });

    // default js concat not working ?
    // no need to order for the moment
    this.sessions = _.concat(this.sessions, typedGroups)
  }

  getPGCR(instanceId: string): void {
    this.bHttp.get('Destiny2/Stats/PostGameCarnageReport/' + instanceId + '/', true)
      .subscribe((res: ServerResponse<DestinyPostGameCarnageReportData>) => { });
  }

  formatPeriod(period: string, format: string): string {
    return moment(period).format(format);
  }
}
