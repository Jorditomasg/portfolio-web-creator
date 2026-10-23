import { Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-paper flex items-center justify-center px-6">
      <div class="w-full max-w-md">
        <div class="bg-surface rounded-lg border border-line p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-2xl font-semibold tracking-tight mb-1 text-ink">Sign in</h1>
            <p class="text-ink-muted">Admin panel</p>
          </div>

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="username" class="block text-sm font-medium text-ink-soft mb-2">Username</label>
              <input 
                type="text" 
                id="username" 
                [(ngModel)]="credentials.username" 
                name="username"
                required
                autocomplete="username"
                class="w-full px-4 py-3 bg-paper border border-line rounded-lg focus:border-ink focus:ring-1 focus:ring-ink/20 outline-none transition-colors text-ink placeholder:text-ink-muted/60"
                placeholder="admin">
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-ink-soft mb-2">Password</label>
              <input 
                type="password" 
                id="password" 
                [(ngModel)]="credentials.password" 
                name="password"
                required
                autocomplete="current-password"
                class="w-full px-4 py-3 bg-paper border border-line rounded-lg focus:border-ink focus:ring-1 focus:ring-ink/20 outline-none transition-colors text-ink placeholder:text-ink-muted/60"
                placeholder="••••••••">
            </div>

            @if (authService.error()) {
              <div class="p-4 bg-red-500/20 text-red-600 rounded-lg text-sm text-center">
                {{ authService.error() }}
              </div>
            }

            <button 
              type="submit" 
              [disabled]="authService.isLoading()"
              class="w-full min-h-[48px] bg-ink hover:bg-ink-soft disabled:opacity-50 disabled:cursor-not-allowed text-paper font-medium rounded-full transition-all">
              @if (authService.isLoading()) {
                Signing in...
              } @else {
                Sign In
              }
            </button>
          </form>

          <!-- Back link -->
          <div class="mt-6 text-center">
            <a href="/" class="text-ink-muted hover:text-ink text-sm transition-colors">
              ← Back to portfolio
            </a>
          </div>
        </div>

        <!-- Footer -->
        <p class="mt-8 text-center text-ink-muted text-sm">
          &copy; {{ currentYear }} Portfolio. All rights reserved.
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
