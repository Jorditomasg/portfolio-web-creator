import { Component, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../../core/services/content.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-about',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-white mb-8">Editar Sobre Mí & Hero</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- About Section -->
        <div class="bg-dark-surface rounded-xl border border-dark-border p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Información Personal</h2>
          <form (ngSubmit)="saveAbout()" class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-1">Biografía</label>
              <textarea [(ngModel)]="aboutForm.bio" name="bio" rows="5"
                        class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white resize-none"></textarea>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-1">Highlights (uno por línea)</label>
              <textarea [(ngModel)]="aboutForm.highlightsText" name="highlights" rows="4"
                        class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white resize-none"
                        placeholder="5+ años de experiencia&#10;Proyectos internacionales&#10;..."></textarea>
            </div>
            <button type="submit" class="w-full py-2 bg-primary hover:bg-primary-dark text-dark-bg font-medium rounded-lg transition-colors">
              Guardar About
            </button>
          </form>
        </div>

        <!-- Hero Section (Simplified) -->
        <div class="bg-dark-surface rounded-xl border border-dark-border p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Sección Hero</h2>
          <form (ngSubmit)="saveHero()" class="space-y-4">
            <div class="p-4 bg-dark-bg rounded-lg border border-dark-border mb-4">
              <p class="text-sm text-gray-400 mb-2">Vista previa del título:</p>
              <p class="text-xl">
                <span class="text-white">{{ heroForm.title || 'Título' }}</span>
                @if (heroForm.title_highlight) {
                  <span class="text-primary">, {{ heroForm.title_highlight }}</span>
                }
              </p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-400 mb-1">Título (ES)</label>
                <input [(ngModel)]="heroForm.title" name="title"
                       class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white"
                       placeholder="Desarrollador Full Stack">
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Título destacado (amarillo)</label>
                <input [(ngModel)]="heroForm.title_highlight" name="title_highlight"
                       class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white"
                       placeholder="especialista en Angular">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-400 mb-1">Title (EN)</label>
                <input [(ngModel)]="heroForm.title_en" name="title_en"
                       class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white"
                       placeholder="Full Stack Developer">
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Title highlight (EN)</label>
                <input [(ngModel)]="heroForm.title_highlight_en" name="title_highlight_en"
                       class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white"
                       placeholder="Angular specialist">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-400 mb-1">Subtítulo (ES)</label>
                <input [(ngModel)]="heroForm.subtitle" name="subtitle"
                       class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white">
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Subtitle (EN)</label>
                <input [(ngModel)]="heroForm.subtitle_en" name="subtitle_en"
                       class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-400 mb-1">Descripción (ES)</label>
                <textarea [(ngModel)]="heroForm.description" name="description" rows="2"
                          class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white resize-none"></textarea>
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Description (EN)</label>
                <textarea [(ngModel)]="heroForm.description_en" name="description_en" rows="2"
                          class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white resize-none"></textarea>
              </div>
            </div>

            <button type="submit" class="w-full py-2 bg-primary hover:bg-primary-dark text-dark-bg font-medium rounded-lg transition-colors">
              Guardar Hero
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class AdminAboutComponent {
  private http = inject(HttpClient);
  content = inject(ContentService);

  aboutForm = { bio: '', highlightsText: '' };
  heroForm: any = { title: '', title_highlight: '', title_en: '', title_highlight_en: '', subtitle: '', subtitle_en: '', description: '', description_en: '' };

  constructor() {
    effect(() => {
      const about = this.content.about();
      if (about) { 
        this.aboutForm.bio = about.bio || '';
        this.aboutForm.highlightsText = about.highlights?.join('\n') || '';
      }
    }, { allowSignalWrites: true });
    
    effect(() => {
      const hero = this.content.hero();
      if (hero) { 
        this.heroForm.title = hero.title || '';
        this.heroForm.title_highlight = hero.title_highlight || '';
        this.heroForm.title_en = hero.title_en || '';
        this.heroForm.title_highlight_en = hero.title_highlight_en || '';
        this.heroForm.subtitle = hero.subtitle || '';
        this.heroForm.subtitle_en = hero.subtitle_en || '';
        this.heroForm.description = hero.description || '';
        this.heroForm.description_en = hero.description_en || '';
      }
    }, { allowSignalWrites: true });
  }

  async saveAbout() {
    const data = { bio: this.aboutForm.bio, highlights: this.aboutForm.highlightsText.split('\n').map(h => h.trim()).filter(h => h) };
    try { await firstValueFrom(this.http.put('/api/about', data)); await this.content.loadAllContent(); } catch (e) { console.error(e); }
  }

  async saveHero() {
    try { await firstValueFrom(this.http.put('/api/hero', this.heroForm)); await this.content.loadAllContent(); } catch (e) { console.error(e); }
  }
}
