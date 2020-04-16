import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalAlertsComponent } from './global-alerts.component';

describe('GlobalAlertsComponent', () => {
  let component: GlobalAlertsComponent;
  let fixture: ComponentFixture<GlobalAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
