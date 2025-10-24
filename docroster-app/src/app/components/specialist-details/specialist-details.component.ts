import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecialistsService } from '../../services/specialists.service';
import { Specialist } from '../../models/specialist.model';

@Component({
  selector: 'app-specialist-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './specialist-details.component.html',
  styleUrl: './specialist-details.component.scss'
})
export class SpecialistDetailsComponent implements OnInit {
  specialist: Specialist | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private specialistsService: SpecialistsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.specialistsService.getSpecialistById(id).subscribe(specialist => {
        this.specialist = specialist || null;
      });
    }
  }

  /**
   * Close and return to search page
   */
  close(): void {
    this.router.navigate(['/search']);
  }

  /**
   * Call specialist
   */
  callNow(): void {
    if (this.specialist?.phone) {
      window.location.href = `tel:${this.specialist.phone}`;
    }
  }

  /**
   * Navigate to specialist location
   */
  navigate(): void {
    if (this.specialist?.location) {
      const { lat, lng } = this.specialist.location;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    }
  }

  /**
   * Get star array for rating display
   */
  getStarArray(rating: number): boolean[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating));
  }
}
