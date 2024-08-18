import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Layer from '@arcgis/core/layers/Layer';
import { map, Observable, shareReplay } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
  private breakpointObserver = inject(BreakpointObserver);
  isSmallPortrait$ = this.breakpointObserver.observe([
    Breakpoints.TabletPortrait,
    Breakpoints.HandsetPortrait])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  ngOnInit(): void {
    this.isSmallPortrait$.subscribe((isSmallPortrait) => {
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
