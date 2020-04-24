import { TestBed } from '@angular/core/testing';

import { MembershipTypeIdService } from './membership-type-id.service';

describe('MembershipTypeIdService', () => {
  let service: MembershipTypeIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembershipTypeIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
