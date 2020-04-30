import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { ServerResponse } from 'bungie-api-ts/common';
import {
  DestinyHistoricalStatsPeriodGroup,
  DestinyPostGameCarnageReportData
} from 'bungie-api-ts/destiny2/interfaces';
import * as moment from 'moment';

import { GameSession } from 'src/app/interfaces/game-session';
import { ManifestService } from 'src/app/services/manifest.service';
import { DestinyService } from 'src/app/services/destiny.service';

@Component({
  selector: 'app-report-session',
  templateUrl: './report-session.component.html',
  styleUrls: ['./report-session.component.scss']
})
export class ReportSessionComponent implements OnInit, OnDestroy {

  @Input() session: GameSession;
  @Input() characterId: string;

  private subs: Subscription[];

  constructor(
    private destiny: DestinyService,
    private manifestService: ManifestService
  ) { }

  ngOnInit(): void {
    this.subs = [];
    this.getPGCRs(this.characterId, this.session);
  }

  // TODO: display medals and 'medalMatchMostDamage' in priority
  getPGCRs(characterId: string, session: GameSession): void {
    if (!session.fetched) {
      session.activities.forEach(act => {
        this.subs.push(
          this.destiny.getPGCR(act.activityDetails.instanceId)
            .subscribe((pgcr: DestinyPostGameCarnageReportData) => {
              pgcr.entries.filter(e => e.characterId === characterId).forEach(e => {
                // e.extended.weapons is undefined if the player has 0 kills 😥
                if (e.extended.weapons) {
                  e.extended.weapons.forEach(weapon => {
                    if (session.weapons.some(w => w.referenceId === weapon.referenceId)) {
                      const stat = session.weapons.find(w => w.referenceId === weapon.referenceId);
                      stat.uniqueWeaponKills += weapon.values['uniqueWeaponKills'].basic.value;
                      stat.uniqueWeaponPrecisionKills += weapon.values['uniqueWeaponPrecisionKills'].basic.value;
                    } else {
                      session.weapons.push({
                        referenceId: weapon.referenceId,
                        uniqueWeaponKills: weapon.values['uniqueWeaponKills'].basic.value,
                        uniqueWeaponPrecisionKills: weapon.values['uniqueWeaponPrecisionKills'].basic.value,
                      });
                    }
                  });
                }
              });
            })
        );
      });

      session.fetched = true;
    }
  }

  getActivityIcon(activity: DestinyHistoricalStatsPeriodGroup): string {
    // not working correctly
    return `https://www.bungie.net${this.manifestService.defs.Activity?.get(activity.activityDetails.referenceId).displayProperties.icon}`;
  }

  // TODO: add locale support
  formatPeriod(period: string, format: string): string {
    return moment(period).format(format);
  }

  fromNow(period: string): string {
    return moment(period).fromNow();
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.forEach(a => a.unsubscribe());
    }
  }

}
