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

  ngOnInit() { }

  ngOnDestroy() {
    this.encounter = null;
  }

}
