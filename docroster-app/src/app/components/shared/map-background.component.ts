import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map-background',
  standalone: true,
  imports: [GoogleMapsModule],
  template: `
    <div class="map-background">
      <google-map
        [options]="mapOptions"
        width="100%"
        height="100%"
      ></google-map>
    </div>
  `,
  styles: [`
    .map-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
  `]
})
export class MapBackgroundComponent {
  mapOptions: google.maps.MapOptions = {
    center: { lat: 40.7128, lng: -74.0060 },
    zoom: 12,
    disableDefaultUI: true,
    styles: [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };
}
