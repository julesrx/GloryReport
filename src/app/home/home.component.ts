import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BungieMembershipType } from 'bungie-api-ts/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public searchForm: FormGroup;
  public platforms: any[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();

    this.platforms = [
      { title: 'Xbox',icon:'fab fa-xbox', value: BungieMembershipType.TigerXbox },
      { title: 'Playstation',icon:'fab fa-playstation', value: BungieMembershipType.TigerPsn },
      { title: 'PC',icon:'fab fa-windows', value: BungieMembershipType.TigerBlizzard }
    ];
  }

  initForm() {
    this.searchForm = this.formBuilder.group({
      platform: [Validators.required],
      name: ['', Validators.required]
    })
  }

  search() {
    const platform = this.searchForm.get('platform').value;
    const name = this.searchForm.get('name').value;

    if (name.length) {
      this.router.navigate(['/search', platform, name]);
    }
  }
}
