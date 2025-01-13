import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { BehaviorSubject, Subject } from 'rxjs';

// ArgGIS and Calcite components now use ES6 style imports
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/dist/components/arcgis-zoom";
import "@arcgis/map-components/dist/components/arcgis-expand";
import "@arcgis/map-components/dist/components/arcgis-layer-list";
import "@arcgis/map-components/dist/components/arcgis-search";
import "@arcgis/map-components/dist/components/arcgis-legend";
import '@arcgis/map-components/dist/components/arcgis-basemap-gallery';
import "@esri/calcite-components/dist/loader";
import Map from "@arcgis/core/Map";
import ImageryTileLayer from '@arcgis/core/layers/ImageryTileLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import View from "@arcgis/core/views/View";
import Layer from '@arcgis/core/layers/Layer';
import LayerView from "@arcgis/core/views/layers/LayerView";
import { whenOnce } from '@arcgis/core/core/reactiveUtils';

import { ProtectedAreasService } from '../../services/protected-areas.service';
import { UnprotectedAreasService } from '../../services/unprotected-areas.service';
import { ProgressService } from '../../services/progress.service';
import { NjHistoricalMapsService, NjHistoricalMapType } from '../../services/nj-historical-maps.service';
import { FeatureListComponent } from "../feature-list/feature-list.component";
import { LayerControlPanelComponent } from "../layer-control-panel/layer-control-panel.component";
import { BreakpointService } from '../../services/breakpoint.service';

import { setAssetPath } from "@esri/calcite-components/dist/components";
setAssetPath("https://cdn.jsdelivr.net/npm/@esri/calcite-components/dist/calcite/assets");

@Component({
    selector: 'app-arc-map',
    imports: [CommonModule, MatTabsModule, FeatureListComponent, LayerControlPanelComponent],
    templateUrl: './arc-map.component.html',
    styleUrl: './arc-map.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ArcMapComponent implements OnInit {
  public isLoading: boolean = true;
  public showInfoPanel: boolean = true;
  public isSmallPortrait: boolean = false;
  public protectedLayerViewSubject: Subject<__esri.FeatureLayerView> = new Subject<__esri.FeatureLayerView>();
  public overlayLayersSubject: BehaviorSubject<Layer[]> = new BehaviorSubject<Layer[]>([]);

  constructor(private readonly protectedAreasService: ProtectedAreasService,
    private readonly unprotectedAreasService: UnprotectedAreasService,
    private readonly njHistoricalMapsService: NjHistoricalMapsService,
    private readonly progressService: ProgressService,
    private readonly breakpointService: BreakpointService
  ) { }

  arcgisViewReadyChange(event: any) {
    this.isLoading = false;
    const map: Map = event.target.map;
    const view: View = event.target.view;
    const unprotectedAreasLayer: ImageryTileLayer = this.unprotectedAreasService.createImageryTileLayer();
    const protectedAreasLayer: FeatureLayer = this.protectedAreasService.createFeatureLayer();
    let overlayLayers: Layer[] = [protectedAreasLayer, unprotectedAreasLayer];

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
        overlayLayers.push(historicalLayer);
      }
    });
    this.overlayLayersSubject.next(overlayLayers);
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
    this.breakpointService.isSmallPortrait$.subscribe((isSmallPortrait) => {
      this.isSmallPortrait = isSmallPortrait;
    });
    this.progressService.setWorkInProgress(true);
  }
}
