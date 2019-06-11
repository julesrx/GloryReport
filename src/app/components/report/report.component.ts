import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ServerResponse, PlatformErrorCodes } from 'bungie-api-ts/common';
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

import { environment } from 'src/environments/environment';
import { Report } from 'src/app/interfaces/report';
import { PostGameCarnageReport } from 'src/app/interfaces/post-game-carnage-report';
import { PostGameCarnageReportEntry } from 'src/app/interfaces/post-game-carnage-report-entry';
import { BungieHttpService } from 'src/app/services/bungie-http.service';
import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';
import { Encounter } from 'src/app/interfaces/encounter';
import { ActivityShort } from 'src/app/interfaces/activity-short';
import { DetailsComponent } from './details/details.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  // Does not work properly
  @ViewChild(DetailsComponent) childRef: DetailsComponent;

  public membershipTypeId: BehaviorSubject<string>;

  public profile: DestinyProfileComponent;
  public characters: DestinyCharacterComponent[];
  public displayName: string;

  public private: boolean;
  public message: string;

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
      this.private = false;

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
            version_at: environment.VERSION,
            destinyUserInfo: this.profile.userInfo,
            pgcrs: []
          };

          this.characters.forEach((c: DestinyCharacterComponent) => {
            this.getActivities(c, [DestinyActivityModeType.AllPvP, DestinyActivityModeType.PrivateMatchesAll]);
          })
        });
    });
  }

  getActivities(c: DestinyCharacterComponent, modes: DestinyActivityModeType[], page: number = 0, count: number = 100) {
    modes.forEach((mode: DestinyActivityModeType) => {
      this.bHttp.get('/Destiny2/' + c.membershipType + '/Account/' + c.membershipId + '/Character/' + c.characterId + '/Stats/Activities/', false, {
        count: 100,
        mode: mode,
        page: page
      }).subscribe((res: ServerResponse<DestinyActivityHistoryResults>) => {
        if (res.ErrorCode != PlatformErrorCodes.DestinyPrivacyRestriction) {
          if (res.Response.activities && res.Response.activities.length) {
            res.Response.activities.forEach((act: DestinyHistoricalStatsPeriodGroup) => {
              this.activities.push(act);
              this.getPGCR(act.activityDetails.instanceId);
            });

            this.getActivities(c, modes, page += 1, count);
          }
        } else {
          // TODO: Fix error handling, does not enter subscribe when error in response (500)
          this.private = true;
          this.message = res.ErrorStatus;
        }
      });
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
    // TODO: Improve details component destruction
    if (this.childRef) {
      console.log('yes')
      this.childRef.ngOnDestroy();
    }
    this.selection = encounter;
  }

  sortActs(activities: ActivityShort[]) {
    activities.sort((a, b) => {
      return a.period < b.period ? 1 : -1;
    });
  }

}
