import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
import { BehaviorSubject, Subscription } from 'rxjs';

import { environment } from 'src/environments/environment';
import { BungieHttpService } from 'src/app/services/bungie-http.service';
import { MembershipTypeIdService } from 'src/app/services/membership-type-id.service';
// import { LocalstorageReportService } from 'src/app/services/localstorage-report.service';
import { Report } from 'src/app/interfaces/report';
import { Encounter } from 'src/app/interfaces/encounter';
import { ActivityShort } from 'src/app/interfaces/activity-short';
import { DetailsComponent } from './details/details.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {

  // FIXME: Does not work properly
  @ViewChild(DetailsComponent) childRef: DetailsComponent;

  private subs: Subscription[];

  public membershipTypeId: BehaviorSubject<string>;

  public profile: DestinyProfileComponent;
  public displayName: string;
  public characters: DestinyCharacterComponent[];

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
    private typeIdService: MembershipTypeIdService,
    // private localReportService: LocalstorageReportService
  ) { }

  ngOnInit() {
    this.subs = [];

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

    // TODO: Add different modes for different types of connection => slow (wait and add seconds before next request) or fast
    this.membershipTypeId.subscribe((membershipTypeId: string) => {
      let membershipType: number = this.typeIdService.getMembershipType(membershipTypeId);
      let membershipId: string = this.typeIdService.getMembershipId(membershipTypeId);

      this.private = false;

      this.subs.push(
        this.bHttp.get('Destiny2/' + membershipType + '/Profile/' + membershipId + '/', false, { components: '100,200' })
          .subscribe((res: ServerResponse<DestinyProfileResponse>) => {
            this.profile = res.Response.profile.data;
            this.displayName = this.profile.userInfo.displayName;
            Object.keys(res.Response.characters.data).forEach(key => {
              this.characters.push(res.Response.characters.data[key]);
            });

            // this.report = this.localReportService.getReport(membershipTypeId);
            // if (this.report === null) {
            //   this.report = {
            //     key: membershipTypeId,
            //     updated_at: new Date().toISOString(),
            //     version_at: environment.VERSION,
            //     destinyUserInfo: this.profile.userInfo,
            //     activities: []
            //   };
            //   this.localReportService.initReport(this.report, membershipTypeId);
            // }

            this.report = {
              key: membershipTypeId,
              updated_at: new Date().toISOString(),
              version_at: environment.VERSION,
              destinyUserInfo: this.profile.userInfo,
              activities: []
            };

            this.characters.forEach((c: DestinyCharacterComponent) => {
              this.getActivities(c, [DestinyActivityModeType.AllPvP], new Date(this.report.updated_at));
            });
          })
      );
    });
  }

  getActivities(c: DestinyCharacterComponent, modes: DestinyActivityModeType[], date: Date = null, page: number = 0, count: number = 100) {
    modes.forEach((mode: DestinyActivityModeType) => {
      let options: any = {
        count: 100,
        mode: mode,
        page: page
      };

      this.subs.push(
        this.bHttp.get('/Destiny2/' + c.membershipType + '/Account/' + c.membershipId + '/Character/' + c.characterId + '/Stats/Activities/', false, options)
          .subscribe((res: ServerResponse<DestinyActivityHistoryResults>) => {
            if (res.ErrorCode != PlatformErrorCodes.DestinyPrivacyRestriction) {
              if (res.Response.activities && res.Response.activities.length) {
                res.Response.activities.forEach((act: DestinyHistoricalStatsPeriodGroup) => {
                  this.activities.push(act);
                  this.getPGCR(act.activityDetails.instanceId);

                  // TODO: Check the last update
                  // this.localReportService.saveActivity(act, this.typeIdService.combine(c.membershipType, c.membershipId));
                });

                this.getActivities(c, modes, date, page += 1, count);
              }
            } else {
              // TODO: Fix error handling, does not enter subscribe when error in response (500)
              this.private = true;
              this.message = res.ErrorStatus;
            }
          })
      );
    });
  }

  getPGCR(instanceId: string) {
    this.subs.push(
      this.bHttp.get('Destiny2/Stats/PostGameCarnageReport/' + instanceId + '/', true)
        .subscribe((res: ServerResponse<DestinyPostGameCarnageReportData>) => {
          this.getEncounters(res.Response);
        })
    );
  }

  getEncounters(pgcr: DestinyPostGameCarnageReportData) {
    pgcr.entries.forEach((entry: DestinyPostGameCarnageReportEntry) => {
      if (entry.player.destinyUserInfo.displayName !== this.displayName) { // TODO: Compare membershipId instead
        let enc: Encounter = this.encounters.find((e: Encounter) => {
          return e.membershipId == entry.player.destinyUserInfo.membershipId
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
            membershipId: entry.player.destinyUserInfo.membershipId,
            membershipType: entry.player.destinyUserInfo.membershipType,
            displayName: entry.player.destinyUserInfo.displayName,
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
      console.log('destroy');
      this.childRef.ngOnDestroy();
    }
    this.selection = encounter;
  }

  sortActs(activities: ActivityShort[]) {
    activities.sort((a, b) => {
      return a.period < b.period ? 1 : -1;
    });
  }

  clearStorage() {
    // if (confirm('Are you sure ?')) {
    //   this.localReportService.clearStorage();
    // }
  }

  ngOnDestroy() {
    this.membershipTypeId.unsubscribe();
    this.subs.forEach(s => s.unsubscribe());
  }

}
