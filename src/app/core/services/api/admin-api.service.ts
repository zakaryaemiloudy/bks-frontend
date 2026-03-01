import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type {
  DashboardAnalytics,
  DonResponse,
  DemandeSangResponse,
  StockResponse,
  DonneurResponse,
  CampagneRequest,
  CampagneResponse,
  StatutDemande,
} from '../../models/types';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DashboardAnalytics> {
    return this.http.get<DashboardAnalytics>(`${this.base}/dashboard`);
  }

  getDons(): Observable<DonResponse[]> {
    return this.http.get<DonResponse[]>(`${this.base}/dons`);
  }

  validerDon(id: number): Observable<DonResponse> {
    return this.http.put<DonResponse>(`${this.base}/dons/${id}/valider`, {});
  }

  rejeterDon(id: number, raison: string): Observable<DonResponse> {
    return this.http.put<DonResponse>(`${this.base}/dons/${id}/rejeter`, raison, {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  getDemandes(): Observable<DemandeSangResponse[]> {
    return this.http.get<DemandeSangResponse[]>(`${this.base}/demandes`);
  }

  getDemandesUrgentes(): Observable<DemandeSangResponse[]> {
    return this.http.get<DemandeSangResponse[]>(`${this.base}/demandes/urgentes`);
  }

  traiterDemande(id: number, statut: StatutDemande): Observable<DemandeSangResponse> {
    return this.http.put<DemandeSangResponse>(
      `${this.base}/demandes/${id}/traiter`,
      {},
      { params: { statut } }
    );
  }

  getStocks(): Observable<StockResponse[]> {
    return this.http.get<StockResponse[]>(`${this.base}/stocks`);
  }

  getStocksCritiques(): Observable<StockResponse[]> {
    return this.http.get<StockResponse[]>(`${this.base}/stocks/critiques`);
  }

  getDonneurs(): Observable<DonneurResponse[]> {
    return this.http.get<DonneurResponse[]>(`${this.base}/donneurs`);
  }

  getTopDonneurs(): Observable<DonneurResponse[]> {
    return this.http.get<DonneurResponse[]>(`${this.base}/donneurs/top`);
  }

  createCampagne(data: CampagneRequest): Observable<CampagneResponse> {
    return this.http.post<CampagneResponse>(`${this.base}/campagnes`, data);
  }

  getCampagnesActives(): Observable<CampagneResponse[]> {
    return this.http.get<CampagneResponse[]>(`${this.base}/campagnes/actives`);
  }
}
