import { Component, OnInit, Input } from '@angular/core';

import { DestinyHistoricalStatsPeriodGroup } from 'bungie-api-ts/destiny2/interfaces';
import * as moment from 'moment';

import { GameSession } from 'src/app/interfaces/game-session';
import { ManifestService } from 'src/app/services/manifest.service';

@Component({
  selector: 'app-report-session',
  templateUrl: './report-session.component.html',
  styleUrls: ['./report-session.component.scss']
})
export class ReportSessionComponent implements OnInit {

  @Input() session: GameSession;

  constructor(private manifestService: ManifestService) { }

  ngOnInit(): void {
  }

  getActivityIcon(activity: DestinyHistoricalStatsPeriodGroup): string {
    // not working correctly
    return `https://www.bungie.net${this.manifestService.defs.Activity.get(activity.activityDetails.referenceId).displayProperties.icon}`;
  }

  // TODO: add locale support
  formatPeriod(period: string, format: string): string {
    return moment(period).format(format);
  }

  fromNow(period: string): string {
    return moment(period).fromNow();
  }

}
