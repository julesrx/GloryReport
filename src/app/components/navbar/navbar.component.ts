import { Component, OnDestroy } from '@angular/core';

import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { CurrentUserService, CurrentUser } from 'src/app/services/current-user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnDestroy {

  private currentUser$: Subscription;
  public currentUser: CurrentUser;

  public links = [
    { name: 'Report', route: '/report', enabled: true },
    // { name: 'Encounters', route: '/encounters', enabled: false }
  ];

  public socials = [
    { name: 'twitter', url: 'https://twitter.com/myjulot' },
    { name: 'github', url: 'https://github.com/julesrx/glory.report' }
  ];

  constructor(private currentUserService: CurrentUserService) {
    this.currentUser$ = this.currentUserService.state
      .pipe(
        distinctUntilChanged()
      )
      .subscribe((currentUser: CurrentUser) => {
        this.currentUser = currentUser;
      });
  }

  ngOnDestroy(): void {
    this.currentUser$.unsubscribe();
  }

}
