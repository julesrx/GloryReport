import { BungieMembershipType } from 'bungie-api-ts/destiny2';

export interface Encounter {
  readonly membershipId: string;
  readonly membershipType: BungieMembershipType;
  readonly displayName: string;
  readonly iconPath: string;
  readonly characterClass: string;

  readonly instanceIds: string[]; // TODO, use indexed db instead
  count: number;
}

export interface EncountersState {
  membershipId: string | null;
  encounters: Encounter[];
}
