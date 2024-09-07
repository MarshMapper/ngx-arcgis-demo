import { TestBed } from '@angular/core/testing';

import { TideCurrentService } from './tide-current.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TideCurrentService', () => {
  let service: TideCurrentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())]
});
    service = TestBed.inject(TideCurrentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
