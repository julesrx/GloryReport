import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, EMPTY } from 'rxjs';
import { map, flatMap, filter } from 'rxjs/operators';
import { DestinyHistoricalStatsPeriodGroup } from 'bungie-api-ts/destiny2/interfaces';
import * as moment from 'moment';

import { EncountersService } from 'src/app/services/encounters.service';

@Component({
  selector: 'app-encounter-details',
  templateUrl: './encounter-details.component.html',
  styleUrls: ['./encounter-details.component.scss']
})
export class EncounterDetailsComponent implements OnInit {

  public acts$: Observable<DestinyHistoricalStatsPeriodGroup[]>
  public displayName: string;

  constructor(
    private route: ActivatedRoute,
    private encounters: EncountersService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.displayName = params['displayName'];

      this.acts$ = this.encounters.encounters$
        .pipe(
          map(encs => encs.find(enc => enc.displayName.toLowerCase().indexOf(this.displayName.toLowerCase()) !== -1)),
          map(enc => enc ? enc.instanceIds : []),
          flatMap(ids => this.encounters.activities$
            .pipe(
              map(acts => acts.filter(act => ids.indexOf(act.activityDetails.instanceId) !== -1)),
              map(acts => acts.sort((a, b) => moment(a.period).diff(b.period) ? 1 : -1))
            )
          )
        );
    });
  }

}
