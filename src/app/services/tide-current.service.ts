import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeoDistanceService } from './geo-distance.service';
import { HttpClient } from '@angular/common/http';
import esriRequest from '@arcgis/core/request';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { SimpleMarkerSymbol } from '@arcgis/core/symbols';
import { ProgressService } from './progress.service';

@Injectable({
  providedIn: 'root'
})
export class TideCurrentService {
  allStations: any[] = [];
  tideStationsLayer: FeatureLayer | undefined = undefined;
  tideStationMap: Map<string, any> = new Map<string, any>();
  tideActionId: string = "nearby-tide-stations";
  maximumPredictions: number = 2;

  constructor(private httpClient: HttpClient,
    private geoDistanceService: GeoDistanceService,
    private snackBar: MatSnackBar,
    private progressService: ProgressService
  ) { 
    // get the tide stations from the NOAA API
    this.getTideStations();
  }

  // get all stations that offer tide predictions.  API does not allow filtering by type, but there are 
  // about 3300 stations, which is manageable.  typically this data is available before the map loads 
  // completely, but if not, the user will be told to try again later.
  getTideStations(): void {
    let url: string = `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions&units=english`;

    this.httpClient.get(url).subscribe((response: any) => {
      this.allStations = response.stations;
      this.allStations.forEach((station: any) => {
        this.tideStationMap.set(station.id, station);
      });
    });
  }

  getFindStationsAction(): any {
    return {
      title: "Tide Stations",
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

  getFormattedDate(date: Date): string {
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    return `${date.getFullYear()}${month}${day} ${hours}:${minutes}`;
  }

  // get the URL for the next few tide predictions for a given station
  getPredictionsUrl(stationId: string): string {
    let now = new Date();
    let currentDate: string = this.getFormattedDate(now);
    const staticUrlPart: string = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&format=json";
    return `${staticUrlPart}&begin_date=${currentDate}&range=18&station=${stationId}`;
  }

  // format the upcoming tide predictions for display in the popup
  getPredictionsContent(predictions: any[]): string {
    let predictionsContent: string = `<div><b>Next High and Low Tides:</b></div>
      <table class="tide-table"><tr class="tide-header"><th class="tide-cell">Type</th><th class="tide-cell">Time</th><th class="tide-cell">Water Level (ft)</th></tr>`;
    predictions.forEach((prediction: any) => {
      predictionsContent += `<tr><td class="tide-cell">${prediction.type == 'L' ? 'Low' : 'High'}</td>`;
      predictionsContent += `<td class="tide-cell">${prediction.t}</td><td class="tide-cell number-cell">${prediction.v}</td>`;
    });
    predictionsContent += "</table>";
    return predictionsContent;
  }
  // format the tide station information for display in the popup
  getStationInfoContent(attributes: any): string {
    const stationBaseUrl: string = "https://tidesandcurrents.noaa.gov/stationhome.html?id=";
    let stationType: string = attributes.StationType == "S" ? "Subordinate" : "Reference";
    let url: string = `${stationBaseUrl}${attributes.StationId}`;
    let referenceUrl: string = `${stationBaseUrl}${attributes.ReferenceId}`;
    let referenceSegment: string = '';
    if (attributes.ReferenceId) {
      let referenceStation: any = this.tideStationMap.get(attributes.ReferenceId);
      referenceSegment = `<div><b>Reference Station:</b> <a href="${referenceUrl}">${referenceStation.name} (${attributes.ReferenceId})</a></div>`;
    } 
    return `<div><b>Station Id:</b> <a href="${url}">{StationId}</a></div>
      ${referenceSegment}
      <div><b>Station Type:</b> ${stationType}</div>`;
  }

  // get the next 2 (or maximumPredictions) tide predictions for a station and format the popup content
  getStationPopupContent(feature: any): Promise<string> {
    let attributes = feature.graphic.attributes;
    let url: string = this.getPredictionsUrl(attributes.StationId);
    return esriRequest(url)
      .then((response: any) => {
        let predictions: any[] = response.data.predictions;
        predictions = predictions.slice(0, this.maximumPredictions);

        return this.getPredictionsContent(predictions) + this.getStationInfoContent(attributes);
      });
  }

  // Get a FeatureLayer of tide prediction stations near a given latitude and longitude
  getNearbyStationsLayer(latitude: number, longitude: number, distance: number = 10): FeatureLayer | undefined {
    let features: any[] = [];
    let layer: FeatureLayer | undefined = undefined;

    this.progressService.setWorkInProgress(true);

    if (!this.allStations || this.allStations.length == 0) {
      this.snackBar.open("Tide stations are not available. Please try again later.", "Close", {
        duration: 5000
      });
      return layer;
    }
    // filter the stations to those within the specified radius and create point geometries for them
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
    this.progressService.setWorkInProgress(false);
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
