import { Routes } from '@angular/router';
import { ArcMapComponent } from './components/arc-map/arc-map.component';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
    {
        path: 'map',
        component: ArcMapComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: '**',
        redirectTo: 'map',
        pathMatch: 'full'
    }
];
