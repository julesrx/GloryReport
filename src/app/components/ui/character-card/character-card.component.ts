import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DestinyCharacterComponent } from 'bungie-api-ts/destiny2/interfaces';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss']
})
export class CharacterCardComponent implements OnInit {

  constructor() { }

  @Input('char') character: DestinyCharacterComponent;
  @Input('current') current: boolean;

  @Output('selected') selected = new EventEmitter<DestinyCharacterComponent>();

  ngOnInit(): void {
    console.log(this.character);
  }

  select(character: DestinyCharacterComponent): void {
    this.selected.emit(character);
  }

  getBungieRessource(path: string): string {
    return `https://www.bungie.net${path}`;
  }

  getCharacterDescription(character: DestinyCharacterComponent): string {
    return `${character.genderHash} ${character.classHash}`;
  }
}
