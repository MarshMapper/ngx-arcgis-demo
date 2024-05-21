import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
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

}
