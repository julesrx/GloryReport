import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public constructor(private titleService: Title) { }

  ngOnInit() {
    // TODO: Add custom title servive to get version
    this.titleService.setTitle('GloryReport 0.5.0');
  }

}
