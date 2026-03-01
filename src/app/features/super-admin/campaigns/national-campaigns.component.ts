import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SuperAdminApiService } from '../../../core/services/api/super-admin-api.service';
import type { CampagneResponse } from '../../../core/models/types';

@Component({
  selector: 'app-national-campaigns',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">Campagnes nationales</h2>
      </div>

      @if (error()) {
        <div class="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {{ error() }}
        </div>
      }

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Liste des campagnes -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-900">Campagnes existantes</h3>
            <p class="text-xs text-gray-500">{{ campagnes().length }} campagne(s)</p>
          </div>
          @if (loading()) {
            <p class="px-6 py-4 text-sm text-gray-500">Chargement des campagnes...</p>
          } @else {
            <ul class="divide-y divide-gray-200">
              @for (c of campagnes(); track c.id) {
                <li class="px-6 py-4">
                  <p class="text-sm font-medium text-gray-900">{{ c.titre }}</p>
                  <p class="text-xs text-gray-500">
                    {{ c.dateDebut | date:'shortDate' }} – {{ c.dateFin | date:'shortDate' }}
                    · {{ c.nationale ? 'Nationale' : 'Locale' }}
                  </p>
                </li>
              } @empty {
                <li class="px-6 py-6 text-sm text-gray-500 text-center">
                  Aucune campagne nationale.
                </li>
              }
            </ul>
          }
        </div>

        <!-- Création d'une campagne -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-sm font-medium text-gray-900 mb-4">Nouvelle campagne nationale</h3>
          <form [formGroup]="form" (ngSubmit)="createCampaign()" class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                formControlName="titre"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Date début</label>
                <input
                  type="date"
                  formControlName="dateDebut"
                  class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Date fin</label>
                <input
                  type="date"
                  formControlName="dateFin"
                  class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows="3"
                formControlName="description"
                class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              ></textarea>
            </div>
            <button
              type="submit"
              [disabled]="form.invalid || creating()"
              class="w-full mt-2 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ creating() ? 'Création...' : 'Créer la campagne' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class NationalCampaignsComponent implements OnInit {
  campagnes = signal<CampagneResponse[]>([]);
  loading = signal(true);
  creating = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    titre: ['', [Validators.required]],
    description: [''],
    dateDebut: ['', [Validators.required]],
    dateFin: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private superAdminApi: SuperAdminApiService
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
  }

  private loadCampaigns(): void {
    this.loading.set(true);
    this.superAdminApi.getNationalCampaigns().subscribe({
      next: (list) => {
        this.campagnes.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ??
            err?.message ??
            'Erreur lors du chargement des campagnes nationales.'
        );
      },
    });
  }

  createCampaign(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.creating.set(true);
    const raw = this.form.getRawValue();
    const payload = {
      titre: raw.titre,
      description: raw.description || undefined,
      dateDebut: raw.dateDebut,
      dateFin: raw.dateFin,
      nationale: true,
    };
    this.superAdminApi.createNationalCampaign(payload).subscribe({
      next: (created) => {
        this.campagnes.update((list) => [created, ...list]);
        this.form.reset();
        this.creating.set(false);
      },
      error: (err) => {
        this.creating.set(false);
        this.error.set(
          err?.error?.message ??
            err?.message ??
            'Erreur lors de la création de la campagne.'
        );
      },
    });
  }
}
