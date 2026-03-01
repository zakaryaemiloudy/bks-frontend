import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type {
  DonneurProfileRequest,
  DonRequest,
  DonResponse,
  BadgeResponse,
  CampagneResponse,
} from '../../models/types';

@Injectable({ providedIn: 'root' })
export class DonorApiService {
  private readonly base = `${environment.apiUrl}/donneur`;

  constructor(private http: HttpClient) {}

  createProfile(data: DonneurProfileRequest): Observable<unknown> {
    return this.http.post(`${this.base}/profil`, data);
  }

  getProfile(): Observable<unknown> {
    return this.http.get(`${this.base}/profil`);
  }

  declarerDon(data: DonRequest): Observable<DonResponse> {
    return this.http.post<DonResponse>(`${this.base}/dons`, data);
  }

  getHistorique(): Observable<DonResponse[]> {
    return this.http.get<DonResponse[]>(`${this.base}/dons/historique`);
  }

  getBadges(): Observable<BadgeResponse[]> {
    return this.http.get<BadgeResponse[]>(`${this.base}/badges`);
  }

  getPoints(): Observable<{ points: number }> {
    return this.http.get<{ points: number }>(`${this.base}/points`);
  }

  getClassement(): Observable<Array<{ nom: string; prenom: string; groupeSanguin: string; pointsTotal: number; rang: number }>> {
    return this.http.get<Array<{ nom: string; prenom: string; groupeSanguin: string; pointsTotal: number; rang: number }>>(
      `${this.base}/classement`
    );
  }

  getCampagnes(): Observable<CampagneResponse[]> {
    return this.http.get<CampagneResponse[]>(`${this.base}/campagnes`);
  }

  participerCampagne(id: number): Observable<unknown> {
    return this.http.post(`${this.base}/campagnes/${id}/participer`, {});
  }
}
