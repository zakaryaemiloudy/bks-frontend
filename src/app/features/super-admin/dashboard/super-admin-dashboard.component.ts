import { Component, OnInit, signal } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { SuperAdminApiService } from '../../../core/services/api/super-admin-api.service';
import { NotificationApiService } from '../../../core/services/api/notification-api.service';
import type { HopitalResponse, CampagneResponse, NotificationResponse } from '../../../core/models/types';

interface SuperAdminDashboardData {
  hopitaux: HopitalResponse[];
  hopitauxEnAttente: HopitalResponse[];
  campagnesNationales: CampagneResponse[];
  notificationsRecents: NotificationResponse[];
  brutDashboard: unknown;
  brutStats: unknown;
}

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [DatePipe, JsonPipe],
  template: `
    <div class="space-y-6">
      <h2 class="text-xl font-semibold text-gray-900">Tableau de bord Super Admin</h2>

      @if (loading()) {
        <p class="text-gray-500">Chargement du tableau de bord...</p>
      } @else if (error()) {
        <div class="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {{ error() }}
        </div>
      } @else if (data(); as d) {
        <!-- Stat cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-3xl text-red-600">local_hospital</span>
              <div>
                <p class="text-sm text-gray-500">Hôpitaux</p>
                <p class="text-2xl font-semibold text-gray-900">{{ d.hopitaux.length }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-3xl text-orange-600">hourglass_top</span>
              <div>
                <p class="text-sm text-gray-500">En attente</p>
                <p class="text-2xl font-semibold text-gray-900">{{ d.hopitauxEnAttente.length }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-3xl text-blue-600">campaign</span>
              <div>
                <p class="text-sm text-gray-500">Campagnes nationales</p>
                <p class="text-2xl font-semibold text-gray-900">{{ d.campagnesNationales.length }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-3xl text-emerald-600">notifications</span>
              <div>
                <p class="text-sm text-gray-500">Notifications récentes</p>
                <p class="text-2xl font-semibold text-gray-900">{{ d.notificationsRecents.length }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent national campaigns -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-sm font-medium text-gray-900">Campagnes nationales</h3>
            </div>
            <ul class="divide-y divide-gray-200">
              @for (c of d.campagnesNationales; track c.id) {
                <li class="px-6 py-3">
                  <p class="text-sm font-medium text-gray-900">{{ c.titre }}</p>
                  <p class="text-xs text-gray-500">
                    {{ c.dateDebut | date:'shortDate' }} – {{ c.dateFin | date:'shortDate' }}
                  </p>
                </li>
              } @empty {
                <li class="px-6 py-4 text-sm text-gray-500">Aucune campagne nationale.</li>
              }
            </ul>
          </div>

          <!-- Raw stats/dash JSON preview so you can see what backend sends -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-sm font-medium text-gray-900">Données brutes (dashboard / stats)</h3>
              <p class="text-xs text-gray-500">
                Utiliser ceci pour affiner le design plus tard.
              </p>
            </div>
            <div class="max-h-72 overflow-auto text-xs text-gray-700 px-4 py-3 bg-gray-50">
              <pre class="whitespace-pre-wrap break-all">{{ d.brutDashboard | json }}</pre>
              <pre class="whitespace-pre-wrap break-all mt-2">{{ d.brutStats | json }}</pre>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class SuperAdminDashboardComponent implements OnInit {
  loading = signal(true);
  error = signal<string | null>(null);
  data = signal<SuperAdminDashboardData | null>(null);

  constructor(
    private superAdminApi: SuperAdminApiService,
    private notificationApi: NotificationApiService
  ) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.error.set(null);

    // Fetch in parallel
    this.superAdminApi.getHopitaux().subscribe({
      next: (hopitaux) => {
        this.superAdminApi.getHopitauxEnAttente().subscribe({
          next: (enAttente) => {
            this.superAdminApi.getNationalCampaigns().subscribe({
              next: (campagnes) => {
                this.notificationApi.getAll().subscribe({
                  next: (notifications) => {
                    this.superAdminApi.getDashboard().subscribe({
                      next: (dash) => {
                        this.superAdminApi.getStats().subscribe({
                          next: (stats) => {
                            this.data.set({
                              hopitaux,
                              hopitauxEnAttente: enAttente,
                              campagnesNationales: campagnes,
                              notificationsRecents: notifications.slice(0, 5),
                              brutDashboard: dash,
                              brutStats: stats,
                            });
                            this.loading.set(false);
                          },
                          error: (err) => this.handleError(err),
                        });
                      },
                      error: (err) => this.handleError(err),
                    });
                  },
                  error: (err) => this.handleError(err),
                });
              },
              error: (err) => this.handleError(err),
            });
          },
          error: (err) => this.handleError(err),
        });
      },
      error: (err) => this.handleError(err),
    });
  }

  private handleError(err: unknown): void {
    this.loading.set(false);
    this.error.set(
      (err as any)?.error?.message ??
        (err as any)?.message ??
        'Erreur lors du chargement du tableau de bord.'
    );
  }
}
