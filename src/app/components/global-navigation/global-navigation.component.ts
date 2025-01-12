import { Component, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { ProgressService } from '../../services/progress.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-global-navigation',
    templateUrl: './global-navigation.component.html',
    styleUrl: './global-navigation.component.scss',
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatProgressBarModule,
        RouterModule,
        AsyncPipe
    ]
})
export class GlobalNavigationComponent {
    @ViewChild('loadingIndicator') loadingIndicator!: MatProgressBar;
    showProgressBar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private readonly progressService: ProgressService) { 
    }
    ngAfterViewInit() {
        this.progressService.getWorkInProgress().subscribe((workInProgress: boolean) => {
            setTimeout(() => this.showProgressBar$.next(workInProgress));
        });
    }   
}
