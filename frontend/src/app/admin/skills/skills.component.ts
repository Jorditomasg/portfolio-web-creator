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
  templateUrl: './skills.component.html',
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
