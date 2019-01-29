import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  public title: string;
  public searchName: string;

  constructor(
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.title = this.titleService.getTitle();
    this.searchName = '';
  }

  search() {
    if (this.searchName.length) {
      this.router.navigate(['/search', this.searchName]);
    }
  }
}
