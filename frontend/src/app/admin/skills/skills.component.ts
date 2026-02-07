import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../../core/services/content.service';
import { ToastService } from '../../core/services/toast.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-skills',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-white">Gestión de Habilidades</h1>
        <button (click)="openModal()" class="px-4 py-2 bg-primary hover:bg-primary-dark text-dark-bg font-medium rounded-lg transition-colors">
          + Nueva Habilidad
        </button>
      </div>

      <!-- Skills by Category -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @for (category of ['frontend', 'backend', 'tools']; track category) {
          <div class="bg-dark-surface rounded-xl border border-dark-border p-6">
            <h2 class="text-lg font-semibold text-white mb-4 capitalize">{{ category }}</h2>
            <ul class="space-y-3">
              @for (skill of getSkillsByCategory(category); track skill.id) {
                <li class="flex items-center justify-between p-3 bg-dark-bg rounded-lg border border-dark-border">
                  <div>
                    <span class="text-white">{{ skill.name }}</span>
                    <div class="flex gap-1 mt-1">
                      @for (_ of [1,2,3,4,5]; track $index; let i = $index) {
                        <span class="w-2 h-2 rounded-full" [class]="i < skill.level ? 'bg-primary' : 'bg-dark-border'"></span>
                      }
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button (click)="edit(skill)" class="text-gray-400 hover:text-primary transition-colors text-sm">Editar</button>
                    <button (click)="deleteSkill(skill.id)" class="text-gray-400 hover:text-red-500 transition-colors text-sm">×</button>
                  </div>
                </li>
              } @empty {
                <li class="text-gray-500 text-sm">No hay habilidades</li>
              }
            </ul>
          </div>
        }
      </div>

      <!-- Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div class="bg-dark-surface rounded-xl border border-dark-border w-full max-w-md">
            <div class="p-6 border-b border-dark-border">
              <h2 class="text-xl font-bold text-white">{{ editing() ? 'Editar' : 'Nueva' }} Habilidad</h2>
            </div>
            <form (ngSubmit)="save()" class="p-6 space-y-4">
              <div>
                <label class="block text-sm text-gray-400 mb-1">Nombre <span class="text-red-500">*</span></label>
                <input [(ngModel)]="form.name" name="name" required
                       class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white">
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Categoría <span class="text-red-500">*</span></label>
                <select [(ngModel)]="form.category" name="category" required
                        class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white">
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="tools">Herramientas</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Nivel (1-5) <span class="text-red-500">*</span></label>
                <div class="flex items-center gap-4">
                  <input [(ngModel)]="form.level" name="level" type="range" min="1" max="5" step="1"
                         class="flex-1 accent-primary">
                  <div class="flex gap-1">
                    @for (_ of [1,2,3,4,5]; track $index; let i = $index) {
                      <span class="w-3 h-3 rounded-full transition-colors" 
                            [class]="i < form.level ? 'bg-primary' : 'bg-dark-border'"></span>
                    }
                  </div>
                  <span class="text-white font-bold min-w-[2rem] text-center">{{ form.level }}</span>
                </div>
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
export class AdminSkillsComponent {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  content = inject(ContentService);
  
  showModal = signal(false);
  editing = signal<number | null>(null);
  form = { name: '', category: 'frontend', level: 3 };

  getSkillsByCategory(category: string) {
    return this.content.skills().filter(s => s.category === category);
  }

  openModal() { 
    this.form = { name: '', category: 'frontend', level: 3 }; 
    this.editing.set(null); 
    this.showModal.set(true); 
  }
  
  closeModal() { this.showModal.set(false); }

  edit(skill: any) { 
    this.form = { 
      name: skill.name,
      category: skill.category,
      level: Math.min(5, Math.max(1, skill.level || 3))
    }; 
    this.editing.set(skill.id); 
    this.showModal.set(true); 
  }

  async save() {
    // Clamp level between 1-5
    const data = {
      ...this.form,
      level: Math.min(5, Math.max(1, this.form.level))
    };
    try {
      if (this.editing()) { 
        await firstValueFrom(this.http.put(`/api/skills/${this.editing()}`, data)); 
        this.toast.success('Habilidad actualizada correctamente');
      } else { 
        await firstValueFrom(this.http.post('/api/skills', data)); 
        this.toast.success('Habilidad creada correctamente');
      }
      await this.content.loadAllContent();
      this.closeModal();
    } catch (e) { 
      console.error(e); 
      this.toast.error('Error al guardar la habilidad');
    }
  }

  async deleteSkill(id: number) {
    if (confirm('¿Eliminar esta habilidad?')) {
      try {
        await firstValueFrom(this.http.delete(`/api/skills/${id}`));
        await this.content.loadAllContent();
        this.toast.success('Habilidad eliminada');
      } catch (e) {
        this.toast.error('Error al eliminar la habilidad');
      }
    }
  }
}
