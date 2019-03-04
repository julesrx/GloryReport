import { DestinyHistoricalStatsPeriodGroup } from 'bungie-api-ts/destiny2';

export class Occurence {

  public membershipId: string;
  public displayName: string;
  public count: number;
  public activities: DestinyHistoricalStatsPeriodGroup[];

  constructor(membershipId: string, displayName: string) {
    this.membershipId = membershipId;
    this.displayName = displayName;
    this.count = 1;
    this.activities = [];
  }

}
