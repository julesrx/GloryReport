import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
    this.updateState({ ...this.currentUser, displayName: displayName });
  }

  updateEmblemPath(emblemPath: string): void {
    this.updateState({ ...this.currentUser, emblemPath: emblemPath });
  }

  private updateState(user: CurrentUser): void {
    this.currentUser = user;
    this.state.next(user);
  }

}

export interface CurrentUser {
  displayName: string;
  emblemPath: string;
}
