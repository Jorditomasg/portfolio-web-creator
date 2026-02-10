import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private http = inject(HttpClient);
  // Assuming environment.apiUrl exists, otherwise hardcode for now or use relative path if proxy
  private apiUrl = environment.apiUrl || 'http://localhost:3000/api';

  upload(file: File): Observable<{ path: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ path: string }>(`${this.apiUrl}/upload`, formData);
  }

  delete(path: string): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}/upload`, { body: { path } });
  }

  // Helper to get full URL for display
  getFullUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${this.apiUrl.replace('/api', '')}${path}`; 
  }
}
