import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatbotApiService {
  private readonly base = `${environment.apiUrl}/chatbot`;

  constructor(private http: HttpClient) {}

  sendMessage(data: {
    message: string;
    sessionId?: string;
  }): Observable<{ reply: string; sessionId?: string }> {
    return this.http.post<{ reply: string; sessionId?: string }>(
      `${this.base}/message`,
      data
    );
  }

  getSuggestions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/suggestions`);
  }

  getHistorique(sessionId?: string): Observable<unknown[]> {
    const options = sessionId ? { params: { sessionId } } : {};
    return this.http.get<unknown[]>(`${this.base}/historique`, options);
  }

  clearHistorique(sessionId?: string): Observable<unknown> {
    const options = sessionId ? { params: { sessionId } } : {};
    return this.http.delete(`${this.base}/historique`, options);
  }

  getHealth(): Observable<unknown> {
    return this.http.get(`${this.base}/health`);
  }
}
