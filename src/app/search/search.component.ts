import { Component, OnInit } from '@angular/core';
import { BungieHttpService } from '../services/bungie-http.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ServerResponse, UserInfoCard } from 'bungie-api-ts/user';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public searching: boolean;
  public searchResults: UserInfoCard[];

  private searchName: BehaviorSubject<string>;
  private searchResponse: Subscription;
  private params$: Subscription;

  constructor(
    private bHttp: BungieHttpService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.searchName = new BehaviorSubject('');
    this.searching = true;

    const guardian = this.route.snapshot.params['guardian'];
    if (guardian) {
      this.searchName.next(guardian);
    }

    console.log(this.searchName);
  }
}
