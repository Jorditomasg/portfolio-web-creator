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
  templateUrl: './projects.component.html',
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
