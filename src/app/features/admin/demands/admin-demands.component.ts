import { Component, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminApiService } from '../../../core/services/api/admin-api.service';
import type { DemandeSangResponse, StatutDemande } from '../../../core/models/types';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { BloodTypeBadgeComponent } from '../../../shared/components/blood-type-badge/blood-type-badge.component';
import { bloodGroupLabel } from '../../../shared/utils/blood-type';

type FilterTab = 'all' | 'urgent' | 'encours';

@Component({
  selector: 'app-admin-demands',
  standalone: true,
  imports: [DatePipe, StatusBadgeComponent, BloodTypeBadgeComponent],
  templateUrl: './admin-demands.component.html',
})
export class AdminDemandsComponent implements OnInit {
  demandes = signal<DemandeSangResponse[]>([]);
  loading = signal(true);
  activeTab = signal<FilterTab>('all');

  constructor(private adminApi: AdminApiService) {}

  filteredDemandes = computed(() => {
    const list = this.demandes();
    const tab = this.activeTab();
    if (tab === 'urgent') return list.filter((d) => d.urgence === 'CRITIQUE' || d.urgence === 'HAUTE');
    if (tab === 'encours') return list.filter((d) => d.statut === 'EN_COURS' || d.statut === 'EN_ATTENTE');
    return list;
  });

  ngOnInit(): void {
    this.adminApi.getDemandes().subscribe({
      next: (list) => this.demandes.set(list),
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
    });
  }

  setTab(t: FilterTab): void {
    this.activeTab.set(t);
  }

  urgencyBorderClass(urgence: string): string {
    if (urgence === 'CRITIQUE') return 'border-l-red-500';
    if (urgence === 'HAUTE') return 'border-l-orange-500';
    return 'border-l-sky-500';
  }

  traiter(id: number, statut: StatutDemande): void {
    this.adminApi.traiterDemande(id, statut).subscribe({
      next: (updated) => {
        this.demandes.update((list) =>
          list.map((d) => (d.id === updated.id ? updated : d))
        );
      },
      error: () => {},
    });
  }

  bloodLabel = bloodGroupLabel;
}
