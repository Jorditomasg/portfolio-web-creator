import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private http = inject(HttpClient);
  private api = '/api/categories';

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.api);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.api}/${id}`);
  }

  create(data: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.api, data);
  }

  update(id: number, data: Partial<Category>): Observable<Category> {
    return this.http.patch<Category>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  swap(id1: number, id2: number): Observable<void> {
    return this.http.post<void>(`${this.api}/swap`, { id1, id2 });
  }
}
