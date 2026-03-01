import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type { NotificationResponse } from '../../models/types';

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  private readonly base = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<NotificationResponse[]> {
    return this.http.get<NotificationResponse[]>(`${this.base}/`);
  }

  getUnread(): Observable<NotificationResponse[]> {
    return this.http.get<NotificationResponse[]>(`${this.base}/non-lues`);
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.base}/count`);
  }

  markRead(id: number): Observable<unknown> {
    return this.http.put(`${this.base}/${id}/lire`, {});
  }

  markAllRead(): Observable<unknown> {
    return this.http.put(`${this.base}/tout-lire`, {});
  }
}
