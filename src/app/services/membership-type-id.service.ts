import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MembershipTypeIdService {

  public separator: string;

  constructor() {
    this.separator = '-';
  }

  combine(membershipType: number, membershipId: string): string {
    let membershipTypeId: string;

    membershipTypeId = membershipId + this.separator + membershipType;

    return membershipTypeId;
  }

  getMembershipType(membershipTypeId: string): number {
    const split: string[] = membershipTypeId.split(this.separator);

    return +split[1];
  }

  getMembershipId(membershipTypeId: string): string {
    const split: string[] = membershipTypeId.split(this.separator);

    return split[0];
  }
}
