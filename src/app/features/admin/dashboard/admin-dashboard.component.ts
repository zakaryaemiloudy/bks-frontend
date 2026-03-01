import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../../../core/services/api/admin-api.service';
import type { DashboardAnalytics, DonResponse, DemandeSangResponse } from '../../../core/models/types';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { BloodTypeBadgeComponent } from '../../../shared/components/blood-type-badge/blood-type-badge.component';
import { bloodGroupLabel } from '../../../shared/utils/blood-type';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink, StatusBadgeComponent, BloodTypeBadgeComponent],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  analytics = signal<DashboardAnalytics | null>(null);
  recentDons = signal<DonResponse[]>([]);
  demandesUrgentes = signal<DemandeSangResponse[]>([]);
  loading = signal(true);

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.adminApi.getDashboard().subscribe({
      next: (data) => this.analytics.set(data),
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });
    this.adminApi.getDons().subscribe({
      next: (list) => this.recentDons.set(list.slice(0, 5)),
      error: () => {},
    });
    this.adminApi.getDemandesUrgentes().subscribe({
      next: (list) => this.demandesUrgentes.set(list),
      error: () => {},
    });
  }

  bloodLabel = bloodGroupLabel;

  urgencyBorderClass(urgence: string): string {
    if (urgence === 'CRITIQUE') return 'border-l-red-500';
    if (urgence === 'HAUTE') return 'border-l-orange-500';
    return 'border-l-sky-500';
  }
}
