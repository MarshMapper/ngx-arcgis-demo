import { TestBed } from '@angular/core/testing';

import { GeoDistanceService } from './geo-distance.service';

describe('GeoDistanceService', () => {
  let service: GeoDistanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoDistanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
