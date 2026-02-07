import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastContainerComponent } from '../../shared/components/toast-container.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
  template: `
    <div class="min-h-screen bg-dark-bg flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-dark-surface border-r border-dark-border flex flex-col">
        <!-- Logo -->
        <div class="p-6 border-b border-dark-border">
          <h1 class="text-xl font-bold text-primary">Admin Panel</h1>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4">
          <ul class="space-y-2">
            <li>
              <a routerLink="/admin/dashboard" routerLinkActive="bg-primary/20 text-primary border-primary"
                 class="flex items-center gap-3 px-4 py-3 rounded-lg border border-transparent text-gray-300 hover:bg-dark-border hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/projects" routerLinkActive="bg-primary/20 text-primary border-primary"
                 class="flex items-center gap-3 px-4 py-3 rounded-lg border border-transparent text-gray-300 hover:bg-dark-border hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                <span>Proyectos</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/skills" routerLinkActive="bg-primary/20 text-primary border-primary"
                 class="flex items-center gap-3 px-4 py-3 rounded-lg border border-transparent text-gray-300 hover:bg-dark-border hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                <span>Habilidades</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/specialties" routerLinkActive="bg-primary/20 text-primary border-primary"
                 class="flex items-center gap-3 px-4 py-3 rounded-lg border border-transparent text-gray-300 hover:bg-dark-border hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                </svg>
                <span>Especialidades</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/about" routerLinkActive="bg-primary/20 text-primary border-primary"
                 class="flex items-center gap-3 px-4 py-3 rounded-lg border border-transparent text-gray-300 hover:bg-dark-border hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span>Sobre Mí</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/experience" routerLinkActive="bg-primary/20 text-primary border-primary"
                 class="flex items-center gap-3 px-4 py-3 rounded-lg border border-transparent text-gray-300 hover:bg-dark-border hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>Experiencia</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/settings" routerLinkActive="bg-primary/20 text-primary border-primary"
                 class="flex items-center gap-3 px-4 py-3 rounded-lg border border-transparent text-gray-300 hover:bg-dark-border hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>Configuración</span>
              </a>
            </li>
          </ul>
        </nav>

        <!-- Bottom actions -->
        <div class="p-4 border-t border-dark-border space-y-3">
          <!-- Go to Home -->
          <a routerLink="/" 
             class="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-dark-border hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span>Ir al Portfolio</span>
          </a>
          
          <!-- User / Logout -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-400">{{ authService.user()?.username || 'Admin' }}</span>
            <button (click)="logout()" class="text-sm text-red-400 hover:text-red-300 transition-colors">
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 p-8 overflow-auto">
        <router-outlet />
      </main>
    </div>
    
    <!-- Toast notifications -->
    <app-toast-container />
  `,
})
export class AdminLayoutComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
