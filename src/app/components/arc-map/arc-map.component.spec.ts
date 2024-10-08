import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcMapComponent } from './arc-map.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ArcMapComponent', () => {
  let component: ArcMapComponent;
  let fixture: ComponentFixture<ArcMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ArcMapComponent, NoopAnimationsModule],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(ArcMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
