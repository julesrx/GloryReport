import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DestinyCharacterComponent, DestinyProfileComponent } from 'bungie-api-ts/destiny2/interfaces';

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

  constructor() { }

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

  getCharacterClasses(character: DestinyCharacterComponent): string[] {
    return [
      this.isCharacterActive(character)
        ? 'w-char-lg'
        : 'w-char',
      'flex h-char cursor-pointer text-white bg-black transition-all duration-75'
    ]
  }

}
