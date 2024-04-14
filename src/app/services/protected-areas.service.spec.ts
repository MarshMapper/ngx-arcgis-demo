import { TestBed } from '@angular/core/testing';

import { ProtectedAreasService } from './protected-areas.service';

describe('ProtectedAreasService', () => {
  let service: ProtectedAreasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProtectedAreasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
