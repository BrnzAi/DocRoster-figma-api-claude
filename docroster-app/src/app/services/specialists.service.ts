import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import { Specialist, Specialty, SearchFilters, MapBounds } from '../models/specialist.model';

@Injectable({
  providedIn: 'root'
})
export class SpecialistsService {
  private specialistsSignal = signal<Specialist[]>([]);
  private selectedSpecialistSignal = signal<Specialist | null>(null);
  private searchFiltersSignal = signal<SearchFilters>({});
  private mapBoundsSignal = signal<MapBounds | null>(null);

  public specialists = computed(() => this.specialistsSignal());
  public selectedSpecialist = computed(() => this.selectedSpecialistSignal());
  public searchFilters = computed(() => this.searchFiltersSignal());
  public mapBounds = computed(() => this.mapBoundsSignal());

  // Filtered specialists based on search criteria and map bounds
  public filteredSpecialists = computed(() => {
    let specialists = this.specialistsSignal();
    const filters = this.searchFiltersSignal();
    const bounds = this.mapBoundsSignal();

    // Apply specialty filters
    if (filters.specialty && filters.specialty.length > 0) {
      specialists = specialists.filter(s => 
        filters.specialty!.includes(s.specialty.id)
      );
    }

    // Apply fee range filter
    if (filters.feeRange) {
      specialists = specialists.filter(s => {
        if (filters.feeRange === 'low') return s.fee < 200;
        if (filters.feeRange === 'medium') return s.fee >= 200 && s.fee <= 300;
        if (filters.feeRange === 'high') return s.fee > 300;
        return true;
      });
    }

    // Apply gender filter
    if (filters.gender && filters.gender !== 'any') {
      // Note: We would need a gender field in Specialist model to filter by gender
      // For now, we'll just acknowledge the filter exists
    }

    // Apply location filter
    if (filters.location) {
      const locationMap: { [key: string]: string } = {
        'belleville': 'belleville',
        'sault': 'sault ste. marie',
        'thunder': 'thunder bay',
        'vancouver': 'vancouver'
      };
      const targetCity = locationMap[filters.location.toLowerCase()] || filters.location.toLowerCase();
      specialists = specialists.filter(s => 
        s.location.city.toLowerCase().includes(targetCity)
      );
    }

    // Apply type filter (hybrid/in-person/virtual)
    if (filters.type) {
      // Note: We would need a consultationType field in Specialist model
      // For now, we'll just acknowledge the filter exists
    }

    // Apply rating filter
    if (filters.minRating !== undefined) {
      specialists = specialists.filter(s => s.rating >= filters.minRating!);
    }

    // Apply language filter
    if (filters.languages && filters.languages.length > 0) {
      specialists = specialists.filter(s =>
        filters.languages!.some(lang => s.languages.includes(lang))
      );
    }

    // Apply map bounds filter
    if (bounds) {
      specialists = specialists.filter(s =>
        s.location.lat >= bounds.south &&
        s.location.lat <= bounds.north &&
        s.location.lng >= bounds.west &&
        s.location.lng <= bounds.east
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      specialists = [...specialists].sort((a, b) => {
        if (filters.sortBy === 'fee') return a.fee - b.fee;
        if (filters.sortBy === 'availability') return b.rating - a.rating; // Placeholder
        if (filters.sortBy === 'distance') return 0; // Would need distance calculation
        return 0;
      });
    }

    return specialists;
  });

  // Mock specialties based on Figma design
  private mockSpecialties: Specialty[] = [
    {
      id: 'pediatrics',
      name: 'Pediatrics',
      category: 'Medical',
      color: '#3D7AFF',
      icon: 'hospital'
    },
    {
      id: 'laboratory',
      name: 'Laboratory Diagnostics',
      category: 'Medical',
      color: '#3D7AFF',
      icon: 'science'
    },
    {
      id: 'law',
      name: 'Legal Services',
      category: 'Legal',
      color: '#FF3D96',
      icon: 'gavel'
    },
    {
      id: 'mental-health',
      name: 'Mental Health',
      category: 'Medical',
      color: '#9121B1',
      icon: 'psychology'
    },
    {
      id: 'cardiology',
      name: 'Cardiology',
      category: 'Medical',
      color: '#FF6B6B',
      icon: 'favorite'
    },
    {
      id: 'dermatology',
      name: 'Dermatology',
      category: 'Medical',
      color: '#4ECDC4',
      icon: 'face'
    }
  ];

  // Mock specialists data
  private mockSpecialists: Specialist[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@docroster.com',
      avatar: 'https://i.pravatar.cc/150?img=5',
      specialty: this.mockSpecialties[0], // Pediatrics
      rating: 4.8,
      reviewCount: 245,
      fee: 175,
      clinic: 'Health Advancement Center',
      location: {
        lat: 49.2827,
        lng: -123.1207,
        address: 'Sunny Path Community Center, 123 Sunshine Ave, 90210',
        city: 'Vancouver',
        state: 'BC',
        zipCode: 'V6B 2W9'
      },
      description: 'Board-certified pediatrician with over 15 years of experience in child healthcare.',
      phone: '+1 (604) 555-0123',
      address: '1234 Main St, Vancouver, BC V6B 2W9',
      certifications: ['Board Certified Pediatrics', 'Advanced Life Support'],
      experience: 15,
      availability: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 5, startTime: '09:00', endTime: '15:00' }
      ],
      languages: ['English', 'French']
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@docroster.com',
      avatar: 'https://i.pravatar.cc/150?img=12',
      specialty: this.mockSpecialties[1], // Laboratory
      rating: 4.9,
      reviewCount: 189,
      fee: 200,
      clinic: 'Vancouver Diagnostic Lab',
      location: {
        lat: 49.2847,
        lng: -123.1147,
        address: '5678 Oak St',
        city: 'Vancouver',
        state: 'BC',
        zipCode: 'V6H 2M9'
      },
      description: 'Experienced laboratory diagnostics specialist focusing on advanced testing methods.',
      phone: '+1 (604) 555-0124',
      address: '5678 Oak St, Vancouver, BC V6H 2M9',
      certifications: ['Clinical Laboratory Scientist', 'Molecular Diagnostics'],
      experience: 12,
      availability: [
        { dayOfWeek: 1, startTime: '08:00', endTime: '18:00' },
        { dayOfWeek: 2, startTime: '08:00', endTime: '18:00' },
        { dayOfWeek: 3, startTime: '08:00', endTime: '18:00' },
        { dayOfWeek: 4, startTime: '08:00', endTime: '18:00' },
        { dayOfWeek: 5, startTime: '08:00', endTime: '16:00' }
      ],
      languages: ['English', 'Mandarin', 'Cantonese']
    },
    {
      id: '3',
      name: 'Jennifer Martinez',
      email: 'jennifer.martinez@docroster.com',
      avatar: 'https://i.pravatar.cc/150?img=9',
      specialty: this.mockSpecialties[2], // Law
      rating: 4.7,
      reviewCount: 321,
      fee: 300,
      clinic: 'Martinez Law Offices',
      location: {
        lat: 49.2657,
        lng: -123.1387,
        address: '9012 Elm Ave',
        city: 'Vancouver',
        state: 'BC',
        zipCode: 'V6K 1X8'
      },
      description: 'Dedicated attorney specializing in family law and estate planning.',
      phone: '+1 (604) 555-0125',
      address: '9012 Elm Ave, Vancouver, BC V6K 1X8',
      certifications: ['Licensed Attorney', 'Mediation Certified'],
      experience: 18,
      availability: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }
      ],
      languages: ['English', 'Spanish']
    },
    {
      id: '4',
      name: 'Dr. David Kim',
      email: 'david.kim@docroster.com',
      avatar: 'https://i.pravatar.cc/150?img=14',
      specialty: this.mockSpecialties[3], // Mental Health
      rating: 4.9,
      reviewCount: 412,
      fee: 250,
      clinic: 'Mindful Wellness Center',
      location: {
        lat: 49.2777,
        lng: -123.1047,
        address: '3456 Pine St',
        city: 'Vancouver',
        state: 'BC',
        zipCode: 'V6J 3G8'
      },
      description: 'Clinical psychologist specializing in anxiety, depression, and trauma therapy.',
      phone: '+1 (604) 555-0126',
      address: '3456 Pine St, Vancouver, BC V6J 3G8',
      certifications: ['Licensed Psychologist', 'CBT Certified', 'EMDR Trained'],
      experience: 20,
      availability: [
        { dayOfWeek: 1, startTime: '10:00', endTime: '19:00' },
        { dayOfWeek: 2, startTime: '10:00', endTime: '19:00' },
        { dayOfWeek: 3, startTime: '10:00', endTime: '19:00' },
        { dayOfWeek: 4, startTime: '10:00', endTime: '19:00' },
        { dayOfWeek: 5, startTime: '10:00', endTime: '17:00' }
      ],
      languages: ['English', 'Korean']
    },
    {
      id: '5',
      name: 'Dr. Emily Wilson',
      email: 'emily.wilson@docroster.com',
      avatar: 'https://i.pravatar.cc/150?img=10',
      specialty: this.mockSpecialties[4], // Cardiology
      rating: 4.8,
      reviewCount: 305,
      fee: 350,
      clinic: 'Vancouver Heart Institute',
      location: {
        lat: 49.2897,
        lng: -123.1307,
        address: '7890 Cedar Blvd',
        city: 'Vancouver',
        state: 'BC',
        zipCode: 'V6T 1Z4'
      },
      description: 'Interventional cardiologist with expertise in heart disease prevention and treatment.',
      phone: '+1 (604) 555-0127',
      address: '7890 Cedar Blvd, Vancouver, BC V6T 1Z4',
      certifications: ['Board Certified Cardiology', 'Interventional Cardiology'],
      experience: 14,
      availability: [
        { dayOfWeek: 1, startTime: '08:00', endTime: '17:00' },
        { dayOfWeek: 2, startTime: '08:00', endTime: '17:00' },
        { dayOfWeek: 3, startTime: '08:00', endTime: '17:00' },
        { dayOfWeek: 4, startTime: '08:00', endTime: '17:00' },
        { dayOfWeek: 5, startTime: '08:00', endTime: '15:00' }
      ],
      languages: ['English']
    },
    {
      id: '6',
      name: 'Dr. Amanda Brown',
      email: 'amanda.brown@docroster.com',
      avatar: 'https://i.pravatar.cc/150?img=20',
      specialty: this.mockSpecialties[5], // Dermatology
      rating: 4.6,
      reviewCount: 198,
      fee: 225,
      clinic: 'Skin Health Clinic',
      location: {
        lat: 49.2707,
        lng: -123.1197,
        address: '2468 Maple Dr',
        city: 'Vancouver',
        state: 'BC',
        zipCode: 'V5K 4Y2'
      },
      description: 'Dermatologist specializing in cosmetic procedures and skin health.',
      phone: '+1 (604) 555-0128',
      address: '2468 Maple Dr, Vancouver, BC V5K 4Y2',
      certifications: ['Board Certified Dermatology', 'Cosmetic Dermatology'],
      experience: 11,
      availability: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 5, startTime: '09:00', endTime: '16:00' }
      ],
      languages: ['English', 'French']
    },
    {
      id: '7',
      name: 'Thomas Anderson',
      email: 'thomas.anderson@docroster.com',
      avatar: 'https://i.pravatar.cc/150?img=15',
      specialty: this.mockSpecialties[2], // Law
      rating: 4.7,
      reviewCount: 267,
      fee: 275,
      clinic: 'Anderson Legal Group',
      location: {
        lat: 49.2617,
        lng: -123.1137,
        address: '1357 Birch Ln',
        city: 'Vancouver',
        state: 'BC',
        zipCode: 'V6P 6G5'
      },
      description: 'Corporate attorney with focus on business law and contracts.',
      phone: '+1 (604) 555-0129',
      address: '1357 Birch Ln, Vancouver, BC V6P 6G5',
      certifications: ['Licensed Attorney', 'Corporate Law Specialist'],
      experience: 16,
      availability: [
        { dayOfWeek: 1, startTime: '08:30', endTime: '17:30' },
        { dayOfWeek: 2, startTime: '08:30', endTime: '17:30' },
        { dayOfWeek: 3, startTime: '08:30', endTime: '17:30' },
        { dayOfWeek: 4, startTime: '08:30', endTime: '17:30' },
        { dayOfWeek: 5, startTime: '08:30', endTime: '16:30' }
      ],
      languages: ['English']
    },
    {
      id: '8',
      name: 'Dr. Lisa Taylor',
      email: 'lisa.taylor@docroster.com',
      avatar: 'https://i.pravatar.cc/150?img=16',
      specialty: this.mockSpecialties[0], // Pediatrics
      rating: 4.9,
      reviewCount: 278,
      fee: 175,
      clinic: 'Children First Medical Center',
      location: {
        lat: 49.2937,
        lng: -123.1437,
        address: '8642 Willow Way',
        city: 'Vancouver',
        state: 'BC',
        zipCode: 'V6R 2B4'
      },
      description: 'Pediatrician with special interest in developmental disorders and autism spectrum.',
      phone: '+1 (604) 555-0130',
      address: '8642 Willow Way, Vancouver, BC V6R 2B4',
      certifications: ['Board Certified Pediatrics', 'Developmental Pediatrics'],
      experience: 22,
      availability: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }
      ],
      languages: ['English', 'German']
    }
  ];

  constructor() {
    this.loadMockData();
  }

  /**
   * Load specialists (in real app, this would fetch from API)
   */
  loadSpecialists(): Observable<Specialist[]> {
    return of(this.mockSpecialists).pipe(
      delay(300),
      map(specialists => {
        this.specialistsSignal.set(specialists);
        return specialists;
      })
    );
  }

  /**
   * Get specialist by ID
   */
  getSpecialistById(id: string): Observable<Specialist | undefined> {
    return of(this.mockSpecialists.find(s => s.id === id)).pipe(delay(100));
  }

  /**
   * Set selected specialist
   */
  selectSpecialist(specialist: Specialist | null): void {
    this.selectedSpecialistSignal.set(specialist);
  }

  /**
   * Update search filters
   */
  updateSearchFilters(filters: SearchFilters): void {
    this.searchFiltersSignal.set(filters);
  }

  /**
   * Update map bounds
   */
  updateMapBounds(bounds: MapBounds): void {
    this.mapBoundsSignal.set(bounds);
  }

  /**
   * Get all specialties
   */
  getSpecialties(): Specialty[] {
    return this.mockSpecialties;
  }

  /**
   * Search specialists by query
   */
  searchSpecialists(query: string): Observable<Specialist[]> {
    const lowerQuery = query.toLowerCase();
    const filtered = this.mockSpecialists.filter(s =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.specialty.name.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery) ||
      s.clinic.toLowerCase().includes(lowerQuery) ||
      s.location.city.toLowerCase().includes(lowerQuery)
    );
    
    return of(filtered).pipe(
      delay(200),
      map(specialists => {
        this.specialistsSignal.set(specialists);
        return specialists;
      })
    );
  }

  private loadMockData(): void {
    this.specialistsSignal.set(this.mockSpecialists);
  }
}
