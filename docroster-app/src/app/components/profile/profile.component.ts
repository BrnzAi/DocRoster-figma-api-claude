import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  // Mock user data
  user = {
    name: 'Dr. Sarah Johnson',
    avatar: 'assets/specialists/specialist-1.png',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    stats: {
      totalActivePins: 24,
      addedIn30Days: 8
    }
  };

  // Mock specialists list
  specialists = [
    {
      id: 1,
      name: 'Dr. Emily Carter',
      specialty: 'Physiatrist',
      schedule: 'Mon-Fri 9:00 AM - 5:00 PM',
      avatar: 'assets/specialists/specialist-2.png'
    },
    {
      id: 2,
      name: 'Dr. Michael Brown',
      specialty: 'Occupational Therapist',
      schedule: 'Mon, Wed, Fri 10:00 AM - 6:00 PM',
      avatar: 'assets/specialists/specialist-3.png'
    },
    {
      id: 3,
      name: 'Dr. Jennifer Davis',
      specialty: 'Physical Therapist',
      schedule: 'Tue-Thu 8:00 AM - 4:00 PM',
      avatar: 'assets/specialists/specialist-4.png'
    }
  ];

  constructor(private router: Router) {}

  close() {
    this.router.navigate(['/search']);
  }

  editProfile() {
    // TODO: Navigate to edit profile
    console.log('Edit profile');
  }

  logout() {
    // TODO: Implement logout
    this.router.navigate(['/auth/login']);
  }

  addSpecialist() {
    // TODO: Navigate to add specialist
    console.log('Add specialist');
  }

  editSpecialist(id: number) {
    console.log('Edit specialist', id);
  }

  deleteSpecialist(id: number) {
    console.log('Delete specialist', id);
  }
}
