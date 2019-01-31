import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle(environment.appTitle + ' v' + environment.VERSION);
  }
}
