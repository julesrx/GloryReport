import { Component, OnInit, Input } from '@angular/core';

import * as moment from 'moment';
import { DestinyHistoricalStatsPeriodGroup } from 'bungie-api-ts/destiny2/interfaces';

import { ManifestService } from 'src/app/services/manifest.service';

@Component({
  selector: 'app-encounter-pgcr',
  templateUrl: './encounter-pgcr.component.html',
  styleUrls: ['./encounter-pgcr.component.scss']
})
export class EncounterPgcrComponent implements OnInit {

  @Input() activity: DestinyHistoricalStatsPeriodGroup;


  constructor(private manifest: ManifestService) { }

  ngOnInit(): void { }

  formatPeriod(period: string, format: string): string {
    return moment(period).format(format);
  }

  fromNow(period: string): string {
    return moment(period).fromNow();
  }

  getPgcrImage(hash: number): string {
    return 'https://bungie.net' + this.manifest.defs.Activity.get(hash).pgcrImage;
  }

}
