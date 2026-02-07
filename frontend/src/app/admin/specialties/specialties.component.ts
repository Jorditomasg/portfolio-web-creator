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
  templateUrl: './specialties.component.html',
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
