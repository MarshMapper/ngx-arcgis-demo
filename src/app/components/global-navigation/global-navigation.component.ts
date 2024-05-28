import { Component, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { ArcMapComponent } from "../arc-map/arc-map.component";
import { RouterModule } from '@angular/router';
import { ProgressService } from '../../services/progress.service';

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
        MatProgressBarModule,
        RouterModule,
        AsyncPipe,
        ArcMapComponent
    ]
})
export class GlobalNavigationComponent {
    @ViewChild('loadingIndicator') loadingIndicator!: MatProgressBar;
    showProgressBar: boolean = false;
    constructor(private progressService: ProgressService) { 
        this.progressService.getWorkInProgress().subscribe((workInProgress: boolean) => {
            this.showProgressBar = workInProgress;
        });
    }
}
