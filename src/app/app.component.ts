import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalNavigationComponent } from './components/global-navigation/global-navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GlobalNavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'NJ, Naturally';
}
