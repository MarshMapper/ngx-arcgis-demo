import { Injectable } from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Layer from '@arcgis/core/layers/Layer';
import WMSLayer from '@arcgis/core/layers/WMSLayer';

export enum NjHistoricalMapType {
  HistoricalMaps1881to1924,
  LandCover2007,
  LandCover2020,
  UsgsTopo100k,
  WetlandsFromLandCover2002,
  WetlandsImagery1970,
  AerialImagery1930,
}
export enum LayerType {
  WMSLayer,
  ImageryTileLayer,
  FeatureLayer
}

export interface NjHistoricalMap {
  type: NjHistoricalMapType;
  title: string;
  url: string;
  layerType: LayerType;
  sublayer?: string;
}

@Injectable({
  providedIn: 'root'
})
// service to make it easy to add a variety of NJ historical map layers to the map
export class NjHistoricalMapsService {
  defaultOpacity: number = 0.4;
  defaultVisibility: boolean = false;

  availableMaps: NjHistoricalMap[] = [
    {
      type: NjHistoricalMapType.HistoricalMaps1881to1924,
      title: "NJ Historical Maps (1881-1924)",
      url: "https://img.nj.gov/imagerywms/HistoricalMaps",
      layerType: LayerType.WMSLayer
    },
    {
      type: NjHistoricalMapType.LandCover2007,
      title: "NJ Land Cover (2007)",
      url: "https://mapsdep.nj.gov/arcgis/rest/services/Features/Land_lu/MapServer/4",
      layerType: LayerType.FeatureLayer,
    },
    {
      type: NjHistoricalMapType.LandCover2020,
      title: "NJ Land Cover (2020)",
      url: "https://services1.arcgis.com/QWdNfRs7lkPq4g4Q/arcgis/rest/services/Land_Use_2020/FeatureServer/5",
      layerType: LayerType.FeatureLayer,
    },
    {
      type: NjHistoricalMapType.UsgsTopo100k,
      title: "USGS Topo 100k",
      url: "https://img.nj.gov/imagerywms/Topo100K",
      layerType: LayerType.WMSLayer
    },
    {
      type: NjHistoricalMapType.WetlandsFromLandCover2002,
      title: "Wetlands from Land Cover (2002)",
      url: "https://mapsdep.nj.gov/arcgis/rest/services/Features/Land_lu/MapServer/9",
      layerType: LayerType.FeatureLayer,
    },
    {
      type: NjHistoricalMapType.WetlandsImagery1970,
      title: "Wetlands Imagery (1970)",
      url: "https://img.nj.gov/imagerywms/Wetlands1970",
      layerType: LayerType.WMSLayer,
    },
    {
      type: NjHistoricalMapType.AerialImagery1930,
      title: "Aerial Imagery (1930)",
      url: "https://img.nj.gov/imagerywms/BlackWhite1930",
      layerType: LayerType.WMSLayer
    }
  ];
  constructor() { }

  createLayer(mapType: NjHistoricalMapType): Layer | undefined {
    const njHistoricalMap = this.availableMaps.find(m => m.type === mapType);
    if (!njHistoricalMap) {
      return undefined;
    }
    switch (njHistoricalMap.layerType) {
      case LayerType.WMSLayer:
        return this.createWmsLayer(njHistoricalMap);
      case LayerType.FeatureLayer:
        return this.createFeatureLayer(njHistoricalMap);
      default:
        return undefined;
    }
  }
  createWmsLayer(njHistoricalMap: NjHistoricalMap): WMSLayer {
    let wmsLayer: WMSLayer = new WMSLayer({
      url: njHistoricalMap.url,
      title: njHistoricalMap.title,
      opacity: this.defaultOpacity,
      visible: this.defaultVisibility,
    });
    return wmsLayer;
  }
  createFeatureLayer(njHistoricalMap: NjHistoricalMap): FeatureLayer {
    let featureLayer: FeatureLayer = new FeatureLayer({
      url: njHistoricalMap.url,
      title: njHistoricalMap.title,
      opacity: this.defaultOpacity,
      visible: this.defaultVisibility,
    });
    return featureLayer;
  }
}
