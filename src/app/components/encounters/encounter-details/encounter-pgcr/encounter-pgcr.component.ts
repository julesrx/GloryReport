import { Component, OnInit, Input } from '@angular/core';

import * as moment from 'moment';
import { DestinyPostGameCarnageReportData, DestinyHistoricalStatsPeriodGroup } from 'bungie-api-ts/destiny2/interfaces';

import { DestinyService } from 'src/app/services/destiny.service';

@Component({
  selector: 'app-encounter-pgcr',
  templateUrl: './encounter-pgcr.component.html',
  styleUrls: ['./encounter-pgcr.component.scss']
})
export class EncounterPgcrComponent implements OnInit {

  @Input() activity: DestinyHistoricalStatsPeriodGroup;

  // public pgcr: DestinyPostGameCarnageReportData;

  constructor(private destiny: DestinyService) { }

  ngOnInit(): void {
    // this.destiny.getPGCR(this.activity.activityDetails.instanceId)
    //   .subscribe(res => {
    //     this.pgcr = res;
    //   });
  }

  formatPeriod(period: string, format: string): string {
    return moment(period).format(format);
  }

  fromNow(period: string): string {
    return moment(period).fromNow();
  }

}
