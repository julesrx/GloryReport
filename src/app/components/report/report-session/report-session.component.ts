import { Component, OnInit, Input } from '@angular/core';

import { ServerResponse } from 'bungie-api-ts/common';
import {
  DestinyHistoricalStatsPeriodGroup,
  DestinyCharacterComponent,
  DestinyPostGameCarnageReportData
} from 'bungie-api-ts/destiny2/interfaces';
import * as moment from 'moment';

import { GameSession } from 'src/app/interfaces/game-session';
import { ManifestService } from 'src/app/services/manifest.service';
import { BungieHttpService } from 'src/app/services/bungie-http.service';

@Component({
  selector: 'app-report-session',
  templateUrl: './report-session.component.html',
  styleUrls: ['./report-session.component.scss']
})
export class ReportSessionComponent implements OnInit {

  @Input() session: GameSession;
  @Input() characterId: string;

  constructor(
    private bHttp: BungieHttpService,
    private manifestService: ManifestService
  ) { }

  ngOnInit(): void {
    this.getPGCRs(this.characterId, this.session);;
  }

  // TODO: display medals and 'medalMatchMostDamage' in priority
  getPGCRs(characterId: string, session: GameSession): void {
    if (!session.fetched) {
      session.activities.forEach(act => {
        this.bHttp.get(`Destiny2/Stats/PostGameCarnageReport/${act.activityDetails.instanceId}/`, true)
          .subscribe((res: ServerResponse<DestinyPostGameCarnageReportData>) => {
            const pgcr: DestinyPostGameCarnageReportData = res.Response;

            pgcr.entries.filter(e => e.characterId === characterId).forEach(e => {
              // e.extended.weapons is undefined if the player has 0 kills 😥
              if (e.extended.weapons) {
                e.extended.weapons.forEach(weapon => {
                  if (session.weapons.some(w => w.referenceId === weapon.referenceId)) {
                    const stat = session.weapons.find(w => w.referenceId === weapon.referenceId);
                    stat.uniqueWeaponKills += weapon.values['uniqueWeaponKills'].basic.value;
                    stat.uniqueWeaponPrecisionKills += weapon.values['uniqueWeaponPrecisionKills'].basic.value;
                    stat.uniqueWeaponKillsPrecisionKills += weapon.values['uniqueWeaponKillsPrecisionKills'].basic.value;
                  } else {
                    session.weapons.push({
                      referenceId: weapon.referenceId,
                      uniqueWeaponKills: weapon.values['uniqueWeaponKills'].basic.value,
                      uniqueWeaponPrecisionKills: weapon.values['uniqueWeaponPrecisionKills'].basic.value,
                      uniqueWeaponKillsPrecisionKills: weapon.values['uniqueWeaponKillsPrecisionKills'].basic.value
                    });
                  }
                });
              }
            });
          });
      });

      session.fetched = true;
    }
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
