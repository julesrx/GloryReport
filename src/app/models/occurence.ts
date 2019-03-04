export class Occurence {

  public membershipId: string;
  public displayName: string;
  public count: number;
  public activities: any[];

  constructor(membershipId: string, displayName: string) {
    this.membershipId = membershipId;
    this.displayName = displayName;
    this.count = 1;
    this.activities = [];
  }

}
