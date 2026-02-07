import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../../core/services/content.service';
import { ToastService } from '../../core/services/toast.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-experience',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './experience.component.html',
})
export class AdminExperienceComponent {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  content = inject(ContentService);
  
  showModal = signal(false);
  editing = signal<number | null>(null);
  isSaving = signal(false);
  isDeletingVal = signal<number | null>(null); // Use a different name than method

  form: any = { title: '', company: '', period: '', description: '', achievementsText: '' };

  openModal() { this.form = { title: '', company: '', period: '', description: '', achievementsText: '' }; this.editing.set(null); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }

  edit(exp: any) {
    this.form = { ...exp, achievementsText: exp.achievements?.join('\n') || '' };
    this.editing.set(exp.id);
    this.showModal.set(true);
  }

  async save() {
    this.isSaving.set(true);
    const data = { ...this.form, achievements: this.form.achievementsText.split('\n').map((a: string) => a.trim()).filter((a: string) => a) };
    delete data.achievementsText;
    try {
      if (this.editing()) { 
        await firstValueFrom(this.http.put(`/api/experiences/${this.editing()}`, data)); 
        this.toast.success('Experiencia actualizada');
      }
      else { 
        await firstValueFrom(this.http.post('/api/experiences', data)); 
        this.toast.success('Experiencia creada');
      }
      await this.content.loadAllContent();
      this.closeModal();
    } catch (e) { 
      console.error(e);
      this.toast.error('Error al guardar la experiencia');
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteExp(id: number) {
    if (confirm('¿Eliminar esta experiencia?')) {
      this.isDeletingVal.set(id);
      try {
        await firstValueFrom(this.http.delete(`/api/experiences/${id}`));
        await this.content.loadAllContent();
        this.toast.success('Experiencia eliminada');
      } catch (e) {
        console.error(e);
        this.toast.error('Error al eliminar');
      } finally {
        this.isDeletingVal.set(null);
      }
    }
  }
}
