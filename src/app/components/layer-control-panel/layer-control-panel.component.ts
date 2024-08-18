import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Layer from '@arcgis/core/layers/Layer';
import { Observable } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { BreakpointService } from '../../services/breakpoint.service';

@Component({
  selector: 'app-layer-control-panel',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, MatSliderModule],
  templateUrl: './layer-control-panel.component.html',
  styleUrl: './layer-control-panel.component.scss'
})
export class LayerControlPanelComponent implements OnInit {
  @Input() overlayLayers$!: Observable<Layer[]>;
  public isSmallPortrait: boolean = false;

  constructor(private breakpointService: BreakpointService) { }

  ngOnInit(): void {
    this.breakpointService.isSmallPortrait$.subscribe((isSmallPortrait) => {
      this.isSmallPortrait = isSmallPortrait;
    });
  }
  toggleLayerVisibility(layer: Layer) {
    layer.visible = !layer.visible;
  }
  opacityChanged(layer: Layer, event: number) {
    layer.opacity = event;
  }
  getSliderLabel(value: number): string {
    return '' + Math.round(value * 100) / 100;
  }
  getLayerContainerClass(): string {
    return this.isSmallPortrait ? 'layer-container-vertical' : 'layer-container-horizontal';
  }
}
