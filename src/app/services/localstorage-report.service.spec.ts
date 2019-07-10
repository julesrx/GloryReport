import { TestBed } from '@angular/core/testing';

import { LocalstorageReportService } from './localstorage-report.service';

describe('LocalstorageReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalstorageReportService = TestBed.get(LocalstorageReportService);
    expect(service).toBeTruthy();
  });
});
