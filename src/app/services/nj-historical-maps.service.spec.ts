import { TestBed } from '@angular/core/testing';

import { NjHistoricalMapsService } from './nj-historical-maps.service';

describe('NjHistoricalMapsService', () => {
  let service: NjHistoricalMapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NjHistoricalMapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
