import { Component } from '@angular/core';
import { GlobalNavigationComponent } from './components/global-navigation/global-navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GlobalNavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'NJ, Naturally';
}
