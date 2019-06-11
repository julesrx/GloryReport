import { TestBed } from '@angular/core/testing';

import { MembershipTypeIdService } from './membership-type-id.service';

describe('MembershipTypeIdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MembershipTypeIdService = TestBed.get(MembershipTypeIdService);
    expect(service).toBeTruthy();
  });
});
