import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Occurence } from 'src/app/models/occurence';
import { BungieHttpService } from 'src/app/services/bungie-http.service';

@Component({
  selector: 'app-detailed',
  templateUrl: './detailed.component.html',
  styleUrls: ['./detailed.component.scss']
})
export class DetailedComponent implements OnInit, OnDestroy {

  @Input() player: Occurence;

  public sites: string[];
  public site: string;

  constructor(
    private bHttp: BungieHttpService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sites = [
      'https://guardian.gg/2/pgcr/',
      'https://destinytracker.com/',
    ]
    this.site = this.sites[0];
  }

  ngOnDestroy() {

  }

}
