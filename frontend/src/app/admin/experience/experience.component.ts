import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../../core/services/content.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-experience',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-white">Gestión de Experiencia</h1>
        <button (click)="openModal()" class="px-4 py-2 bg-primary hover:bg-primary-dark text-dark-bg font-medium rounded-lg transition-colors">
          + Nueva Experiencia
        </button>
      </div>

      <!-- Experience List -->
      <div class="space-y-4">
        @for (exp of content.experiences(); track exp.id) {
          <div class="bg-dark-surface rounded-xl border border-dark-border p-6">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-white">{{ exp.title }}</h3>
                <p class="text-gray-400 text-sm">{{ exp.company }} • {{ exp.period }}</p>
                <p class="text-gray-300 mt-2">{{ exp.description }}</p>
                @if (exp.achievements.length) {
                  <ul class="mt-2 space-y-1">
                    @for (a of exp.achievements; track $index) {
                      <li class="text-gray-400 text-sm">• {{ a }}</li>
                    }
                  </ul>
                }
              </div>
              <div class="flex gap-2 ml-4">
                <button (click)="edit(exp)" class="text-gray-400 hover:text-primary transition-colors">Editar</button>
                <button (click)="deleteExp(exp.id)" class="text-gray-400 hover:text-red-500 transition-colors">Eliminar</button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="text-center py-12 text-gray-400">No hay experiencias registradas</div>
        }
      </div>

      <!-- Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div class="bg-dark-surface rounded-xl border border-dark-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-dark-border">
              <h2 class="text-xl font-bold text-white">{{ editing() ? 'Editar' : 'Nueva' }} Experiencia</h2>
            </div>
            <form (ngSubmit)="save()" class="p-6 space-y-4">
              <div>
                <label class="block text-sm text-gray-400 mb-1">Puesto</label>
                <input [(ngModel)]="form.title" name="title" required
                       class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white">
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Empresa</label>
                <input [(ngModel)]="form.company" name="company" required
                       class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white">
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Período</label>
                <input [(ngModel)]="form.period" name="period" required placeholder="2020 - Presente"
                       class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white">
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Descripción</label>
                <textarea [(ngModel)]="form.description" name="description" rows="3"
                          class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white resize-none"></textarea>
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Logros (uno por línea)</label>
                <textarea [(ngModel)]="form.achievementsText" name="achievements" rows="4"
                          class="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:border-primary outline-none text-white resize-none"></textarea>
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
export class AdminExperienceComponent {
  private http = inject(HttpClient);
  content = inject(ContentService);
  
  showModal = signal(false);
  editing = signal<number | null>(null);
  form: any = { title: '', company: '', period: '', description: '', achievementsText: '' };

  openModal() { this.form = { title: '', company: '', period: '', description: '', achievementsText: '' }; this.editing.set(null); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }

  edit(exp: any) {
    this.form = { ...exp, achievementsText: exp.achievements?.join('\n') || '' };
    this.editing.set(exp.id);
    this.showModal.set(true);
  }

  async save() {
    const data = { ...this.form, achievements: this.form.achievementsText.split('\n').map((a: string) => a.trim()).filter((a: string) => a) };
    delete data.achievementsText;
    try {
      if (this.editing()) { await firstValueFrom(this.http.put(`/api/experiences/${this.editing()}`, data)); }
      else { await firstValueFrom(this.http.post('/api/experiences', data)); }
      await this.content.loadAllContent();
      this.closeModal();
    } catch (e) { console.error(e); }
  }

  async deleteExp(id: number) {
    if (confirm('¿Eliminar esta experiencia?')) {
      await firstValueFrom(this.http.delete(`/api/experiences/${id}`));
      await this.content.loadAllContent();
    }
  }
}
