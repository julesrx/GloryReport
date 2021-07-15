import { BungieMembershipType } from 'bungie-api-ts/app';

export class Encounter {
  membershipId: string;
  membershipType: BungieMembershipType;
  displayName: string;
  iconPath: string;
  characterClass: string;

  instanceIds: string[];
  count: number;

  constructor(
    membershipId: string,
    membershipType: BungieMembershipType,
    displayName: string,
    iconPath: string,
    characterClass: string, // class on the first encounter
    instanceId: string
  ) {
    // displayName and iconPath can sometimes be undefined
    this.membershipId = membershipId;
    this.membershipType = membershipType;
    this.displayName = displayName;
    this.iconPath = iconPath;
    this.characterClass = characterClass;

    this.instanceIds = [instanceId];
    this.count = 1;
  }
}

export class CharacterLoading {
  constructor(characterId: string) {
    this.characterId = characterId;
    this.loading = true;
  }

  characterId: string;
  loading: boolean;
}
