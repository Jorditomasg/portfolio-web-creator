import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Technology } from '../models/technology.model';

@Injectable({
  providedIn: 'root'
})
export class TechnologiesService {
  private http = inject(HttpClient);
  private apiUrl = '/api/technologies';

  getTechnologies() {
    return this.http.get<Technology[]>(this.apiUrl);
  }

  searchIcons(query: string) {
    return this.http.get<{name: string, icon: string}[]>(`${this.apiUrl}/search?q=${query}`);
  }

  createTechnology(tech: Partial<Technology>) {
    return this.http.post<Technology>(this.apiUrl, tech);
  }

  updateTechnology(id: number, tech: Partial<Technology>) {
    return this.http.put<Technology>(`${this.apiUrl}/${id}`, tech);
  }

  deleteTechnology(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
