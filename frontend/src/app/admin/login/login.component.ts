import { Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-dark-bg flex items-center justify-center px-6">
      <div class="w-full max-w-md">
        <div class="bg-dark-surface rounded-2xl border border-dark-border p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold mb-2 text-white">Panel de Administración</h1>
            <p class="text-gray-400">Inicia sesión para continuar</p>
          </div>

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="username" class="block text-sm font-medium text-gray-300 mb-2">Usuario</label>
              <input 
                type="text" 
                id="username" 
                [(ngModel)]="credentials.username" 
                name="username"
                required
                autocomplete="username"
                class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-white placeholder-gray-500"
                placeholder="admin">
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
              <input 
                type="password" 
                id="password" 
                [(ngModel)]="credentials.password" 
                name="password"
                required
                autocomplete="current-password"
                class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-white placeholder-gray-500"
                placeholder="••••••••">
            </div>

            @if (authService.error()) {
              <div class="p-4 bg-red-500/20 text-red-400 rounded-lg text-sm text-center">
                {{ authService.error() }}
              </div>
            }

            <button 
              type="submit" 
              [disabled]="authService.isLoading()"
              class="w-full py-4 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all">
              @if (authService.isLoading()) {
                Iniciando sesión...
              } @else {
                Iniciar Sesión
              }
            </button>
          </form>

          <!-- Back link -->
          <div class="mt-6 text-center">
            <a href="/" class="text-gray-400 hover:text-primary text-sm transition-colors">
              ← Volver al portfolio
            </a>
          </div>
        </div>

        <!-- Footer -->
        <p class="mt-8 text-center text-gray-600 text-sm">
          &copy; {{ currentYear }} Portfolio. Todos los derechos reservados.
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  currentYear = new Date().getFullYear();

  credentials = {
    username: '',
    password: '',
  };

  onSubmit() {
    this.authService.login(
      this.credentials.username,
      this.credentials.password
    ).subscribe(success => {
      if (success) {
        this.router.navigate(['/admin/dashboard']);
      }
    });
  }
}
