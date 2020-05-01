import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { BungieMembershipType } from 'bungie-api-ts/common';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private currentUser: CurrentUser;
  public state: BehaviorSubject<CurrentUser>;

  constructor() {
    this.state = new BehaviorSubject(this.currentUser);
  }

  updateDisplayName(displayName: string): void {
    this.updateState({ ...this.currentUser, displayName });
  }

  updateEmblemPath(emblemPath: string): void {
    this.updateState({ ...this.currentUser, emblemPath });
  }

  private updateState(user: CurrentUser): void {
    this.currentUser = user;
    this.state.next(user);
  }

}

export interface CurrentUser {
  membershipType: BungieMembershipType;
  membershipId: string;
  displayName?: string;
  emblemPath?: string;
}
