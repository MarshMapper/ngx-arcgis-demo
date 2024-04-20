import { Injectable } from '@angular/core';
import { on } from '@arcgis/core/core/reactiveUtils';
import ImageryTileLayer from '@arcgis/core/layers/ImageryTileLayer';
import { EbirdService } from './ebird.service';
import { TideCurrentService } from './tide-current.service';

@Injectable({
  providedIn: 'root'
})
export class UnprotectedAreasService {
  constructor(private ebirdService: EbirdService,
      private tideCurrentService: TideCurrentService) {
  }

  createImageryTileLayer(): ImageryTileLayer {
    // Define the popup template with function that returns the content based on the feature attributes
    const template = {
      title: "Area of Biodiversity Importance",
      content: this.getContent.bind(this),
      actions: [this.ebirdService.getFindHotspotsAction(), 
        this.tideCurrentService.getFindStationsAction()]
    };

    return new ImageryTileLayer({
      // url: "https://tiledimageservices.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/AUBILayer/ImageServer",
      portalItem: { id: "467bee83be37487ca06f895b8a011cd8" },
      title: "Areas of Unprotected Biodiversity Importance",
      blendMode: "overlay",
      popupTemplate: <any>template
    });
  }
  getContent(feature: any): string {
    const content: string = 
      `<div><b>Source:</b> Areas of Unprotected Biodiversity Importance (AUBIs) for species in the lower 48 United States</div><br />
      <div><a href="https://livingatlas.arcgis.com/en/browse/?q=%22Areas%20of%20Unprotected%20Biodiversity%20Importance%20of%20Imperiled%20Species%20in%20the%20United%20States%22#q=%22Areas+of+Unprotected+Biodiversity+Importance+of+Imperiled+Species+in+the+United+States%22&d=2">ArcGIS Living Atlas</a></div>`;
    return content;
  }

  // add the listener for the find hotspots action button
  initializePopup(view: any) {
    this.ebirdService.initializePopup(view);
    on(() => view.popup, "trigger-action", (event) => {
      if (event.action.id === this.ebirdService.getFindHotspotsActionId()) {
        this.ebirdService.updateHotspotsLayer(view);
      } else if (event.action.id === this.tideCurrentService.getFindStationsActionId()) {
        this.tideCurrentService.updateTideStationsLayer(view);
      }
    });
  }
}
