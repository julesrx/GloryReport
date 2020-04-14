import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ManifestService } from './services/manifest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // injecting manifest service to load definitions on page load
  constructor(
    private manifestService: ManifestService,
    private router: Router
  ) { }

  title = 'Glory.report';
}
