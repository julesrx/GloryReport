import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-encounter-details',
  templateUrl: './encounter-details.component.html',
  styleUrls: ['./encounter-details.component.scss']
})
export class EncounterDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      console.log(params['displayName']);
    })
  }

}
