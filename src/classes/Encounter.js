export default class Encounter {
  constructor(membershipId, membershipType, displayName, iconPath, instanceId) {
    // displayName and iconPath can sometimes be undefined
    this.membershipId = membershipId;
    this.membershipType = membershipType;
    this.displayName = displayName;
    this.iconPath = iconPath;

    this.instanceIds = [instanceId];
    this.count = 1;
  }
}
