import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { BungieMembershipType } from 'bungie-api-ts/common';

import { MembershipTypeIdService } from './membership-type-id.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private currentUser: CurrentUser;
  public state: BehaviorSubject<CurrentUser>;

  constructor(private membershipTypeIdService: MembershipTypeIdService) {
    this.state = new BehaviorSubject(this.currentUser);
  }

  updateDisplayName(displayName: string): void {
    this.updateState({ ...this.currentUser, displayName: displayName });
  }

  updateEmblemPath(emblemPath: string): void {
    this.updateState({ ...this.currentUser, emblemPath: emblemPath });
  }

  updateMembershipTypeId(membershipId: string, membershipType: BungieMembershipType) {
    this.updateState({ ...this.currentUser, membershipTypeId: this.membershipTypeIdService.combine(membershipType, membershipId) });
  }

  private updateState(user: CurrentUser): void {
    this.currentUser = user;
    this.state.next(user);
  }

}

export interface CurrentUser {
  membershipTypeId: string;
  displayName: string;
  emblemPath: string;
}
