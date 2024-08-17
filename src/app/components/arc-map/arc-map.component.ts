import { Component, OnInit, inject } from '@angular/core';
import { defineCustomElements } from "@arcgis/map-components/dist/loader";
import { defineCustomElements as defineCalciteElements } from "@esri/calcite-components/dist/loader";
import { CommonModule } from '@angular/common';
import { ComponentLibraryModule } from '@arcgis/map-components-angular';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTabsModule } from '@angular/material/tabs';

import { map, shareReplay } from 'rxjs/operators';
import { CalciteComponentsModule } from '@esri/calcite-components-angular';
import { ProtectedAreasService } from '../../services/protected-areas.service';
import { UnprotectedAreasService } from '../../services/unprotected-areas.service';
import { ProgressService } from '../../services/progress.service';
import Map from "@arcgis/core/Map";
import ImageryTileLayer from '@arcgis/core/layers/ImageryTileLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import View from "@arcgis/core/views/View";
import LayerView from "@arcgis/core/views/layers/LayerView";
import { whenOnce } from '@arcgis/core/core/reactiveUtils';
import { NjHistoricalMapsService, NjHistoricalMapType } from '../../services/nj-historical-maps.service';
import Layer from '@arcgis/core/layers/Layer';
import { FeatureListComponent } from "../feature-list/feature-list.component";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-arc-map',
  standalone: true,
  imports: [CommonModule, ComponentLibraryModule, CalciteComponentsModule, MatTabsModule, FeatureListComponent],

  templateUrl: './arc-map.component.html',
  styleUrl: './arc-map.component.scss'
})
export class ArcMapComponent implements OnInit {
  public isLoading: boolean = true;
  public showInfoPanel: boolean = true;
  public isSmallPortrait: boolean = false;
  private breakpointObserver = inject(BreakpointObserver);
  public protectedLayerViewSubject: Subject<__esri.FeatureLayerView> = new Subject<__esri.FeatureLayerView>();

  isSmallPortrait$ = this.breakpointObserver.observe([
    Breakpoints.TabletPortrait,
    Breakpoints.HandsetPortrait])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  constructor(private protectedAreasService: ProtectedAreasService,
    private unprotectedAreasService: UnprotectedAreasService,
    private njHistoricalMapsService: NjHistoricalMapsService,
    private progressService: ProgressService
  ) { }

  arcgisViewReadyChange(event: any) {
    this.isLoading = false;
    const map: Map = event.target.map;
    const view: View = event.target.view;
    const unprotectedAreasLayer: ImageryTileLayer = this.unprotectedAreasService.createImageryTileLayer();
    const protectedAreasLayer: FeatureLayer = this.protectedAreasService.createFeatureLayer();

    map.add(unprotectedAreasLayer);
    this.unprotectedAreasService.initializePopup(view);
    map.add(protectedAreasLayer);
    this.protectedAreasService.initializePopup(view);

    // add the NJ Historical Maps, but they won't be visible by default
    const mapTypes = Object.values(NjHistoricalMapType);
    mapTypes.forEach((mapType) => {
      const historicalLayer: Layer | undefined = this.njHistoricalMapsService.createLayer(<NjHistoricalMapType>mapType);
      if (historicalLayer) {
        map.add(historicalLayer);
      }
    });
    this.waitForLayersToLoad(view, map, unprotectedAreasLayer, protectedAreasLayer);
  }
  waitForLayersToLoad(view: View, map: Map, unprotectedAreasLayer: ImageryTileLayer, protectedAreasLayer: FeatureLayer): void {
    let unprotectedAreasView: LayerView;
    let protectedAreasView: LayerView;

    Promise.all([
      view.whenLayerView(unprotectedAreasLayer),
      view.whenLayerView(protectedAreasLayer)
    ]).then(([unprotectedView, protectedView]) => {
      unprotectedAreasView = unprotectedView;
      protectedAreasView = protectedView;
      this.protectedLayerViewSubject.next(protectedView);

      return Promise.all(
        [
          whenOnce(() => !unprotectedAreasView.updating),
          whenOnce(() => !protectedAreasView.updating)
        ]
      );
    })
    .then(() => {
      this.progressService.setWorkInProgress(false);
    });
  }
  getInfoPanelClass(): string {
    if (this.showInfoPanel) {
      return this.isSmallPortrait ? 'map-container-vertical' : 'map-container-horizontal';
    }
    return 'map-container-map-only';
  }

  ngOnInit(): void {
    defineCustomElements(window, { resourcesUrl: "https://js.arcgis.com/map-components/4.29/assets" });
    defineCalciteElements(window, { resourcesUrl: "https://js.arcgis.com/calcite-components/2.5.1/assets" });
    this.isSmallPortrait$.subscribe((isSmallPortrait) => {
      this.isSmallPortrait = isSmallPortrait;
    });
    this.progressService.setWorkInProgress(true);
  }
}
