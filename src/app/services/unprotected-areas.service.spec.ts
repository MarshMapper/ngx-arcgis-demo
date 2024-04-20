import { TestBed } from '@angular/core/testing';

import { UnprotectedAreasService } from './unprotected-areas.service';

describe('UnprotectedAreasService', () => {
  let service: UnprotectedAreasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnprotectedAreasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
