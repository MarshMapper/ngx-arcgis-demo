import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { on } from '@arcgis/core/core/reactiveUtils';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { EbirdService } from './ebird.service';

@Injectable({
  providedIn: 'root'
})
export class ProtectedAreasService {
  IucnCategoryMap = new Map<string, string>();
  hotspotsLayer: FeatureLayer | undefined = undefined;
  hotspotActionId: string = "nearby-hotspots";

  constructor(private ebirdService: EbirdService) {
    this.initializeCategoryMap();
  }
  initializeCategoryMap(): void {
    this.IucnCategoryMap.set("Ia", "Strict Nature Reserve: protected area managed mainly for science");
    this.IucnCategoryMap.set("Ib", "Strict Nature Reserve: protected area managed mainly for science");
    this.IucnCategoryMap.set("II", "National park: protected area managed mainly for ecosystem protection and recreation");
    this.IucnCategoryMap.set("III", "Natural Monument: protected area managed mainly for conservation of specific natural features");
    this.IucnCategoryMap.set("IV", "Habitat/Species Management Area: protected area managed mainly for conservation through management intervention");
    this.IucnCategoryMap.set("NA", "IUCN category is not available");
    this.IucnCategoryMap.set("UA", "Unassigned");
    this.IucnCategoryMap.set("V", "Protected Landscape/Seascape: protected area managed mainly for landscape/seascape conservation and recreation");
    this.IucnCategoryMap.set("VI", "Managed Resource Protected Area: protected area managed mainly for the sustainable use of natural ecosystems");
    this.IucnCategoryMap.set("Not Assigned", "No Category has been assigned");
  }

  createFeatureLayer(): FeatureLayer {
    const findHotspotsAction = {
      title: "Find Hotspots",
      id: this.hotspotActionId,
      image: "/assets/favicon-16x16.png"
    };

    // Define the popup template with function that returns the content based on the feature attributes
    const template = {
      title: "{name}",
      content: this.getContent.bind(this),
      actions: [findHotspotsAction]
    };
    const protectedAreasRenderer = {
      type: "simple",
      symbol: {
        type: "simple-fill",
        style: "solid",
        color: [100, 180, 100, 0.5],
        outline: {
          color: "#118811",
          width: "1px"
        }
      }
    };

    return new FeatureLayer({
      url: "https://services5.arcgis.com/Mj0hjvkNtV7NRhA7/arcgis/rest/services/WDPA_v0/FeatureServer/1",
      outFields: ["NAME", "DESIG", "IUCN_CAT"],
      renderer: <any>protectedAreasRenderer,
      popupTemplate: <any>template
    });
  }
  getContent(feature: any): string {
    let attributes = feature.graphic.attributes;
    let category: string | undefined = this.IucnCategoryMap.get(attributes.iucn_cat);
    const content: string = `<div><b>Source:</b> World Database of Protected Areas (WDPA)</div>
    <div><b>Designation:</b> {DESIG}</div>
    <div><b>IUCN Category:</b> {IUCN_CAT} - ${category}</div>`;
    return content;
  }
  findHotspots(popup: any): Observable<FeatureLayer | undefined> {
    return this.ebirdService.getNearbyHotspotsLayer(popup.location.latitude, popup.location.longitude, 14);
  }

  // add the listener for the find hotspots action button
  initializePopup(view: any) {
    this.ebirdService.initializePopup(view);
    on(() => view.popup, "trigger-action", (event) => {
      if (event.action.id === this.hotspotActionId) {
        this.findHotspots(view.popup).subscribe((layer) => {
          if (this.hotspotsLayer) {
            view.map.remove(this.hotspotsLayer);
          }
          if (layer) {
            this.hotspotsLayer = layer;
            view.map.add(layer);
          }
        });
      }
    });
  }
}