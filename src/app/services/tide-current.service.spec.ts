import { TestBed } from '@angular/core/testing';

import { TideCurrentService } from './tide-current.service';
import { HttpClientModule } from '@angular/common/http';

describe('TideCurrentService', () => {
  let service: TideCurrentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ]
    });
    service = TestBed.inject(TideCurrentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
