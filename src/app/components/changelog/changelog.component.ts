import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.scss']
})
export class ChangelogComponent implements OnInit {

  public error: string;

  constructor() { }

  ngOnInit() {
    this.error = '';
  }

  onError(e: Event) {
    this.error = '<p>Changelog unavailable...</p>';
  }

}
