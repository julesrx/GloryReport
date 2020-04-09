import { TestBed } from '@angular/core/testing';

import { BungieHttpService } from './bungie-http.service';

describe('BungieHttpService', () => {
  let service: BungieHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BungieHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
