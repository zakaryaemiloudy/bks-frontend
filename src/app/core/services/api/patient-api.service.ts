import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type {
  DemandeSangRequest,
  DemandeSangResponse,
  StockResponse,
} from '../../models/types';

@Injectable({ providedIn: 'root' })
export class PatientApiService {
  private readonly base = `${environment.apiUrl}/patient`;

  constructor(private http: HttpClient) {}

  createDemande(data: DemandeSangRequest): Observable<DemandeSangResponse> {
    return this.http.post<DemandeSangResponse>(`${this.base}/demandes`, data);
  }

  getDemandes(): Observable<DemandeSangResponse[]> {
    return this.http.get<DemandeSangResponse[]>(`${this.base}/demandes`);
  }

  getDemande(id: number): Observable<DemandeSangResponse> {
    return this.http.get<DemandeSangResponse>(`${this.base}/demandes/${id}`);
  }

  getStocks(hopitalId: number): Observable<StockResponse[]> {
    return this.http.get<StockResponse[]>(`${this.base}/stocks/${hopitalId}`);
  }
}
