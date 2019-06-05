import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.scss']
})
export class ChangelogComponent implements OnInit {

  public changelog: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    let unavailable: string = '<p>Changelog unavailable...</p>';

    try {
      this.http.get('https://raw.githubusercontent.com/JulesRx/GloryReport/master/CHANGELOG.md')
        .subscribe((res: string) => {
          this.changelog = res || res.length ? res : unavailable;
        });
    } catch (e) {
      this.changelog = unavailable;
    }
  }

}
