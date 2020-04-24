import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSessionWeaponComponent } from './report-session-weapon.component';

describe('ReportSessionWeaponComponent', () => {
  let component: ReportSessionWeaponComponent;
  let fixture: ComponentFixture<ReportSessionWeaponComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSessionWeaponComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSessionWeaponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
