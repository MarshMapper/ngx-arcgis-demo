import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalNavigationComponent } from './global-navigation.component';

describe('GlobalNavigationComponent', () => {
  let component: GlobalNavigationComponent;
  let fixture: ComponentFixture<GlobalNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalNavigationComponent]
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
