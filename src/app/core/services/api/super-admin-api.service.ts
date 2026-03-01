import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type {
  HopitalRequest,
  HopitalResponse,
  NotificationRequest,
  CampagneRequest,
  CampagneResponse,
} from '../../models/types';

@Injectable({ providedIn: 'root' })
export class SuperAdminApiService {
  private readonly base = `${environment.apiUrl}/superadmin`;

  constructor(private http: HttpClient) {}

  createHopital(data: HopitalRequest): Observable<HopitalResponse> {
    return this.http.post<HopitalResponse>(`${this.base}/hopitaux`, data);
  }

  getHopitaux(): Observable<HopitalResponse[]> {
    return this.http.get<HopitalResponse[]>(`${this.base}/hopitaux`);
  }

  getHopitauxEnAttente(): Observable<HopitalResponse[]> {
    return this.http.get<HopitalResponse[]>(`${this.base}/hopitaux/en-attente`);
  }

  validerHopital(id: number): Observable<HopitalResponse> {
    return this.http.put<HopitalResponse>(`${this.base}/hopitaux/${id}/valider`, {});
  }

  suspendreHopital(id: number): Observable<HopitalResponse> {
    return this.http.put<HopitalResponse>(`${this.base}/hopitaux/${id}/suspendre`, {});
  }

  getStats(): Observable<unknown> {
    return this.http.get<unknown>(`${this.base}/stats`);
  }

  getDashboard(): Observable<unknown> {
    return this.http.get<unknown>(`${this.base}/dashboard`);
  }

  sendGlobalNotification(data: NotificationRequest): Observable<unknown> {
    return this.http.post<unknown>(`${this.base}/notifications/globale`, data);
  }

  createNationalCampaign(data: CampagneRequest): Observable<CampagneResponse> {
    return this.http.post<CampagneResponse>(`${this.base}/campagnes`, data);
  }

  getNationalCampaigns(): Observable<CampagneResponse[]> {
    return this.http.get<CampagneResponse[]>(`${this.base}/campagnes/nationales`);
  }
}
