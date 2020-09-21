import { BungieMembershipType } from 'bungie-api-ts/common';

export interface PlayerEncounter {
  displayName: string;
  membershipId: string;
  membershipType: BungieMembershipType;
  iconPath: string;
  instanceIds: string[];
  count: number;
}
