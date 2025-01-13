import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { when, whenOnce } from '@arcgis/core/core/reactiveUtils';
import { BreakpointService } from '../../services/breakpoint.service';

function getRangeLabel(page: number, pageSize: number, length: number): string {
  if (length === 0 || pageSize === 0) {
    return `0 of ${length}`;
  }
  length = Math.max(length, 0);
  const startIndex = page * pageSize;
  const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
  return `${startIndex + 1} – ${endIndex}`;
}
// customize the Material paginator 
function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();
  customPaginatorIntl.itemsPerPageLabel = 'Show:';
  customPaginatorIntl.getRangeLabel = getRangeLabel;

  return customPaginatorIntl;
}
@Component({
    selector: 'app-feature-list',
    imports: [CommonModule, MatPaginatorModule, MatTableModule, MatSortModule],
    providers: [
        { provide: MatPaginatorIntl, useValue: CustomPaginator() }
    ],
    templateUrl: './feature-list.component.html',
    styleUrl: './feature-list.component.scss'
})
export class FeatureListComponent implements OnInit, AfterViewInit {
  public isSmallPortrait: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() featureLayerView$!: Observable<__esri.FeatureLayerView>;
  featureLayerView!: __esri.FeatureLayerView;
  selectedRow: any = null;

  displayedColumns: string[] = ['name']; // Only 'name' column is displayed
  dataSource = new MatTableDataSource();

  constructor(private breakpointService: BreakpointService) { }

  ngOnInit(): void {
    this.breakpointService.isSmallPortrait$.subscribe((isSmallPortrait) => {
      this.isSmallPortrait = isSmallPortrait;
    });
    // parent component will pass in the featureLayerView observable and emit a new value
    // each time the view changes
    this.featureLayerView$?.subscribe((layerView: __esri.FeatureLayerView) => {
      if (this.featureLayerView) {
        return;
      }
      this.featureLayerView = layerView;
      this.updateListAfterViewChange(layerView);
    });
  }
  // do a one-time update of the list when the view is done updating
  updateListFromView(layerView: __esri.FeatureLayerView): void {
    whenOnce(() => !layerView.updating).then(() => {
      this.updateDataSource(layerView);
    });
  }
  // update the list every time the view changes
  updateListAfterViewChange(layerView: __esri.FeatureLayerView): void {
    when(
      () => !layerView.updating,
      (val) => {
        this.updateDataSource(layerView);
      });
  }
  updateDataSource(layerView: __esri.FeatureLayerView): void {
    // get all the features in view from the layerView
    layerView.queryFeatures().then((results) => {
      let features: any[] = [];
      // add to array with just the name for display and the id for selection / tracking
      results.features.forEach((feature) => {
        features.push({ id: feature.attributes.OBJECTID, name: feature.attributes.name });
      });
      // sort the features by name, then update the data table
      features.sort((a, b) => a.name.localeCompare(b.name));
      this.dataSource.data = features;
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  // select the feature in the map associated with the selected row in the table
  selectFeature(row: any): void {
    // query by unique OBJECTID
    let query = this.featureLayerView.createQuery();
    query.where = `OBJECTID = ${row.id}`;

    this.featureLayerView.queryFeatures(query).then((results) => {
      if (results.features.length > 0) {
        // searching by id, there should only be one feature found.
        // open the popup for the feature and center the view on it
        const feature = results.features[0];
        this.featureLayerView.view.openPopup({
          features: [feature],
          updateLocationEnabled: true
        });
      }
    });
  }
  // select the row the user clicked on
  selectRow(row: any): void {
    if (this.selectedRow !== row) {
      this.selectedRow = row;
      this.selectFeature(row);
    }
  }
  getFeatureContainerClass(): string {
    return this.isSmallPortrait ? 'feature-table-container-vertical' : 'feature-table-container-horizontal';
  }
}
