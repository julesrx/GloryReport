export class Occurence {

  public membershipId: string;
  public displayName: string;
  public count: number;

  constructor(membershipId: string, displayName: string) {
    this.membershipId = membershipId;
    this.displayName = displayName;
    this.count = 1;
  }

}
