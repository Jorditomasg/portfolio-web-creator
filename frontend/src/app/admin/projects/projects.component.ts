import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../../core/services/content.service';
import { ToastService } from '../../core/services/toast.service';
import { forkJoin, switchMap, finalize } from 'rxjs';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';

@Component({
  selector: 'app-admin-projects',
  imports: [FormsModule, RouterLink, DragDropModule, FileUploadComponent],
  templateUrl: './projects.component.html',
})
export class AdminProjectsComponent implements OnInit {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  content = inject(ContentService);

  ngOnInit() {
    this.content.loadProjects().subscribe();
    this.content.loadTechnologies().subscribe();
  }

  showModal = signal(false);
  isSaving = signal(false);
  editing = signal<number | null>(null);
  form: any = {
    title: '',
    title_en: '',
    description: '',
    description_en: '',
    long_description: '',
    long_description_en: '',
    image_url: '',
    demo_url: '',
    github_url: '',
    technologies: '',
    featured: false,
    is_in_progress: false,
    start_date: '',
    end_date: '',
  };

  openModal() {
    this.form = {
      title: '',
      title_en: '',
      description: '',
      description_en: '',
      long_description: '',
      long_description_en: '',
      image_url: '',
      demo_url: '',
      github_url: '',
      technologies: '',
      featured: false,
      is_in_progress: false,
      start_date: '',
      end_date: '',
    };
    this.editing.set(null);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  edit(project: any) {
    const fmtDate = (d: any) => (d ? new Date(d).toISOString().substring(0, 7) : '');

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
      is_in_progress: project.is_in_progress || false,
      display_order: project.display_order || 0,
      start_date: fmtDate(project.start_date),
      end_date: fmtDate(project.end_date),
    };
    this.editing.set(project.id);
    this.showModal.set(true);
  }

  save() {
    if (!this.form.title) {
      this.toast.error('Por favor completa el campo obligatorio (Título)');
      return;
    }

    const data = {
      ...this.form,
      technologies: this.form.technologies
        ? this.form.technologies
            .split(',')
            .map((t: string) => t.trim())
            .filter((t: string) => t)
        : [],
    };
    
    this.isSaving.set(true);
    const req = this.editing() 
      ? this.http.put(`/api/projects/${this.editing()}`, data)
      : this.http.post('/api/projects', data);

    req.pipe(
      switchMap(() => this.content.loadProjects(true)),
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: () => {
        this.toast.success(this.editing() ? 'Proyecto actualizado correctamente' : 'Proyecto creado correctamente');
        this.closeModal();
      },
      error: (e) => {
        console.error(e);
        this.toast.error('Error al guardar el proyecto');
      }
    });
  }

  // Tag Management
  newTechInput = signal('');

  // Filtered technologies for autocomplete
  filteredTechnologies = signal<any[]>([]);

  updateFilteredTechs() {
    const input = this.newTechInput().toLowerCase();
    if (!input) {
      this.filteredTechnologies.set([]);
      return;
    }

    const all = this.content.technologies();
    const current = this.form.technologies
      ? this.form.technologies.split(',').map((t: string) => t.trim().toLowerCase())
      : [];

    this.filteredTechnologies.set(
      all.filter(
        (t) => t.name.toLowerCase().includes(input) && !current.includes(t.name.toLowerCase()),
      ),
    );
  }

  addTech(techName: string) {
    const current = this.form.technologies
      ? this.form.technologies
          .split(',')
          .map((t: string) => t.trim())
          .filter((t: string) => t)
      : [];
    if (!current.includes(techName)) {
      current.push(techName);
      this.form.technologies = current.join(', ');
    }
    this.newTechInput.set('');
    this.filteredTechnologies.set([]);
  }

  removeTech(techName: string) {
    const current = this.form.technologies
      ? this.form.technologies
          .split(',')
          .map((t: string) => t.trim())
          .filter((t: string) => t)
      : [];
    this.form.technologies = current.filter((t: string) => t !== techName).join(', ');
  }

  onTechEnter(event: Event) {
    event.preventDefault();
    const val = this.newTechInput().trim();
    if (val) {
      this.addTech(val);
    }
  }

  deleteProject(id: number) {
    if (confirm('¿Eliminar este proyecto?')) {
      this.http.delete(`/api/projects/${id}`).pipe(
        switchMap(() => this.content.loadProjects(true))
      ).subscribe({
        next: () => {
          this.toast.success('Proyecto eliminado');
        },
        error: () => this.toast.error('Error al eliminar el proyecto'),
      });
    }
  }

  // Sorting helpers
  getSortedProjects() {
    const projects = [...this.content.projects()];
    return projects.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  }

  drop(event: CdkDragDrop<any[]>) {
    const projects = [...this.getSortedProjects()];
    moveItemInArray(projects, event.previousIndex, event.currentIndex);

    const updates = projects.map((project, index) =>
      this.http.put(`/api/projects/${project.id}`, { display_order: index })
    );

    forkJoin(updates).pipe(
      switchMap(() => this.content.loadProjects(true))
    ).subscribe({
      next: () => this.toast.success('Orden actualizado'),
      error: (e) => {
        console.error(e);
        this.toast.error('Error al actualizar orden');
      }
    });
  }
}
