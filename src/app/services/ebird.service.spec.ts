import { TestBed } from '@angular/core/testing';

import { EbirdService } from './ebird.service';

describe('EbirdService', () => {
  let service: EbirdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EbirdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
