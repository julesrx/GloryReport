import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Encounter } from 'src/app/interfaces/encounter';

@Component({
  selector: 'report-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  @Input() encounter: Encounter;

  constructor() { }

  ngOnInit() {
    this.encounter.pgcrs.sort((a, b) => {
      return a.period < b.period ? 1 : -1;
    });
  }

  ngOnDestroy() {
    this.encounter = null;
  }

}
