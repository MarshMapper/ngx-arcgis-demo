import { CommonModule } from '@angular/common';
import { map, Observable, shareReplay } from 'rxjs';
import { AfterViewInit, Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { when } from '@arcgis/core/core/reactiveUtils';

function getRangeLabel(page: number, pageSize: number, length: number): string {
  if (length === 0 || pageSize === 0) {
    return `0 of ${length}`;
  }
  length = Math.max(length, 0);
  const startIndex = page * pageSize;
  const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
  return `${startIndex + 1} – ${endIndex}`;
}
function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();
  customPaginatorIntl.itemsPerPageLabel = 'Show:';
  customPaginatorIntl.getRangeLabel = getRangeLabel;

  return customPaginatorIntl;
}
@Component({
  selector: 'app-feature-list',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatTableModule, MatSortModule ], 
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
  ],
  templateUrl: './feature-list.component.html',
  styleUrl: './feature-list.component.scss'
})
export class FeatureListComponent implements OnInit, AfterViewInit {
  public isSmallPortrait: boolean = false;
  private breakpointObserver = inject(BreakpointObserver);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() featureLayerView!: Observable<__esri.FeatureLayerView>;

  displayedColumns: string[] = ['name']; // Only 'name' column is displayed
  dataSource = new MatTableDataSource();

  isSmallPortrait$ = this.breakpointObserver.observe([
    Breakpoints.TabletPortrait,
    Breakpoints.HandsetPortrait])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  getFeatureContainerClass(): string {
    return this.isSmallPortrait ? 'feature-table-container-vertical' : 'feature-table-container-horizontal';
  }
  ngOnInit(): void {
    this.isSmallPortrait$.subscribe((isSmallPortrait) => {
      this.isSmallPortrait = isSmallPortrait;
    });
    // parent component will pass in the featureLayerView observable and emit a new value
    // each time the view changes
    this.featureLayerView.subscribe((layerView: __esri.FeatureLayerView) => {
      when(
        () => !layerView.updating,
        (val) => {
          // get all the features in view from the layerView
          layerView.queryFeatures().then((results) => {
            let features: any[] = [];
            // add to array with just the name for display and the id for selection / tracking
            results.features.forEach((feature) => {
              features.push({ id: feature.attributes.id, name: feature.attributes.name });
            });
            // sort the features by name, then update the data table
            features.sort((a, b) => a.name.localeCompare(b.name));
            this.dataSource.data = features;
          })
        });
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
