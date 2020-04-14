import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BungieAlertsComponent } from './bungie-alerts.component';

describe('BungieAlertsComponent', () => {
  let component: BungieAlertsComponent;
  let fixture: ComponentFixture<BungieAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BungieAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BungieAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
