import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guardian',
  templateUrl: './guardian.component.html',
  styleUrls: ['./guardian.component.scss']
})
export class GuardianComponent implements OnInit {

  constructor(private router: Router) {
    this.router.navigate([this.router.routerState.snapshot.url, 'report']);
  }

  ngOnInit(): void { }

}
