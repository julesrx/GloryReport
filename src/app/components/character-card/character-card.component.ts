import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DestinyCharacterComponent } from 'bungie-api-ts/destiny2/interfaces';

import { ManifestService } from 'src/app/services/manifest.service';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss']
})
export class CharacterCardComponent implements OnInit {

  constructor(private manifestService: ManifestService) { }

  @Input('char') character: DestinyCharacterComponent;
  @Input('current') current: boolean;

  @Output('selected') selected = new EventEmitter<DestinyCharacterComponent>();

  ngOnInit(): void { }

  select(character: DestinyCharacterComponent): void {
    this.selected.emit(character);
  }

  getBungieRessource(path: string): string {
    return `https://www.bungie.net${path}`;
  }

  getCharacterDescription(character: DestinyCharacterComponent): string {
    return this.manifestService.defs.Class?.get(character.classHash).displayProperties.name;
  }
}
