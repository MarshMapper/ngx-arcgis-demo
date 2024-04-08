import { Component, OnInit } from '@angular/core';
import { defineCustomElements } from "@arcgis/map-components/dist/loader";
import { defineCustomElements as defineCalciteElements } from "@esri/calcite-components/dist/loader";
import { ComponentLibraryModule } from '@arcgis/map-components-angular';
import { CalciteComponentsModule } from '@esri/calcite-components-angular';

@Component({
  selector: 'app-arc-map',
  standalone: true,
  imports: [ ComponentLibraryModule, CalciteComponentsModule ],
  templateUrl: './arc-map.component.html',
  styleUrl: './arc-map.component.scss'
})
export class ArcMapComponent implements OnInit {
  public isLoading: boolean = true;

  arcgisViewReadyChange(event: any) {
    this.isLoading = false;
  }
  ngOnInit(): void {
    defineCustomElements(window, { resourcesUrl: "https://js.arcgis.com/map-components/4.29/assets" });
    defineCalciteElements(window, { resourcesUrl: "https://js.arcgis.com/calcite-components/2.5.1/assets" });
  }
}
