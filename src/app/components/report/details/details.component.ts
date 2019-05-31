import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { PostGameCarnageReport } from 'src/app/interfaces/post-game-carnage-report';

@Component({
  selector: 'report-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  @Input() displayName: string;
  @Input() pgcrs: PostGameCarnageReport[];

  constructor() { }

  ngOnInit() {
    this.pgcrs.sort((a, b) => {
      return a.period < b.period ? 1 : -1;
    });
  }

  ngOnDestroy() {
    this.displayName = '';
    this.pgcrs = [];
  }

}
