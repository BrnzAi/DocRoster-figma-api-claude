import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapBackgroundComponent } from './components/shared/map-background.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MapBackgroundComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'docroster-app';

  ngOnInit() {
    // Load Google Maps API dynamically from environment
    this.loadGoogleMapsScript();
  }

  private loadGoogleMapsScript() {
    // Check if already loaded
    if (typeof google !== 'undefined' && google.maps) {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places,marker`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}
