import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, finalize, map } from 'rxjs';
import { LoginResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = '/api';

  // Private state
  private _token = signal<string | null>(this.getStoredToken());
  private _user = signal<{ id: number; username: string; email: string } | null>(null);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Public read-only signals
  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  private getStoredToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('jwt_token');
    }
    return null;
  }

  login(username: string, password: string): Observable<boolean> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap(response => {
        this._token.set(response.access_token);
        this._user.set(response.user);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('jwt_token', response.access_token);
        }
      }),
      map(() => true),
      catchError((err: any) => {
        console.error('Login failed', err);
        this._error.set(err?.error?.message || 'Credenciales inválidas');
        return of(false);
      }),
      finalize(() => this._isLoading.set(false))
    );
  }

  logout(): void {
    this._token.set(null);
    this._user.set(null);
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/']);
  }

  getAuthHeaders(): { Authorization: string } | {} {
    const token = this._token();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
