import { Component, OnDestroy } from '@angular/core';

import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { SessionService, SessionProfile } from 'src/app/services/session.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnDestroy {

  private profile$: Subscription;
  public profile: SessionProfile;

  public socials = [
    { name: 'twitter', url: 'https://twitter.com/myjulot' },
    { name: 'github', url: 'https://github.com/julesrx/glory.report' }
  ];

  public links = [
    { name: 'Report', route: 'report' },
    { name: 'Encounters', route: 'encounters' }
  ];

  constructor(private session: SessionService) {
    this.profile$ = this.session.uniqueProfile
      .subscribe((profile: SessionProfile) => {
        this.profile = profile;
      });
  }

  ngOnDestroy(): void {
    this.profile$.unsubscribe();
  }

}
