import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureListComponent } from './feature-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FeatureListComponent', () => {
  let component: FeatureListComponent;
  let fixture: ComponentFixture<FeatureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureListComponent, NoopAnimationsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeatureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
