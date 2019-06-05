import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ServerResponse } from 'bungie-api-ts/common';
import {
  DestinyProfileResponse,
  DestinyProfileComponent,
  DestinyCharacterComponent,
  DestinyActivityHistoryResults,
  DestinyActivityModeType,
  DestinyHistoricalStatsPeriodGroup,
  DestinyPostGameCarnageReportData,
  DestinyPostGameCarnageReportEntry
} from 'bungie-api-ts/destiny2/interfaces';
import { BehaviorSubject } from 'rxjs';

import { Report } from 'src/app/interfaces/report';
import { PostGameCarnageReport } from 'src/app/interfaces/post-game-carnage-report';
import { PostGameCarnageReportEntry } from 'src/app/interfaces/post-game-carnage-report-entry';
import { BungieHttpService } from 'src/app/services/bungie-http.service';
import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';
import { Encounter } from 'src/app/interfaces/encounter';
import { ActivityShort } from 'src/app/interfaces/activity-short';

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
  public fetched: number;

  public report: Report;
  public encounters: Encounter[];

  public selection: Encounter;

  public filter: string;
  // TODO: improve computed property => bad performances
  get filteredEncounters() {
    if (this.filter === '') return this.encounters;
    return this.encounters.filter(occ => {
      return occ.displayName.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1;
    });
  }

  constructor(
    private bHttp: BungieHttpService,
    private route: ActivatedRoute,
    private typeIdService: MembershipTypeIdService
  ) { }

  ngOnInit() {
    this.membershipTypeId = new BehaviorSubject('');
    this.characters = [];
    this.activities = [];
    this.fetched = 0;
    this.encounters = [];
    this.filter = '';

    this.route.params.subscribe((params: Params) => {
      if (params['membershipTypeId']) {
        this.membershipTypeId.next(params['membershipTypeId']);
      }
    });

    this.membershipTypeId.subscribe((membershipTypeId: string) => {
      let membershipType: number = this.typeIdService.getMembershipType(membershipTypeId);
      let membershipId: string = this.typeIdService.getMembershipId(membershipTypeId);

      this.bHttp.get('Destiny2/' + membershipType + '/Profile/' + membershipId + '/', false, { components: '100,200' })
        .subscribe((res: ServerResponse<DestinyProfileResponse>) => {
          this.profile = res.Response.profile.data;
          Object.keys(res.Response.characters.data).forEach(key => {
            this.characters.push(res.Response.characters.data[key]);
          });

          this.displayName = this.profile.userInfo.displayName;

          this.report = {
            key: membershipTypeId,
            updated_at: new Date().getTime().toString(),
            version_at: '0.0.0', // TODO: get version number
            destinyUserInfo: this.profile.userInfo,
            pgcrs: []
          };

          this.characters.forEach((c: DestinyCharacterComponent) => {
            this.getActivities(c, DestinyActivityModeType.AllPvP);
          })
        });
    });
  }

  getActivities(c: DestinyCharacterComponent, mode: DestinyActivityModeType, page: number = 0, count: number = 100) {
    this.bHttp.get('/Destiny2/' + c.membershipType + '/Account/' + c.membershipId + '/Character/' + c.characterId + '/Stats/Activities/', false, {
      count: 100,
      mode: mode, // TODO: add PrivateMatchesAll, mode[]
      page: page
    }).subscribe((res: ServerResponse<DestinyActivityHistoryResults>) => {
      if (res.Response.activities && res.Response.activities.length) {
        res.Response.activities.forEach((act: DestinyHistoricalStatsPeriodGroup) => {
          this.activities.push(act);
          this.getPGCR(act.activityDetails.instanceId);
        });

        this.getActivities(c, mode, page += 1, count);
      }
    });
  }

  getPGCR(instanceId: string) {
    this.bHttp.get('Destiny2/Stats/PostGameCarnageReport/' + instanceId + '/', true)
      .subscribe((res: ServerResponse<DestinyPostGameCarnageReportData>) => {
        let pgcr: PostGameCarnageReport = {
          period: res.Response.period,
          activityDetails: res.Response.activityDetails,
          entries: []
        };

        res.Response.entries.forEach((ent: DestinyPostGameCarnageReportEntry) => {
          let entry: PostGameCarnageReportEntry = {
            characterClass: ent.player.characterClass,
            characterId: ent.characterId,
            player: ent.player.destinyUserInfo,
            standing: ent.standing
          };

          pgcr.entries.push(entry);
        });

        this.getEncounters(pgcr);
        this.report.pgcrs.push(pgcr);
      });
  }

  getEncounters(pgcr: PostGameCarnageReport) {
    pgcr.entries.forEach((entry: PostGameCarnageReportEntry) => {
      if (entry.player.displayName !== this.displayName) { // TODO: Compare membershipId instead
        let enc: Encounter = this.encounters.find((e: Encounter) => {
          return e.membershipId == entry.player.membershipId
        });

        let act: ActivityShort = {
          instanceId: pgcr.activityDetails.instanceId,
          period: pgcr.period
        };

        if (enc != null && enc.count) {
          // TODO: remove pgcrs from encounters to improve performances and memory usage
          enc.activities.push(act);
          enc.count++;
          this.sortActs(enc.activities); // TODO: Remove
        } else {
          let encounter: Encounter = {
            membershipId: entry.player.membershipId,
            membershipType: entry.player.membershipType,
            displayName: entry.player.displayName,
            activities: [],
            count: 1
          };
          encounter.activities.push(act);
          this.sortActs(encounter.activities); // TODO: Remove
          this.encounters.push(encounter);
        }

        this.encounters.sort((a, b) => {
          return a.count < b.count ? 1 : -1;
        });
      } else {
        this.fetched++;
      }
    });
  }

  selectPlayer(encounter: Encounter) {
    this.selection = encounter;
  }

  sortActs(activities: ActivityShort[]) {
    activities.sort((a, b) => {
      return a.period < b.period ? 1 : -1;
    });
  }

}
