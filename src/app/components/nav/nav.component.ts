import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  public gamertag: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.gamertag = '';
  }

  search() {
    if (this.gamertag.length) {
      this.router.navigate(['/search', this.gamertag]);
    }
  }

}
