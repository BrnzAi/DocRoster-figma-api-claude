import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecialistsService } from '../../services/specialists.service';
import { Specialist } from '../../models/specialist.model';

@Component({
  selector: 'app-specialist-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="specialist-details" *ngIf="specialist">
      <div class="header">
        <button class="back-btn" (click)="goBack()">← Back</button>
        <h1>{{ specialist.name }}</h1>
      </div>
      
      <div class="content">
        <div class="avatar-section">
          <img [src]="specialist.avatar" [alt]="specialist.name" class="avatar" />
          <div class="specialty-badge" [style.background]="specialist.specialty.color">
            {{ specialist.specialty.name }}
          </div>
        </div>

        <div class="info-section">
          <div class="rating">
            <span class="stars">★★★★★</span>
            <span class="rating-value">{{ specialist.rating }}</span>
            <span class="reviews">({{ specialist.reviewCount }} reviews)</span>
          </div>

          <p class="description">{{ specialist.description }}</p>

          <div class="details">
            <div class="detail-item">
              <strong>Experience:</strong> {{ specialist.experience }} years
            </div>
            <div class="detail-item">
              <strong>Languages:</strong> {{ specialist.languages.join(', ') }}
            </div>
            <div class="detail-item">
              <strong>Phone:</strong> {{ specialist.phone }}
            </div>
            <div class="detail-item">
              <strong>Address:</strong> {{ specialist.address }}
            </div>
          </div>

          <div class="certifications">
            <h3>Certifications</h3>
            <ul>
              <li *ngFor="let cert of specialist.certifications">{{ cert }}</li>
            </ul>
          </div>

          <button class="book-btn">Book Appointment</button>
        </div>
      </div>
    </div>

    <div class="loading" *ngIf="!specialist">
      Loading...
    </div>
  `,
  styles: [`
    .specialist-details {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;
      
      .back-btn {
        background: none;
        border: none;
        font-size: 16px;
        color: #3D7AFF;
        cursor: pointer;
        margin-bottom: 16px;
      }

      h1 {
        font-size: 32px;
        color: #0A1748;
        margin: 0;
      }
    }

    .content {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 48px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .avatar-section {
      text-align: center;

      .avatar {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        margin-bottom: 16px;
        object-fit: cover;
      }

      .specialty-badge {
        display: inline-block;
        padding: 8px 16px;
        border-radius: 20px;
        color: white;
        font-weight: 600;
      }
    }

    .info-section {
      .rating {
        margin-bottom: 16px;
        
        .stars {
          color: #FFB800;
          font-size: 20px;
        }

        .rating-value {
          font-weight: 600;
          margin-left: 8px;
        }

        .reviews {
          color: rgba(10, 23, 72, 0.6);
          margin-left: 8px;
        }
      }

      .description {
        font-size: 16px;
        line-height: 1.6;
        color: #0A1748;
        margin-bottom: 24px;
      }

      .details {
        background: #F8F9FA;
        padding: 24px;
        border-radius: 12px;
        margin-bottom: 24px;

        .detail-item {
          margin-bottom: 12px;
          
          &:last-child {
            margin-bottom: 0;
          }

          strong {
            color: #0A1748;
            margin-right: 8px;
          }
        }
      }

      .certifications {
        margin-bottom: 24px;

        h3 {
          font-size: 18px;
          margin-bottom: 12px;
          color: #0A1748;
        }

        ul {
          list-style: none;
          padding: 0;

          li {
            padding: 8px 0;
            border-bottom: 1px solid #E0E0E0;

            &:last-child {
              border-bottom: none;
            }
          }
        }
      }

      .book-btn {
        width: 100%;
        padding: 16px;
        background: linear-gradient(135deg, #3D7AFF 0%, #9121B1 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(61, 122, 255, 0.4);
        }
      }
    }

    .loading {
      text-align: center;
      padding: 48px;
      font-size: 18px;
      color: rgba(10, 23, 72, 0.6);
    }
  `]
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
        if (specialist) {
          this.specialist = specialist;
        } else {
          this.router.navigate(['/search']);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/search']);
  }
}
