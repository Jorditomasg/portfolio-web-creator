import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../../core/services/content.service';
import { ToastService } from '../../core/services/toast.service';
import { firstValueFrom } from 'rxjs';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Experience } from '../../core/models/api.models';

@Component({
  selector: 'app-admin-experience',
  standalone: true,
  imports: [FormsModule, DragDropModule],
  templateUrl: './experience.component.html',
})
export class AdminExperienceComponent {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  content = inject(ContentService);
  
  showModal = signal(false);
  editing = signal<number | null>(null);
  isSaving = signal(false);
  isDeletingVal = signal<number | null>(null);

  form: any = { 
    title: '', 
    title_en: '',
    company: '', 
    company_logo: '',
    period: '', 
    description: '', 
    description_en: '',
    achievementsText: '',
    achievementsTextEn: '',
    start_date: '',
    end_date: '',
    is_current: false
  };

  sortedExperiences = computed(() => {
    const exps = [...this.content.experiences()];
    return exps.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  });

  openModal() { 
    this.form = { 
      title: '', title_en: '', company: '', company_logo: '', 
      description: '', description_en: '', achievementsText: '', achievementsTextEn: '',
      start_date: '', end_date: '', is_current: false 
    }; 
    this.editing.set(null); 
    this.showModal.set(true); 
  }
  
  closeModal() { this.showModal.set(false); }

  edit(exp: Experience) {
    // Format dates to yyyy-MM
    const fmtDate = (d: any) => d ? new Date(d).toISOString().substring(0, 7) : '';
    
    this.form = { 
      ...exp, 
      achievementsText: exp.achievements?.join('\n') || '',
      achievementsTextEn: exp.achievements_en?.join('\n') || '',
      start_date: fmtDate(exp.start_date),
      end_date: fmtDate(exp.end_date)
    };
    this.editing.set(exp.id);
    this.showModal.set(true);
  }

  async save() {
    // Validate required fields (only title and company)
    if (!this.form.title || !this.form.company) {
      this.toast.error('Por favor completa los campos obligatorios (Título, Empresa)');
      return;
    }

    this.isSaving.set(true);
    
    // Calculate period string
    const formatPeriodDateLocal = (d: string) => {
      if (!d) return '';
      const [year, month] = d.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    };

    let period = '';
    if (this.form.start_date) {
      period = formatPeriodDateLocal(this.form.start_date);
      // Only add end part if there's an end date or it's current
      if (this.form.is_current) {
        period += ' - Presente';
      } else if (this.form.end_date) {
        period += ' - ' + formatPeriodDateLocal(this.form.end_date);
      }
      // Capitalize first letter
      period = period.charAt(0).toUpperCase() + period.slice(1);
    }

    const data = { 
      ...this.form, 
      period,
      start_date: this.form.start_date ? this.form.start_date + '-01' : null,
      end_date: this.form.is_current ? null : (this.form.end_date ? this.form.end_date + '-01' : null),
      achievements: this.form.achievementsText.split('\n').map((a: string) => a.trim()).filter((a: string) => a),
      achievements_en: this.form.achievementsTextEn?.split('\n').map((a: string) => a.trim()).filter((a: string) => a) || []
    };
    delete data.achievementsText;
    delete data.achievementsTextEn;
    
    try {
      if (this.editing()) { 
        await firstValueFrom(this.http.patch(`/api/experiences/${this.editing()}`, data)); 
        this.toast.success('Experiencia actualizada');
      }
      else { 
        await firstValueFrom(this.http.post('/api/experiences', data)); 
        this.toast.success('Experiencia creada');
      }
      await this.content.loadAllContent();
      this.closeModal();
    } catch (e: any) { 
      console.error(e);
      const msg = e.error?.message || 'Error al guardar la experiencia';
      this.toast.error(typeof msg === 'string' ? msg : (Array.isArray(msg) ? msg.join(', ') : JSON.stringify(msg)));
    } finally {
      this.isSaving.set(false);
    }
  }

  async drop(event: CdkDragDrop<Experience[]>) {
    
    const experiences = [...this.sortedExperiences()];
    moveItemInArray(experiences, event.previousIndex, event.currentIndex);
    
    try {
      await Promise.all(experiences.map((exp, index) => 
        firstValueFrom(this.http.patch(`/api/experiences/${exp.id}`, { display_order: index }))
      ));
      await this.content.loadAllContent();
      this.toast.success('Orden actualizado');
    } catch (e) {
      console.error(e);
      this.toast.error('Error al actualizar orden');
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

  isDeleting(id: number) { return this.isDeletingVal() === id; }
}
