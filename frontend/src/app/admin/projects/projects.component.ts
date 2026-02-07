import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../../core/services/content.service';
import { ToastService } from '../../core/services/toast.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-white">Gestión de Proyectos</h1>
        <button (click)="openModal()" class="px-4 py-2 bg-primary hover:bg-primary-dark text-dark-bg font-medium rounded-lg transition-colors">
          + Nuevo Proyecto
        </button>
      </div>

      <!-- Projects List -->
      <div class="bg-dark-surface rounded-xl border border-dark-border overflow-hidden">
        <table class="w-full">
          <thead class="bg-dark-border">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">Título</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">Tecnologías</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">Destacado</th>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-dark-border">
            @for (project of content.projects(); track project.id) {
              <tr class="hover:bg-dark-border/50 transition-colors">
                <td class="px-6 py-4 text-white">{{ project.title }}</td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    @for (tech of project.technologies.slice(0, 3); track tech) {
                      <span class="px-2 py-0.5 bg-dark-bg text-xs text-gray-300 rounded">{{ tech }}</span>
                    }
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span [class]="project.featured ? 'text-primary' : 'text-gray-500'">
                    {{ project.featured ? '⭐ Sí' : 'No' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button (click)="edit(project)" class="text-gray-400 hover:text-primary mr-3 transition-colors">Editar</button>
                  <button (click)="deleteProject(project.id)" class="text-gray-400 hover:text-red-500 transition-colors">Eliminar</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="px-6 py-12 text-center text-gray-400">No hay proyectos</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div class="bg-dark-surface rounded-xl border border-dark-border w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-dark-border">
              <h2 class="text-xl font-bold text-white">{{ editing() ? 'Editar' : 'Nuevo' }} Proyecto</h2>
            </div>
            <form (ngSubmit)="save()" class="p-6 space-y-4">
              <!-- Title with EN version -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Título (ES) <span class="text-red-500">*</span></label>
                  <input [(ngModel)]="form.title" name="title" required
                         class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white">
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Title (EN)</label>
                  <input [(ngModel)]="form.title_en" name="title_en"
                         class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white">
                </div>
              </div>
              
              <!-- Short Description with EN version -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Descripción corta (ES)</label>
                  <textarea [(ngModel)]="form.description" name="description" rows="2"
                            class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white resize-none"></textarea>
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Short description (EN)</label>
                  <textarea [(ngModel)]="form.description_en" name="description_en" rows="2"
                            class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white resize-none"></textarea>
                </div>
              </div>

              <!-- Long Description with EN version -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Descripción larga (ES)</label>
                  <textarea [(ngModel)]="form.long_description" name="long_description" rows="3"
                            class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white resize-none"></textarea>
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-1">Long description (EN)</label>
                  <textarea [(ngModel)]="form.long_description_en" name="long_description_en" rows="3"
                            class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white resize-none"></textarea>
                </div>
              </div>

              <!-- URLs -->
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm text-gray-400 mb-1">URL Imagen</label>
                  <input [(ngModel)]="form.image_url" name="image_url"
                         class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white">
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-1">URL Demo</label>
                  <input [(ngModel)]="form.demo_url" name="demo_url"
                         class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white">
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-1">URL GitHub</label>
                  <input [(ngModel)]="form.github_url" name="github_url"
                         class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white">
                </div>
              </div>
              
              <div>
                <label class="block text-sm text-gray-400 mb-1">Tecnologías (separadas por coma)</label>
                <input [(ngModel)]="form.technologies" name="technologies"
                       class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white"
                       placeholder="Angular, TypeScript, NestJS">
              </div>
              <div class="flex items-center gap-2">
                <input type="checkbox" [(ngModel)]="form.featured" name="featured" id="featured" class="w-4 h-4 accent-primary">
                <label for="featured" class="text-gray-300">Proyecto destacado</label>
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
export class AdminProjectsComponent {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  content = inject(ContentService);
  
  showModal = signal(false);
  editing = signal<number | null>(null);
  form: any = { 
    title: '', title_en: '',
    description: '', description_en: '',
    long_description: '', long_description_en: '',
    image_url: '', demo_url: '', github_url: '', 
    technologies: '', featured: false 
  };

  openModal() { 
    this.form = { 
      title: '', title_en: '',
      description: '', description_en: '',
      long_description: '', long_description_en: '',
      image_url: '', demo_url: '', github_url: '', 
      technologies: '', featured: false 
    }; 
    this.editing.set(null); 
    this.showModal.set(true); 
  }
  
  closeModal() { this.showModal.set(false); }

  edit(project: any) {
    // Only keep editable fields, not id, created_at, updated_at
    this.form = { 
      title: project.title || '',
      title_en: project.title_en || '',
      description: project.description || '',
      description_en: project.description_en || '',
      long_description: project.long_description || '',
      long_description_en: project.long_description_en || '',
      image_url: project.image_url || '',
      demo_url: project.demo_url || '',
      github_url: project.github_url || '',
      technologies: project.technologies?.join(', ') || '',
      featured: project.featured || false,
      display_order: project.display_order || 0
    };
    this.editing.set(project.id);
    this.showModal.set(true);
  }

  async save() {
    const data = { 
      ...this.form, 
      technologies: this.form.technologies ? this.form.technologies.split(',').map((t: string) => t.trim()).filter((t: string) => t) : []
    };
    try {
      if (this.editing()) { 
        await firstValueFrom(this.http.put(`/api/projects/${this.editing()}`, data)); 
        this.toast.success('Proyecto actualizado correctamente');
      } else { 
        await firstValueFrom(this.http.post('/api/projects', data)); 
        this.toast.success('Proyecto creado correctamente');
      }
      await this.content.loadAllContent();
      this.closeModal();
    } catch (e) { 
      console.error(e); 
      this.toast.error('Error al guardar el proyecto');
    }
  }

  async deleteProject(id: number) {
    if (confirm('¿Eliminar este proyecto?')) {
      try {
        await firstValueFrom(this.http.delete(`/api/projects/${id}`));
        await this.content.loadAllContent();
        this.toast.success('Proyecto eliminado');
      } catch (e) {
        this.toast.error('Error al eliminar el proyecto');
      }
    }
  }
}
