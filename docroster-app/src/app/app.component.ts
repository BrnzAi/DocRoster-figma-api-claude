import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapBackgroundComponent } from './components/shared/map-background.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MapBackgroundComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'docroster-app';
}
