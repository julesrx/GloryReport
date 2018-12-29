import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public searchForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.searchForm = this.formBuilder.group({
      name: ['', Validators.required]
    })
  }

  search() {
    const name = this.searchForm.get('name').value;

    if (name.length) {
      this.router.navigate(['/search', name]);
    }
  }
}
