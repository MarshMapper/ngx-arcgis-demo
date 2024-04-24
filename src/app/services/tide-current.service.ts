import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeoDistanceService } from './geo-distance.service';
import { HttpClient } from '@angular/common/http';
import esriRequest from '@arcgis/core/request';
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
    private geoDistanceService: GeoDistanceService,
    private snackBar: MatSnackBar
  ) { 
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

  getStationPopupContent(feature: any): Promise<string> {
    let attributes = feature.graphic.attributes;
    let url: string = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=${attributes.StationId}&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=DataAPI_Sample&format=json`;
    return esriRequest(url)
      .then((response: any) => {
        let predictions: any[] = response.data.predictions;
        let predictionsContent: string = `<div><b>Today's High and Low Tides:</b></div>
          <table style="border-spacing: 6px;"><tr style="color: #123c74;"><th style="text-align:left;">Type</th><th style="text-align:left;">Time</th><th>Water Level (ft)</th></tr>`;
        predictions.forEach((prediction: any) => {
          predictionsContent += `<tr><td>${prediction.type == 'L' ? 'Low' : 'High'}</td>`;
          predictionsContent += `<td>${prediction.t}</td><td style="text-align:right;">${prediction.v}</td>`;
        });
        predictionsContent += "</table>";
        const stationBaseUrl: string = "https://tidesandcurrents.noaa.gov/stationhome.html?id=";
        let stationType: string = attributes.StationType == "S" ? "Subordinate" : "Reference";
        let url: string = `${stationBaseUrl}${attributes.StationId}`;
        let referenceUrl: string = `${stationBaseUrl}${attributes.ReferenceId}`;
        let referenceSegment: string = attributes.ReferenceId ? `<div><b>Reference Station Id:</b> <a href="${referenceUrl}">{ReferenceId}</a></div>` : "";
        const content: string = `<div><b>Station Id:</b> <a href="${url}">{StationId}</a></div>
        ${referenceSegment}
        <div><b>Station Type:</b> ${stationType}</div>`;
        return predictionsContent + content;
      });
  }

  // Get a FeatureLayer of tide prediction stations near a given latitude and longitude
  getNearbyStationsLayer(latitude: number, longitude: number, distance: number = 10): FeatureLayer | undefined {
    let features: any[] = [];
    let layer: FeatureLayer | undefined = undefined;

    if (!this.allStations || this.allStations.length == 0) {
      this.snackBar.open("Tide stations are not available. Please try again later.", "Close", {
        duration: 5000
      });
      return layer;
    }
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
    if (features.length == 0) {
      this.snackBar.open("No tide stations found within the specified radius.", "Close", {
        duration: 5000
      });
      return layer;
    }
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
