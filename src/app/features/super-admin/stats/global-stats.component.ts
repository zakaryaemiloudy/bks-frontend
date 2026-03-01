import { Component, OnInit, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { SuperAdminApiService } from '../../../core/services/api/super-admin-api.service';

@Component({
  selector: 'app-global-stats',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-900">Statistiques globales</h2>

      @if (loading()) {
        <p class="text-gray-500">Chargement des statistiques...</p>
      } @else if (error()) {
        <div class="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {{ error() }}
        </div>
      } @else if (stats(); as s) {
        <!-- For now we just render the JSON the backend sends. You can refine when you know its exact shape. -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-xs text-gray-800">
          <pre class="whitespace-pre-wrap break-all">{{ s | json }}</pre>
        </div>
      }
    </div>
  `,
})
export class GlobalStatsComponent implements OnInit {
  loading = signal(true);
  error = signal<string | null>(null);
  stats = signal<unknown | null>(null);

  constructor(private superAdminApi: SuperAdminApiService) {}

  ngOnInit(): void {
    this.superAdminApi.getStats().subscribe({
      next: (s) => {
        this.stats.set(s);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ?? err?.message ?? 'Erreur lors du chargement des statistiques.'
        );
      },
    });
  }
}
