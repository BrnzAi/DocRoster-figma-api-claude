import { Component, OnInit, ViewChild, ElementRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleMap, MapMarker, GoogleMapsModule } from '@angular/google-maps';
import { SpecialistsService } from '../../services/specialists.service';
import { AuthService } from '../../services/auth.service';
import { Specialist, SearchFilters } from '../../models/specialist.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  @ViewChild(GoogleMap) map!: GoogleMap;
  
  // Signals for reactive state
  searchQuery = signal('');
  showFilters = signal(false);
  selectedSpecialties = signal<string[]>([]);
  
  // Map configuration
  mapOptions: google.maps.MapOptions = {
    center: environment.defaultCenter,
    zoom: environment.defaultZoom,
    mapId: environment.googleMapsMapId,
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  };

  constructor(
    public specialistsService: SpecialistsService,
    public authService: AuthService,
    private router: Router
  ) {}

  // Get data from services
  specialists = computed(() => this.specialistsService.filteredSpecialists());
  selectedSpecialist = computed(() => this.specialistsService.selectedSpecialist());
  currentUser = computed(() => this.authService.currentUser());
  
  // Get specialties list
  get specialties() {
    return this.specialistsService.getSpecialties();
  }

  // Computed properties
  markerPositions = computed(() => {
    return this.specialists().map((s: Specialist) => ({
      position: { lat: s.location.lat, lng: s.location.lng },
      specialist: s,
      options: {
        icon: this.createMarkerIcon(s),
        title: s.name
      }
    }));
  });

  ngOnInit(): void {
    this.specialistsService.loadSpecialists().subscribe();
  }

  /**
   * Handle search input
   */
  onSearch(): void {
    const query = this.searchQuery();
    if (query.trim()) {
      this.specialistsService.searchSpecialists(query).subscribe();
    } else {
      this.specialistsService.loadSpecialists().subscribe();
    }
  }

  /**
   * Toggle filters panel
   */
  toggleFilters(): void {
    this.showFilters.update((v: boolean) => !v);
  }

  /**
   * Handle specialty filter change
   */
  onSpecialtyChange(specialtyId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    
    this.selectedSpecialties.update((current: string[]) => {
      if (checked) {
        return [...current, specialtyId];
      } else {
        return current.filter((id: string) => id !== specialtyId);
      }
    });

    this.applyFilters();
  }

  /**
   * Apply all filters
   */
  applyFilters(): void {
    const filters: SearchFilters = {
      specialty: this.selectedSpecialties().length > 0 ? this.selectedSpecialties() : undefined
    };
    
    this.specialistsService.updateSearchFilters(filters);
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.selectedSpecialties.set([]);
    this.specialistsService.updateSearchFilters({});
  }

  /**
   * Handle specialist selection from list
   */
  selectSpecialist(specialist: Specialist): void {
    this.specialistsService.selectSpecialist(specialist);
    
    // Center map on selected specialist
    if (this.map) {
      this.map.panTo({ lat: specialist.location.lat, lng: specialist.location.lng });
      this.map.zoom = 15;
    }
  }

  /**
   * Handle marker click
   */
  onMarkerClick(specialist: Specialist): void {
    this.specialistsService.selectSpecialist(specialist);
  }

  /**
   * Navigate to specialist details
   */
  viewDetails(specialist: Specialist): void {
    this.router.navigate(['/specialist', specialist.id]);
  }

  /**
   * Close specialist details panel
   */
  closeDetails(): void {
    this.specialistsService.selectSpecialist(null);
  }

  /**
   * Handle map bounds changed
   */
  onBoundsChanged(): void {
    if (this.map && this.map.googleMap) {
      const bounds = this.map.googleMap.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        
        this.specialistsService.updateMapBounds({
          north: ne.lat(),
          south: sw.lat(),
          east: ne.lng(),
          west: sw.lng()
        });
      }
    }
  }

  /**
   * Logout
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Get star array for rating display
   */
  getStarArray(rating: number): boolean[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating));
  }

  /**
   * Create custom marker icon with specialist avatar
   */
  private createMarkerIcon(specialist: Specialist): google.maps.Icon {
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(this.getMarkerSvg(specialist))}`,
      scaledSize: new google.maps.Size(40, 50),
      anchor: new google.maps.Point(20, 50)
    };
  }

  /**
   * Generate SVG for marker with avatar
   */
  private getMarkerSvg(specialist: Specialist): string {
    const color = specialist.specialty.color;
    return `
      <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="circleClip-${specialist.id}">
            <circle cx="20" cy="18" r="12"/>
          </clipPath>
        </defs>
        <!-- Pin body -->
        <path d="M20 0C11.716 0 5 6.716 5 15c0 8.284 15 35 15 35s15-26.716 15-35C35 6.716 28.284 0 20 0z" 
              fill="${color}" stroke="white" stroke-width="2"/>
        <!-- Avatar circle background -->
        <circle cx="20" cy="18" r="13" fill="white"/>
        <!-- Avatar image -->
        <image href="${specialist.avatar}" x="8" y="6" width="24" height="24" 
               clip-path="url(#circleClip-${specialist.id})" preserveAspectRatio="xMidYMid slice"/>
      </svg>
    `;
  }
}
