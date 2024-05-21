import { Component, OnInit, inject } from '@angular/core';
import { defineCustomElements } from "@arcgis/map-components/dist/loader";
import { defineCustomElements as defineCalciteElements } from "@esri/calcite-components/dist/loader";
import { CommonModule } from '@angular/common';
import { ComponentLibraryModule } from '@arcgis/map-components-angular';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { CalciteComponentsModule } from '@esri/calcite-components-angular';
import { ProtectedAreasService } from '../../services/protected-areas.service';
import { UnprotectedAreasService } from '../../services/unprotected-areas.service';

@Component({
  selector: 'app-arc-map',
  standalone: true,
  imports: [ CommonModule, ComponentLibraryModule, CalciteComponentsModule ],
  templateUrl: './arc-map.component.html',
  styleUrl: './arc-map.component.scss'
})
export class ArcMapComponent implements OnInit {
  public isLoading: boolean = true;
  public showInfoPanel: boolean = false;
  public isSmallPortrait: boolean = false;
  private breakpointObserver = inject(BreakpointObserver);

  isSmallPortrait$ = this.breakpointObserver.observe([ 
    Breakpoints.TabletPortrait, 
    Breakpoints.HandsetPortrait ])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  constructor(private protectedAreasService: ProtectedAreasService,
    private unprotectedAreasService: UnprotectedAreasService
  ) { }

  arcgisViewReadyChange(event: any) {
    this.isLoading = false;
    const mapElement = event.target;

    mapElement.map.add(this.unprotectedAreasService.createImageryTileLayer());
    this.unprotectedAreasService.initializePopup(mapElement.view);
    mapElement.map.add(this.protectedAreasService.createFeatureLayer());
    this.protectedAreasService.initializePopup(mapElement.view);
  }
  getInfoPanelClass(): string {
    if (this.showInfoPanel) {
      return this.isSmallPortrait ? 'map-container-vertical' : 'map-container-horizontal';
    }
    return 'map-container-map-only';
  }

  ngOnInit(): void {
    defineCustomElements(window, { resourcesUrl: "https://js.arcgis.com/map-components/4.29/assets" });
    defineCalciteElements(window, { resourcesUrl: "https://js.arcgis.com/calcite-components/2.5.1/assets" });
    this.isSmallPortrait$.subscribe((isSmallPortrait) => {
      this.isSmallPortrait = isSmallPortrait;
    });
  }
}
