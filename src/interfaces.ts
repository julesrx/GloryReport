import { BungieMembershipType } from 'bungie-api-ts/common';
import { DestinyCharacterComponent, DestinyProfileComponent } from 'bungie-api-ts/destiny2';

export interface ProfileState {
  readonly membershipType: BungieMembershipType;
  readonly membershipId: number;
  profile: DestinyProfileComponent | null;
  characters: DestinyCharacterComponent[];
}

export interface DestinyHistoricalStatsPeriodGroupShort {
  readonly instanceId: string;
  readonly period: string;
}
