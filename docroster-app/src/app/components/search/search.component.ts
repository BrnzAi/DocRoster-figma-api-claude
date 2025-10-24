import { Component, OnInit, ViewChild, ElementRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleMap, MapMarker, GoogleMapsModule } from '@angular/google-maps';
import { SpecialistsService } from '../../services/specialists.service';
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
  
  // Filter state
  sortBy: string | null = 'fee';
  feeFilter: string | null = null;
  genderFilter: string | null = 'any';
  locationFilter: string | null = null;
  typeFilter: string | null = null;
  
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
    private router: Router
  ) {}

  // Get data from services
  specialists = computed(() => this.specialistsService.filteredSpecialists());
  selectedSpecialist = computed(() => this.specialistsService.selectedSpecialist());
  
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
   * Handle search input change (real-time filtering)
   */
  onSearchInput(value: string): void {
    this.searchQuery.set(value);
    this.performSearch();
  }

  /**
   * Perform search with current query and filters
   */
  performSearch(): void {
    const query = this.searchQuery();
    
    // Build comprehensive filters
    const filters: SearchFilters = {
      specialty: this.selectedSpecialties().length > 0 ? this.selectedSpecialties() : undefined,
      sortBy: this.sortBy || undefined,
      feeRange: this.feeFilter || undefined,
      gender: this.genderFilter && this.genderFilter !== 'any' ? this.genderFilter : undefined,
      location: this.locationFilter || undefined,
      type: this.typeFilter || undefined
    };
    
    // Apply search with all filters
    if (query.trim()) {
      this.specialistsService.searchSpecialists(query).subscribe(() => {
        this.specialistsService.updateSearchFilters(filters);
      });
    } else {
      this.specialistsService.loadSpecialists().subscribe(() => {
        this.specialistsService.updateSearchFilters(filters);
      });
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
   * Apply all filters (called from Apply button in modal)
   */
  applyFilters(): void {
    this.showFilters.set(false);
    this.performSearch();
  }

  /**
   * Clear all filters (called from Reset button in modal)
   */
  clearFilters(): void {
    this.selectedSpecialties.set([]);
    this.sortBy = 'fee';
    this.feeFilter = null;
    this.genderFilter = 'any';
    this.locationFilter = null;
    this.typeFilter = null;
    this.searchQuery.set('');
    this.specialistsService.updateSearchFilters({});
    this.specialistsService.loadSpecialists().subscribe();
  }

  /**
   * Toggle location filter
   */
  toggleLocationFilter(location: string): void {
    this.locationFilter = this.locationFilter === location ? null : location;
  }

  /**
   * Toggle type filter
   */
  toggleTypeFilter(type: string): void {
    this.typeFilter = this.typeFilter === type ? null : type;
  }

  /**
   * Handle specialist selection from list
```
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
   * Logout user
   */
  logout(): void {
    // TODO: Implement logout when auth is integrated
    this.router.navigate(['/login']);
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
    // Get index of specialist in current list
    const index = this.specialists().findIndex(s => s.id === specialist.id) + 1;
    
    return {
      url: this.getMarkerImageUrl(specialist, index),
      scaledSize: new google.maps.Size(40, 52),
      anchor: new google.maps.Point(20, 52)
    };
  }

  /**
   * Generate marker image URL - proper map pin shape with number
   */
  private getMarkerImageUrl(specialist: Specialist, number: number): string {
    const color = specialist.specialty.color;
    const svg = `
      <svg width="40" height="52" viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
        <!-- Drop shadow -->
        <defs>
          <filter id="shadow-${number}" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Pin body - teardrop shape -->
        <path d="M20 0C11.716 0 5 6.716 5 15c0 8.284 15 35 15 35s15-26.716 15-35C35 6.716 28.284 0 20 0z" 
              fill="${color}" 
              stroke="white" 
              stroke-width="2"
              filter="url(#shadow-${number})"/>
        
        <!-- White circle for number -->
        <circle cx="20" cy="15" r="10" fill="white"/>
        
        <!-- Number text -->
        <text x="20" y="20" 
              font-family="SF Pro Text, Arial, sans-serif" 
              font-size="13" 
              font-weight="700" 
              fill="#0A1748" 
              text-anchor="middle">${number}</text>
      </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
}
