import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalNavigationComponent } from './global-navigation.component';
import { provideRouter } from '@angular/router';

describe('GlobalNavigationComponent', () => {
  let component: GlobalNavigationComponent;
  let fixture: ComponentFixture<GlobalNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalNavigationComponent],
      providers: [
        provideRouter([{path:'', component: GlobalNavigationComponent}])
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlobalNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
