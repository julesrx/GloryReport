import { Component, OnInit, Input } from '@angular/core';
import { Occurence } from 'src/app/models/occurence';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input() occurence: Occurence;

  constructor() { }

  ngOnInit() {
  }

}
