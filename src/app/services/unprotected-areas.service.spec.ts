// Other imports
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UnprotectedAreasService } from './unprotected-areas.service';

describe('UnprotectedAreasService', () => {
  let service: UnprotectedAreasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi())]
});
    service = TestBed.inject(UnprotectedAreasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
