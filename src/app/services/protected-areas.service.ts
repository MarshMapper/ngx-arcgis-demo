import { Injectable } from '@angular/core';
import { on } from '@arcgis/core/core/reactiveUtils';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { EbirdService } from './ebird.service';
import { TideCurrentService } from './tide-current.service';
import { WeatherService } from './weather.service';

@Injectable({
  providedIn: 'root'
})
export class ProtectedAreasService {
  IucnCategoryMap = new Map<string, string>();

  constructor(private ebirdService: EbirdService,
    private tideCurrentService: TideCurrentService,
    private weatherService: WeatherService
  ) {
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
    // Define the popup template with function that returns the content based on the feature attributes
    const template = {
      title: "{name}",
      content: this.getContent.bind(this),
      actions: [this.ebirdService.getFindHotspotsAction(), 
        this.tideCurrentService.getFindStationsAction(),
        this.weatherService.getWeatherAction()]
    };
    const protectedAreasRenderer = {
      type: "simple",
      symbol: {
        type: "simple-fill",
        style: "solid",
        color: [100, 180, 100, 0.5],
        outline: {
          color: [40, 100, 40, 0.8],
          width: 1
        }
      }
    };

    return new FeatureLayer({
      url: "https://services5.arcgis.com/Mj0hjvkNtV7NRhA7/arcgis/rest/services/WDPA_v0/FeatureServer/1",
      outFields: ["NAME", "DESIG", "IUCN_CAT"],
      renderer: <any>protectedAreasRenderer,
      title: "World Database of Protected Areas (WDPA)",
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

  // add the listener for the find hotspots action button
  initializePopup(view: any) {
    this.ebirdService.initializePopup(view);
    on(() => view.popup, "trigger-action", (event) => {
      switch (event.action.id) {
        case this.ebirdService.getFindHotspotsActionId():
          this.ebirdService.updateHotspotsLayer(view);
          break;
        case this.tideCurrentService.getFindStationsActionId():
          this.tideCurrentService.updateTideStationsLayer(view);
          break;
        case this.weatherService.getWeatherActionId():
          this.weatherService.getWeatherPredictions(view.popup).then((predictions) => {
            let periods = predictions.periods.slice(0, 2);
            let content: string = "<div>";

            periods.forEach((period: any) => {
              content += `<div><b>${period.name}:</b> ${period.detailedForecast}</div>`;
            });

            content += "</div>";
            view.popup.content = content;
          });
          break;
      }
    });
  }
}
