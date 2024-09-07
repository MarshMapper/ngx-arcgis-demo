import { TestBed } from '@angular/core/testing';

import { EbirdService } from './ebird.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EbirdService', () => {
  let service: EbirdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())]
});
    service = TestBed.inject(EbirdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
