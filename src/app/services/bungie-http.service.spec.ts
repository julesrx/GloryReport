import { TestBed } from '@angular/core/testing';

import { BungieHttpService } from './bungie-http.service';

describe('BungieHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BungieHttpService = TestBed.get(BungieHttpService);
    expect(service).toBeTruthy();
  });
});
