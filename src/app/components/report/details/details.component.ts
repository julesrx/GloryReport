import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';

import * as moment from 'moment';

import { Encounter } from 'src/app/interfaces/encounter';

@Component({
  selector: 'report-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  @Input() encounter: Encounter;

  @Output() close: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  ngOnDestroy() {
    this.encounter = null;
  }

  getDate(period: string): string {
    return moment(period).format('MM/DD/YYYY HH:mm:ss');
  }

}
