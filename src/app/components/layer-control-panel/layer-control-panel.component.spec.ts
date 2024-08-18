import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerControlPanelComponent } from './layer-control-panel.component';

describe('LayerControlPanelComponent', () => {
  let component: LayerControlPanelComponent;
  let fixture: ComponentFixture<LayerControlPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerControlPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LayerControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
