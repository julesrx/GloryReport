import { Component, OnInit } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { map, flatMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as _ from 'lodash';

import { EncountersService, PlayerEncounter } from 'src/app/services/encounters.service';

@Component({
  selector: 'app-encounters',
  templateUrl: './encounters.component.html',
  styleUrls: ['./encounters.component.scss']
})
export class EncountersComponent implements OnInit {

  private filter$: BehaviorSubject<string>;
  public encounters$: Observable<PlayerEncounter[]>;

  public actslength$: Observable<number>;
  public fetched$: Observable<number>;

  public actsLoading = true;

  constructor(private encounters: EncountersService) { }

  ngOnInit() {
    this.filter$ = new BehaviorSubject('');

    this.encounters$ = this.encounters.encounters$
      .pipe(
        flatMap(encs => this.filter$
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            map(v => v === ''
              ? encs
              : encs.filter(enc => enc.displayName.toLowerCase().indexOf(v.toLowerCase()) !== -1)))
        )
      );

    this.encounters.charDoneLoading.subscribe(l => {
      this.actsLoading = !l;
    });

    this.actslength$ = this.encounters.activities$.pipe(map(acts => acts.length));
    this.fetched$ = this.encounters.fetched;
  }

  filter(event: any): void {
    this.filter$.next(event.target.value);
  }

}
