import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { DestinyPostGameCarnageReportData, DestinyPostGameCarnageReportEntry, DestinyPostGameCarnageReportTeamEntry } from 'bungie-api-ts/destiny2/interfaces';

import { DestinyService } from 'src/app/services/destiny.service';

@Component({
  selector: 'app-destiny-pgcr',
  templateUrl: './destiny-pgcr.component.html',
  styleUrls: ['./destiny-pgcr.component.scss']
})
export class DestinyPgcrComponent implements OnInit, OnDestroy {

  @Input() instanceId: string;

  private sub: Subscription;
  public pgcr: DestinyPostGameCarnageReportData;

  constructor(private destiny: DestinyService) { }

  ngOnInit(): void {
    this.sub = this.destiny.getPGCR(this.instanceId)
      .subscribe(pgcr => {
        this.pgcr = pgcr;
      });
  }

  getTeamEntries(team: DestinyPostGameCarnageReportTeamEntry): DestinyPostGameCarnageReportEntry[] {
    return this.pgcr.entries.filter(e => e.values['team'].basic.value == team.teamId);
  }

  getTeamName(team: DestinyPostGameCarnageReportTeamEntry): string {
    switch (team.teamId) {
      case 17:
        return 'Alpha';

      case 18:
        return 'Bravo';

      default:
        return '';
    }
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

}
