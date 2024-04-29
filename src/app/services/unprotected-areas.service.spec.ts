// Other imports
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { UnprotectedAreasService } from './unprotected-areas.service';

describe('UnprotectedAreasService', () => {
  let service: UnprotectedAreasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ]
    });
    service = TestBed.inject(UnprotectedAreasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
