import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DestinyCharacterComponent, DestinyProfileComponent } from 'bungie-api-ts/destiny2/interfaces';

import { ManifestService } from 'src/app/services/manifest.service';

@Component({
  selector: 'app-report-header',
  templateUrl: './report-header.component.html',
  styleUrls: ['./report-header.component.scss']
})
export class ReportHeaderComponent implements OnInit {

  @Input() profile: DestinyProfileComponent;
  @Input() characters: DestinyCharacterComponent[];
  @Input() currentCharacterId: string;

  @Output() selectedCharacter = new EventEmitter<DestinyCharacterComponent>();

  constructor(private manifestService: ManifestService) { }

  ngOnInit(): void { }

  selectCharacter(character: DestinyCharacterComponent): void {
    this.selectedCharacter.emit(character);
  }

  isCharacterActive(character: DestinyCharacterComponent): boolean {
    return this.currentCharacterId === character.characterId;
  }

  getCharacterStyle(character: DestinyCharacterComponent): any {
    return {
      'background-image': `url("https://www.bungie.net${character.emblemBackgroundPath}")`
    };
  }

  getCharacterInfos(character: DestinyCharacterComponent): string {
    return `${character.raceHash} ${this.manifestService.defs.Class?.get(character.classHash).displayProperties.name}`;
  }

}
