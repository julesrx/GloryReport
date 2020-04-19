import { Component, OnInit, Input } from '@angular/core';

import { GameSessionWeapon } from 'src/app/interfaces/game-session-weapon';

@Component({
  selector: 'app-report-session-weapon',
  templateUrl: './report-session-weapon.component.html',
  styleUrls: ['./report-session-weapon.component.scss']
})
export class ReportSessionWeaponComponent implements OnInit {

  @Input() weapon: GameSessionWeapon;

  constructor() { }

  ngOnInit(): void { }

}
