import { TestBed } from '@angular/core/testing';

import { ProtectedAreasService } from './protected-areas.service';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ProtectedAreasService', () => {
  let service: ProtectedAreasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [
        provideRouter([{path:'', component: ProtectedAreasService}])
      ]
    });
    service = TestBed.inject(ProtectedAreasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
