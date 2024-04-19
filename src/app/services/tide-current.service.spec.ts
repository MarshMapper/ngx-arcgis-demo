import { TestBed } from '@angular/core/testing';

import { TideCurrentService } from './tide-current.service';

describe('TideCurrentService', () => {
  let service: TideCurrentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TideCurrentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
