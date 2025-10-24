export interface Specialist {
  id: string;
  name: string;
  email: string;
  avatar: string;
  specialty: Specialty;
  rating: number;
  reviewCount: number;
  location: Location;
  description: string;
  phone: string;
  address: string;
  fee: number; // consultation fee
  clinic: string; // clinic/practice name
  certifications: string[];
  experience: number; // years
  availability: Availability[];
  languages: string[];
}

export interface Specialty {
  id: string;
  name: string;
  category: string;
  color: string;
  icon: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  distance?: string; // e.g. "2.5 km away"
}

export interface Availability {
  dayOfWeek: number; // 0-6, Sunday=0
  startTime: string; // "09:00"
  endTime: string; // "17:00"
}

export interface SearchFilters {
  specialty?: string[];
  assessmentType?: string[];
  minRating?: number;
  maxDistance?: number; // in km
  availableNow?: boolean;
  languages?: string[];
  sortBy?: string; // 'fee', 'distance', 'availability'
  feeRange?: string; // 'low', 'medium', 'high'
  gender?: string; // 'male', 'female', 'any'
  location?: string; // city name
  type?: string; // 'hybrid', 'in-person', 'virtual'
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
