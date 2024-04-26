import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { SimpleMarkerSymbol } from '@arcgis/core/symbols';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { on } from '@arcgis/core/core/reactiveUtils';

@Injectable({
  providedIn: 'root'
})
export class EbirdService {
  ebirdBaseUrl: string = 'https://api.ebird.org/v2/';
  hotspotSegment: string = 'ref/hotspot/';
  nearbyHotspotsSegment: string = 'geo';
  observationsSegment: string = 'data/obs/';
  recentSegment: string = 'recent';
  ebirdApiKey: string = '';
  featureLayerSubect: Subject<FeatureLayer | undefined> = new Subject<FeatureLayer | undefined>();
  observationsActionId: string = "recent-observations";
  findHotspotsActionId: string = "nearby-hotspots";
  hotspotsLayer: FeatureLayer | undefined = undefined;
  hotspotsSubscription: Subscription | undefined = undefined;

  constructor(private httpClient: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.ebirdApiKey = environment.eBirdApiKey;
  }
  // Get eBird hotspots near a given latitude and longitude
  // Distance is in kilometers
  getNearbyHotspots(latitude: number, longitude: number, distance: number = 10): Observable<any> {
    let url: string = `${this.ebirdBaseUrl}${this.hotspotSegment}${this.nearbyHotspotsSegment}?lat=${latitude}&lng=${longitude}&dist=${distance}&fmt=json`;
    const httpHeaders: HttpHeaders = new HttpHeaders()
      .set('X-eBirdApiToken', this.ebirdApiKey);
    return this.httpClient.get(url, { headers: httpHeaders });
  }
  // get recent observations for a hotspot
  getRecentObservations(popup: any): Observable<any> {
    let hotspotId: string = popup.selectedFeature.attributes.HotspotId;
    let url: string = `${this.ebirdBaseUrl}${this.observationsSegment}${hotspotId}/${this.recentSegment}?maxResults=100&back=20&fmt=json`;
    const httpHeaders: HttpHeaders = new HttpHeaders()
      .set('X-eBirdApiToken', this.ebirdApiKey);
    return this.httpClient.get(url, { headers: httpHeaders });
  }
  getHotspotPopupContent(feature: any): string {
    let attributes = feature.graphic.attributes;
    const content: string = `<div><b>Latest Observation Date:</b> {LastObservationDate}</div>
    <div><b>Species All Time:</b> {NumSpeciesAllTime}</div>
    <div><b>eBird.org Source:</b> <a href="https://ebird.org/hotspot/${attributes.HotspotId}/bird-list" target="_blank">Hotspot Details</a></div>`;
    return content;
  }
  getFindHotspotsAction(): any {
    return {
      title: "Hotspots",
      id: this.findHotspotsActionId,
      image: "/assets/images/aab-16.png"
    };
  }
  getFindHotspotsActionId(): string {
    return this.findHotspotsActionId;
  }
  // Get a FeatureLayer of eBird hotspots near a given latitude and longitude
  getNearbyHotspotsLayer(latitude: number, longitude: number, distance: number = 10): Observable<FeatureLayer | undefined> {
    let features: any[] = [];
    let layer: FeatureLayer | undefined = undefined;

    this.getNearbyHotspots(latitude, longitude, distance).subscribe((hotspots) => {
      hotspots.forEach((hotspot: any) => {
        features.push({
          geometry: {
            type: "point",
            x: hotspot.lng,
            y: hotspot.lat
          },
          attributes: {
            HotspotId: hotspot.locId,
            Name: hotspot.locName,
            NumSpeciesAllTime: hotspot.numSpeciesAllTime,
            LastObservationDate: hotspot.latestObsDt
          }
        });
      });
      if (features.length == 0) {
        this.snackBar.open("No eBird hotspots found within the specified radius.", "Close", {
          duration: 5000
        });
      }
  
      const getObservationsAction = {
        title: "Get Observations",
        id: this.observationsActionId,
        image: "/assets/images/aab-32.png"
      };

      let ebirdTemplate = {
        title: "{Name}",
        content: this.getHotspotPopupContent.bind(this),
        // actions: [getObservationsAction]
      }
      const hotspotSymbol: SimpleMarkerSymbol = new SimpleMarkerSymbol({
        color: [200, 100, 100, 0.7],
        size: 8,
        outline: {
          color: [100, 48, 40],
          width: 1
        }
      });
      const hotspotRenderer = {
        type: "simple",
        symbol: hotspotSymbol,
        visualVariables: [
          {
            type: "color",
            field: "NumSpeciesAllTime",
            legendOptions: {
              title: "Number of Species",
              showLegend: true
            },
            stops: [
              { value: 0, color: "#bbbbbb" },
              { value: 20, color: "#aaaadd" },
              { value: 100, color: "#aadddd" },
              { value: 150, color: "#ddccaa" },
              { value: 200, color: "#ddaaaa" },
              { value: 300, color: "#dd8888" },
              { value: 400, color: "#dd2222" }
            ]
          }
        ]
      };
      layer = new FeatureLayer({
        source: features,
        outFields: ["Name", "HotspotId", "NumSpeciesAllTime", "LastObservationDate"],
        title: "eBird Hotspots",
        renderer: <any>hotspotRenderer,
        fields: [{
          name: "ObjectID",
          alias: "ObjectID",
          type: "oid"
        }, {
          name: "HotspotId",
          alias: "HotspotId",
          type: "string"
        }, {
          name: "Name",
          alias: "Name",
          type: "string"
        }, {
          name: "NumSpeciesAllTime",
          alias: "NumSpeciesAllTime",
          type: "integer"
        }, {
          name: "LastObservationDate",
          alias: "LastObservationDate",
          type: "date"
        }],
        objectIdField: "ObjectID",
        geometryType: "point",
        popupTemplate: <any>ebirdTemplate,
        copyright: "eBird.org"
      });
      this.featureLayerSubect.next(layer);
    });
    return this.featureLayerSubect.asObservable();
  }
  findHotspots(popup: any): Observable<FeatureLayer | undefined> {
    return this.getNearbyHotspotsLayer(popup.location.latitude, popup.location.longitude, 14);
  }

  // manage the eBird hotspots layer
  updateHotspotsLayer(view: any): void {
    this.hotspotsSubscription?.unsubscribe();
    this.hotspotsSubscription = this.findHotspots(view.popup).subscribe((layer) => {
      if (this.hotspotsLayer) {
        view.map.remove(this.hotspotsLayer);
      }
      if (layer && layer.source?.length > 0) {
        this.hotspotsLayer = layer;
        view.map.add(layer);
      } else {
        this.hotspotsLayer = undefined;
      }
    });
  }

  // add the listener for the get observations action button
  initializePopup(view: any) {
    on(() => view.popup, "trigger-action", (event) => {
      if (event.action.id === this.observationsActionId) {
        this.getRecentObservations(view.popup).subscribe((layer) => {
          console.log(layer);
        });
      }
    });
  }
}
