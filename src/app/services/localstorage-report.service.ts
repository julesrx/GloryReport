import { Injectable } from '@angular/core';

import { DestinyHistoricalStatsPeriodGroup } from 'bungie-api-ts/destiny2/interfaces';

import { Report } from '../interfaces/report';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageReportService {

  private separator: string = '.';

  public REPORT: string = 'report';

  constructor() { }

  public initReport(report: Report, membershipTypeId: string): void {
    let current: Report = JSON.parse(window.localStorage.getItem(membershipTypeId + this.separator + this.REPORT));

    if (current === null) {
      window.localStorage.setItem(membershipTypeId + this.separator + this.REPORT, JSON.stringify(report));
    } else {
      if (current.version_at != environment.VERSION) {
        window.localStorage.setItem(membershipTypeId + this.separator + this.REPORT, JSON.stringify(report));
      } else {
        // Do something ?
      }
    }
  }

  public getReport(membershipTypeId: string): Report {
    return JSON.parse(window.localStorage.getItem(membershipTypeId + this.separator + this.REPORT));
  }

  public saveActivity(act: DestinyHistoricalStatsPeriodGroup, membershipTypeId: string): void {
    let current: Report = JSON.parse(window.localStorage.getItem(membershipTypeId + this.separator + this.REPORT));

    // TODO: Check last updated_date instead
    if (current.activities.find(a => a.instanceId == act.activityDetails.instanceId) == null) {
      current.activities.push({
        instanceId: act.activityDetails.instanceId,
        period: act.period
      });
    }

    window.localStorage.setItem(membershipTypeId + this.separator + this.REPORT, JSON.stringify(current));
  }

  public clearStorage(): void {
    // TODO: Clear only the one selected
    window.localStorage.clear();
    location.reload();
  }

}
