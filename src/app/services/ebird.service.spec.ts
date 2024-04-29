import { TestBed } from '@angular/core/testing';

import { EbirdService } from './ebird.service';
import { HttpClientModule } from '@angular/common/http';

describe('EbirdService', () => {
  let service: EbirdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ]
    });
    service = TestBed.inject(EbirdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
