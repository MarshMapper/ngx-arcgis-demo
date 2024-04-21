import { Injectable } from '@angular/core';
import { GeoDistanceService } from './geo-distance.service';
import { HttpClient } from '@angular/common/http';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { SimpleMarkerSymbol } from '@arcgis/core/symbols';

@Injectable({
  providedIn: 'root'
})
export class TideCurrentService {
  allStations: any[] = [];
  tideStationsLayer: FeatureLayer | undefined = undefined;
  tideActionId: string = "nearby-tide-stations";

  constructor(private httpClient: HttpClient,
    private geoDistanceService: GeoDistanceService) { 
    // get the tide stations from the NOAA API
    this.getTideStations();
  }

  getTideStations(): void {
    let url: string = `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions&units=english`;

    this.httpClient.get(url).subscribe((response: any) => {
      this.allStations = response.stations;
    });
  }

  getFindStationsAction(): any {
    return {
      title: "Find Tide Stations",
      id:  this.tideActionId,
      image: "/assets/images/noaa-16x16.png"
    };
  }
  getFindStationsActionId(): string {
    return this.tideActionId;
  }
  stationsWithinRadius(latitude: number, longitude: number): any[] {
    let filteredStations: any[] = this.allStations.filter((station) => {
      return this.geoDistanceService.isPointWithinRadius(latitude, longitude, station.lat, station.lng);
    });
    return filteredStations;
  }

  getStationPopupContent(feature: any): string {
    const stationBaseUrl: string = "https://tidesandcurrents.noaa.gov/stationhome.html?id=";
    let attributes = feature.graphic.attributes;
    let stationType: string = attributes.StationType == "S" ? "Subordinate" : "Reference";
    let url: string = `${stationBaseUrl}${attributes.StationId}`;
    let referenceUrl: string = `${stationBaseUrl}${attributes.ReferenceId}`;
    let referenceSegment: string = attributes.ReferenceId ? `<div><b>Reference Station Id:</b> <a href="${referenceUrl}">{ReferenceId}</a></div>` : "";
    const content: string = `<div><b>Station Id:</b> <a href="${url}">{StationId}</a></div>
    ${referenceSegment}
    <div><b>Station Type:</b> ${stationType}</div>`;
    return content;
  }

  // Get a FeatureLayer of tide prediction stations near a given latitude and longitude
  getNearbyStationsLayer(latitude: number, longitude: number, distance: number = 10): FeatureLayer | undefined {
    let features: any[] = [];
    let layer: FeatureLayer | undefined = undefined;

    this.stationsWithinRadius(latitude, longitude).forEach((station: any) => {
      features.push({
        geometry: {
          type: "point",
          x: station.lng,
          y: station.lat
        },
        attributes: {
          StationId: station.id,
          Name: station.name,
          ReferenceId: station.reference_id,
          StationType: station.type
        }
      });
    });
    let stationTemplate = {
      title: "{Name}",
      content: this.getStationPopupContent.bind(this)
    }

    const stationSymbol: SimpleMarkerSymbol = new SimpleMarkerSymbol({
      color: [100, 160, 200, 0.7],
      size: 8,
      outline: {
        color: [40, 80, 100],
        width: 1
      }
    });
    const stationRenderer = {
      type: "simple",
      symbol: stationSymbol
    };
    layer = new FeatureLayer({
      source: features,
      outFields: ["StationId", "Name", "ReferenceId", "StationType"],
      title: "Tide Stations",
      renderer: <any>stationRenderer,
      fields: [{
        name: "ObjectID",
        alias: "ObjectID",
        type: "oid"
      }, {
        name: "StationId",
        alias: "StationId",
        type: "string"
      }, {
        name: "Name",
        alias: "Name",
        type: "string"
      }, {
        name: "ReferenceId",
        alias: "ReferenceId",
        type: "string"
      }, {
        name: "StationType",
        alias: "StationType",
        type: "string"
      }],
      objectIdField: "ObjectID",
      geometryType: "point",
      popupTemplate: <any>stationTemplate,
      copyright: "noaa.gov"
    });
    return layer;
  }
  // manage the tide stations layer
  updateTideStationsLayer(view: any): void {
    let layer = this.getNearbyStationsLayer(view.popup.location.latitude, view.popup.location.longitude);
    if (this.tideStationsLayer) {
      view.map.remove(this.tideStationsLayer);
    }
    if (layer && layer.source?.length > 0) {
      this.tideStationsLayer = layer;
      view.map.add(layer);
    } else {
      this.tideStationsLayer = undefined;
    }
  }
}
