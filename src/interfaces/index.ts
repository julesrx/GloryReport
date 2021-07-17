import { BungieMembershipType } from 'bungie-api-ts/common';
import { DestinyCharacterComponent, DestinyProfileComponent } from 'bungie-api-ts/destiny2';

export interface ProfileState {
  membershipType: BungieMembershipType | null;
  membershipId: string | null;
  profile: DestinyProfileComponent | null;
  characters: DestinyCharacterComponent[];
}

export interface DestinyHistoricalStatsPeriodGroupShort {
  readonly instanceId: string;
  readonly period: string;
}

export interface DayReport {
  readonly day: string;
  readonly activities: DestinyHistoricalStatsPeriodGroupShort[];
}

export interface DayReportResult {
  readonly score: number;
  readonly weapons: DayReportResultWeapon[];
}

export interface DayReportResultWeapon {
  readonly referenceId: string;
  readonly uniqueWeaponKills: number;
  readonly uniqueWeaponPrecisionKills: number;
}

export interface CharacterLoading {
  readonly characterId: string;
  loading: boolean;
}
