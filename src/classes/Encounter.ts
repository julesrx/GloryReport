import { BungieMembershipType } from 'bungie-api-ts/app';

export default class Encounter {
  membershipId: string;
  membershipType: BungieMembershipType;
  displayName: string;
  iconPath: string;

  instanceIds: string[];
  count: number;

  constructor(
    membershipId: string,
    membershipType: BungieMembershipType,
    displayName: string,
    iconPath: string,
    instanceId: string
  ) {
    // displayName and iconPath can sometimes be undefined
    this.membershipId = membershipId;
    this.membershipType = membershipType;
    this.displayName = displayName;
    this.iconPath = iconPath;

    this.instanceIds = [instanceId];
    this.count = 1;
  }
}
