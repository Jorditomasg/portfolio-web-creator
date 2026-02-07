import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-white mb-8">Dashboard</h1>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-dark-surface p-6 rounded-xl border border-dark-border">
          <div class="flex items-center justify-between mb-4">
            <span class="text-gray-400">Proyectos</span>
            <span class="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </span>
          </div>
          <p class="text-3xl font-bold text-white">{{ content.projects().length }}</p>
        </div>

        <div class="bg-dark-surface p-6 rounded-xl border border-dark-border">
          <div class="flex items-center justify-between mb-4">
            <span class="text-gray-400">Habilidades</span>
            <span class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </span>
          </div>
          <p class="text-3xl font-bold text-white">{{ content.skills().length }}</p>
        </div>

        <div class="bg-dark-surface p-6 rounded-xl border border-dark-border">
          <div class="flex items-center justify-between mb-4">
            <span class="text-gray-400">Experiencias</span>
            <span class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </span>
          </div>
          <p class="text-3xl font-bold text-white">{{ content.experiences().length }}</p>
        </div>

        <div class="bg-dark-surface p-6 rounded-xl border border-dark-border">
          <div class="flex items-center justify-between mb-4">
            <span class="text-gray-400">Destacados</span>
            <span class="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </span>
          </div>
          <p class="text-3xl font-bold text-white">{{ content.featuredProjects().length }}</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <h2 class="text-xl font-semibold text-white mb-4">Acciones Rápidas</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a routerLink="/admin/projects" 
           class="bg-dark-surface p-4 rounded-lg border border-dark-border hover:border-primary hover:bg-dark-border transition-all flex items-center gap-3 cursor-pointer">
          <span class="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-xl">➕</span>
          <span class="text-white font-medium">Nuevo Proyecto</span>
        </a>
        <a routerLink="/admin/skills"
           class="bg-dark-surface p-4 rounded-lg border border-dark-border hover:border-green-500 hover:bg-dark-border transition-all flex items-center gap-3 cursor-pointer">
          <span class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-xl">🔧</span>
          <span class="text-white font-medium">Añadir Habilidad</span>
        </a>
        <a routerLink="/admin/settings"
           class="bg-dark-surface p-4 rounded-lg border border-dark-border hover:border-gray-500 hover:bg-dark-border transition-all flex items-center gap-3 cursor-pointer">
          <span class="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center text-xl">⚙️</span>
          <span class="text-white font-medium">Configuración</span>
        </a>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  content = inject(ContentService);
}
