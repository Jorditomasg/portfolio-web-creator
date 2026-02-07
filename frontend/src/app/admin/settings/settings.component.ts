import { Component, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ContentService } from '../../core/services/content.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-white mb-8">Configuración General</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- General Settings -->
        <div class="bg-dark-surface rounded-xl border border-dark-border p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Sitio Web</h2>
          <form (ngSubmit)="save()" class="space-y-5">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Título del Sitio <span class="text-red-500">*</span></label>
              <input [(ngModel)]="form.site_title" name="site_title" required
                     class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white"
                     placeholder="Portfolio Creator">
              <p class="mt-1 text-xs text-gray-500">Aparece en la pestaña del navegador y footer</p>
            </div>

            <div>
              <label class="block text-sm text-gray-400 mb-2">URL Foto Principal</label>
              <input [(ngModel)]="form.main_photo_url" name="main_photo_url"
                     class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white"
                     placeholder="https://example.com/photo.jpg">
              @if (form.main_photo_url) {
                <img [src]="form.main_photo_url" alt="Preview" class="mt-3 w-24 h-24 object-cover rounded-lg border border-dark-border">
              }
            </div>

            <div>
              <label class="block text-sm text-gray-400 mb-2">Meta Descripción (SEO)</label>
              <textarea [(ngModel)]="form.meta_description" name="meta_description" rows="3"
                        class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white resize-none"
                        placeholder="Descripción para motores de búsqueda..."></textarea>
              <p class="mt-1 text-xs text-gray-500">{{ (form.meta_description || '').length }}/160 caracteres recomendados</p>
            </div>

            <button type="submit" [disabled]="isSaving()" 
                    class="w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-dark-bg font-semibold rounded-lg transition-colors">
              {{ isSaving() ? 'Guardando...' : 'Guardar' }}
            </button>
          </form>
        </div>

        <!-- Social Links -->
        <div class="bg-dark-surface rounded-xl border border-dark-border p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Redes Sociales & Contacto</h2>
          <p class="text-gray-400 text-sm mb-6">Deja en blanco los campos que no quieras mostrar</p>
          
          <form (ngSubmit)="save()" class="space-y-5">
            <div>
              <label class="block text-sm text-gray-400 mb-2">
                <span class="flex items-center gap-2">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" class="w-4 h-4">
                  LinkedIn URL
                </span>
              </label>
              <input [(ngModel)]="form.linkedin_url" name="linkedin_url"
                     class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white"
                     placeholder="https://linkedin.com/in/tu-perfil">
            </div>

            <div>
              <label class="block text-sm text-gray-400 mb-2">
                <span class="flex items-center gap-2">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" class="w-4 h-4 invert">
                  GitHub URL
                </span>
              </label>
              <input [(ngModel)]="form.github_url" name="github_url"
                     class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white"
                     placeholder="https://github.com/tu-usuario">
            </div>

            <div>
              <label class="block text-sm text-gray-400 mb-2">
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  Email de Contacto
                </span>
              </label>
              <input [(ngModel)]="form.email" name="email" type="email"
                     class="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white"
                     placeholder="tu@email.com">
            </div>

            <button type="submit" [disabled]="isSaving()" 
                    class="w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-dark-bg font-semibold rounded-lg transition-colors">
              {{ isSaving() ? 'Guardando...' : 'Guardar' }}
            </button>
          </form>
        </div>

        <!-- Appearance Settings -->
        <div class="bg-dark-surface rounded-xl border border-dark-border p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Apariencia</h2>
          <p class="text-gray-400 text-sm mb-6">Personaliza el aspecto visual del portfolio</p>
          
          <form (ngSubmit)="save()" class="space-y-5">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Icono del Sitio (Favicon)</label>
              <div class="grid grid-cols-3 gap-3">
                @for (icon of faviconOptions; track icon.value) {
                  <button type="button" (click)="form.favicon_type = icon.value"
                          [class]="'p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ' + 
                                   (form.favicon_type === icon.value ? 'border-primary bg-primary/10' : 'border-dark-border hover:border-gray-600')">
                    <span class="text-2xl">{{ icon.emoji }}</span>
                    <span class="text-xs text-gray-400">{{ icon.label }}</span>
                  </button>
                }
              </div>
            </div>

            <div>
              <label class="block text-sm text-gray-400 mb-2">Color de Énfasis</label>
              <div class="flex gap-3">
                @for (color of accentColors; track color.value) {
                  <button type="button" (click)="form.accent_color = color.value"
                          [style.background-color]="color.value"
                          [class]="'w-12 h-12 rounded-xl border-2 transition-all ' + 
                                   (form.accent_color === color.value ? 'border-white scale-110' : 'border-transparent hover:scale-105')">
                  </button>
                }
                <div class="flex items-center gap-2">
                  <input type="color" [(ngModel)]="form.accent_color" name="accent_color" 
                         class="w-12 h-12 rounded-lg cursor-pointer border-0 bg-transparent">
                  <span class="text-xs text-gray-500">Custom</span>
                </div>
              </div>
              <p class="mt-2 text-xs text-gray-500">Color actual: <code class="text-primary">{{ form.accent_color }}</code></p>
            </div>

            <button type="submit" [disabled]="isSaving()" 
                    class="w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-dark-bg font-semibold rounded-lg transition-colors">
              {{ isSaving() ? 'Guardando...' : 'Guardar' }}
            </button>
          </form>
        </div>

        <!-- Navigation Settings -->
        <div class="bg-dark-surface rounded-xl border border-dark-border p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Navegación</h2>
          <p class="text-gray-400 text-sm mb-6">Configura los enlaces de navegación</p>
          
          <form (ngSubmit)="save()" class="space-y-5">
            <div class="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border">
              <div>
                <h3 class="text-white font-medium">Mostrar enlace Admin</h3>
                <p class="text-xs text-gray-500 mt-1">Añade "Admin" al menú de navegación</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" [(ngModel)]="form.show_admin_link" name="show_admin_link" class="sr-only peer">
                <div class="w-11 h-6 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div class="p-4 bg-dark-bg/50 rounded-lg border border-dark-border/50">
              <p class="text-sm text-gray-400">
                <span class="text-yellow-500">💡</span> Puedes siempre acceder al admin desde <code class="text-primary">/admin/login</code>
              </p>
            </div>

            <button type="submit" [disabled]="isSaving()" 
                    class="w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-dark-bg font-semibold rounded-lg transition-colors">
              {{ isSaving() ? 'Guardando...' : 'Guardar' }}
            </button>
          </form>
        </div>
      </div>

      @if (saved()) {
        <div class="mt-6 p-4 bg-green-500/20 text-green-400 rounded-lg text-center border border-green-500/30">
          ✓ ¡Configuración guardada correctamente!
        </div>
      }
    </div>
  `,
})
export class AdminSettingsComponent {
  private http = inject(HttpClient);
  content = inject(ContentService);
  private toast = inject(ToastService);

  isSaving = signal(false);
  saved = signal(false);

  faviconOptions = [
    { value: 'terminal', label: 'Terminal', emoji: '💻' },
    { value: 'code', label: 'Código', emoji: '</>' },
    { value: 'rocket', label: 'Cohete', emoji: '🚀' },
    { value: 'star', label: 'Estrella', emoji: '⭐' },
    { value: 'briefcase', label: 'Maletín', emoji: '💼' },
    { value: 'user', label: 'Usuario', emoji: '👤' },
  ];

  accentColors = [
    { value: '#F5A623', label: 'Amarillo' },
    { value: '#10B981', label: 'Verde' },
    { value: '#3B82F6', label: 'Azul' },
    { value: '#8B5CF6', label: 'Morado' },
    { value: '#EC4899', label: 'Rosa' },
    { value: '#EF4444', label: 'Rojo' },
  ];

  form: any = { 
    site_title: '', main_photo_url: '', meta_description: '', 
    linkedin_url: '', github_url: '', email: '',
    favicon_type: 'terminal', accent_color: '#F5A623', show_admin_link: false
  };

  constructor() {
    effect(() => {
      const settings = this.content.settings();
      if (settings) {
        this.form.site_title = settings.site_title || '';
        this.form.main_photo_url = settings.main_photo_url || '';
        this.form.meta_description = settings.meta_description || '';
        this.form.linkedin_url = settings.linkedin_url || '';
        this.form.github_url = settings.github_url || '';
        this.form.email = settings.email || '';
        this.form.favicon_type = settings.favicon_type || 'terminal';
        this.form.accent_color = settings.accent_color || '#F5A623';
        this.form.show_admin_link = settings.show_admin_link || false;
      }
    }, { allowSignalWrites: true });
  }

  async save() {
    this.isSaving.set(true);
    try {
      const data = {
        site_title: this.form.site_title,
        main_photo_url: this.form.main_photo_url || null,
        meta_description: this.form.meta_description,
        linkedin_url: this.form.linkedin_url || null,
        github_url: this.form.github_url || null,
        email: this.form.email || null,
        favicon_type: this.form.favicon_type,
        accent_color: this.form.accent_color,
        show_admin_link: this.form.show_admin_link,
      };
      await firstValueFrom(this.http.put('/api/settings', data));
      await this.content.loadAllContent();
      this.toast.success('Configuración guardada correctamente');
    } catch (err) { 
      console.error('Error saving settings', err);
      this.toast.error('Error al guardar la configuración');
    }
    finally { this.isSaving.set(false); }
  }
}

