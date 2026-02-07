import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../../core/services/content.service';
import { ToastService } from '../../core/services/toast.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-specialties',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-white">Gestión de Especialidades</h1>
        <button (click)="openModal()" class="px-4 py-2 bg-primary hover:bg-primary-dark text-dark-bg font-medium rounded-lg transition-colors">
          + Nueva Especialidad
        </button>
      </div>

      <!-- Specialties List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (specialty of content.specialties(); track specialty.id) {
          <div class="bg-dark-surface rounded-xl border border-dark-border p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                   [class]="specialty.color === 'green' ? 'bg-accent-green/20' : specialty.color === 'blue' ? 'bg-accent-blue/20' : 'bg-primary/20'">
                {{ getIconForType(specialty.icon_type) }}
              </div>
              <div class="flex gap-2">
                <button (click)="edit(specialty)" class="text-gray-400 hover:text-primary transition-colors text-sm">Editar</button>
                <button (click)="deleteSpecialty(specialty.id)" class="text-gray-400 hover:text-red-500 transition-colors text-sm">×</button>
              </div>
            </div>
            <h3 class="text-lg font-bold text-white mb-2">{{ specialty.title }}</h3>
            <p class="text-gray-400 text-sm mb-4">{{ specialty.description }}</p>
            @if (specialty.technologies.length) {
              <div class="flex flex-wrap gap-1">
                @for (tech of specialty.technologies; track tech) {
                  <span class="px-2 py-0.5 bg-dark-bg text-xs text-gray-300 rounded">{{ tech }}</span>
                }
              </div>
            }
          </div>
        } @empty {
          <div class="col-span-full text-center py-12 text-gray-400">
            No hay especialidades. ¡Añade la primera!
          </div>
        }
      </div>

      <!-- Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div class="bg-dark-surface rounded-xl border border-dark-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-dark-border">
              <h2 class="text-xl font-bold text-white">{{ editing() ? 'Editar' : 'Nueva' }} Especialidad</h2>
            </div>
            <form (ngSubmit)="save()" class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Título (ES) <span class="text-red-500">*</span></label>
                  <input [(ngModel)]="form.title" name="title" required
                         class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white"
                         placeholder="Frontend Development">
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Title (EN)</label>
                  <input [(ngModel)]="form.title_en" name="title_en"
                         class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white"
                         placeholder="Frontend Development">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Descripción (ES) <span class="text-red-500">*</span></label>
                  <textarea [(ngModel)]="form.description" name="description" rows="3" required
                            class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white resize-none"
                            placeholder="Descripción..."></textarea>
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Description (EN)</label>
                  <textarea [(ngModel)]="form.description_en" name="description_en" rows="3"
                            class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white resize-none"
                            placeholder="Description..."></textarea>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Color <span class="text-red-500">*</span></label>
                  <select [(ngModel)]="form.color" name="color"
                          class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white">
                    <option value="primary">Amarillo (Primary)</option>
                    <option value="green">Verde</option>
                    <option value="blue">Azul</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Tipo de Icono <span class="text-red-500">*</span></label>
                  <select [(ngModel)]="form.icon_type" name="icon_type"
                          class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white">
                    <option value="frontend">💻 Frontend</option>
                    <option value="backend">⚙️ Backend</option>
                    <option value="devops">🌐 DevOps</option>
                    <option value="database">🗄️ Database</option>
                    <option value="mobile">📱 Mobile</option>
                    <option value="cloud">☁️ Cloud</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Tecnologías (separadas por coma)</label>
                <input [(ngModel)]="form.technologies" name="technologies"
                       class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white"
                       placeholder="Angular, TypeScript, RxJS">
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Orden de visualización</label>
                <input [(ngModel)]="form.display_order" name="display_order" type="number" min="0"
                       class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white">
              </div>
              <div class="flex justify-end gap-3 pt-4">
                <button type="button" (click)="closeModal()" class="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancelar</button>
                <button type="submit" class="px-6 py-2 bg-primary hover:bg-primary-dark text-dark-bg font-medium rounded-lg transition-colors">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminSpecialtiesComponent {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  content = inject(ContentService);
  
  showModal = signal(false);
  editing = signal<number | null>(null);
  form: any = { title: '', title_en: '', description: '', description_en: '', color: 'primary', icon_type: 'frontend', technologies: '', display_order: 0 };

  getIconForType(type: string): string {
    const icons: Record<string, string> = {
      'frontend': '💻',
      'backend': '⚙️',
      'devops': '🌐',
      'database': '🗄️',
      'mobile': '📱',
      'cloud': '☁️',
    };
    return icons[type] || '💻';
  }

  openModal() { 
    this.form = { title: '', title_en: '', description: '', description_en: '', color: 'primary', icon_type: 'frontend', technologies: '', display_order: 0 }; 
    this.editing.set(null); 
    this.showModal.set(true); 
  }
  
  closeModal() { this.showModal.set(false); }

  edit(specialty: any) {
    this.form = { 
      title: specialty.title || '',
      title_en: specialty.title_en || '',
      description: specialty.description || '',
      description_en: specialty.description_en || '',
      color: specialty.color || 'primary',
      icon_type: specialty.icon_type || 'frontend',
      technologies: specialty.technologies?.join(', ') || '',
      display_order: specialty.display_order || 0
    };
    this.editing.set(specialty.id);
    this.showModal.set(true);
  }

  async save() {
    const data = { 
      ...this.form, 
      technologies: this.form.technologies ? this.form.technologies.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [] 
    };
    try {
      if (this.editing()) { 
        await firstValueFrom(this.http.put(`/api/specialties/${this.editing()}`, data));
        this.toast.success('Especialidad actualizada correctamente');
      } else { 
        await firstValueFrom(this.http.post('/api/specialties', data));
        this.toast.success('Especialidad creada correctamente');
      }
      await this.content.loadAllContent();
      this.closeModal();
    } catch (e) { 
      console.error(e);
      this.toast.error('Error al guardar la especialidad');
    }
  }

  async deleteSpecialty(id: number) {
    if (confirm('¿Eliminar esta especialidad?')) {
      try {
        await firstValueFrom(this.http.delete(`/api/specialties/${id}`));
        await this.content.loadAllContent();
        this.toast.success('Especialidad eliminada');
      } catch (e) {
        this.toast.error('Error al eliminar la especialidad');
      }
    }
  }
}
