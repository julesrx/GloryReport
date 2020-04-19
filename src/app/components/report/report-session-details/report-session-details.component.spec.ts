import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSessionDetailsComponent } from './report-session-details.component';

describe('ReportSessionDetailsComponent', () => {
  let component: ReportSessionDetailsComponent;
  let fixture: ComponentFixture<ReportSessionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSessionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSessionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
