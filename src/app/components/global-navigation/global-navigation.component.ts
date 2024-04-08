import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { map, shareReplay } from 'rxjs/operators';
import { ArcMapComponent } from "../arc-map/arc-map.component";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-global-navigation',
    templateUrl: './global-navigation.component.html',
    styleUrl: './global-navigation.component.scss',
    standalone: true,
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        RouterModule,
        AsyncPipe,
        ArcMapComponent
    ]
})
export class GlobalNavigationComponent {
  private breakpointObserver = inject(BreakpointObserver);

  hideNavBar$ = this.breakpointObserver.observe([Breakpoints.Medium, 
    Breakpoints.Small, Breakpoints.XSmall])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}
