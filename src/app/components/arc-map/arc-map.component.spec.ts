import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcMapComponent } from './arc-map.component';
import { HttpClientModule } from '@angular/common/http';

describe('ArcMapComponent', () => {
  let component: ArcMapComponent;
  let fixture: ComponentFixture<ArcMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArcMapComponent, HttpClientModule]
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
