import { Component, OnInit, Input } from '@angular/core';

import { GameSession } from 'src/app/interfaces/game-session';

@Component({
  selector: 'app-report-session-details',
  templateUrl: './report-session-details.component.html',
  styleUrls: ['./report-session-details.component.scss']
})
export class ReportSessionDetailsComponent implements OnInit {

  @Input() session: GameSession;

  constructor() { }

  ngOnInit(): void {
  }

}
