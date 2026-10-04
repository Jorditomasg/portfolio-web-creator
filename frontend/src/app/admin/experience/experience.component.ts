import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../../core/services/content.service';
import { ToastService } from '../../core/services/toast.service';
import { forkJoin, switchMap, finalize } from 'rxjs';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Experience } from '../../core/models/api.models';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';

@Component({
  selector: 'app-admin-experience',
  imports: [FormsModule, DragDropModule, FileUploadComponent],
  templateUrl: './experience.component.html',
})
export class AdminExperienceComponent implements OnInit {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  content = inject(ContentService);
  
  ngOnInit() {
    this.content.loadExperiences().subscribe();
  }
  
  showModal = signal(false);
  editing = signal<number | null>(null);
  isSaving = signal(false);
  isDeletingVal = signal<number | null>(null);

  form: any = { 
    title: '', 
    company: '', 
    company_logo: '',
    period: '', 
    description: '', 
    achievementsText: '',
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
      title: '', company: '', company_logo: '', 
      description: '', achievementsText: '',
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
      start_date: fmtDate(exp.start_date),
      end_date: fmtDate(exp.end_date)
    };
    this.editing.set(exp.id);
    this.showModal.set(true);
  }

  save() {
    // Validate required fields (only title and company)
    if (!this.form.title || !this.form.company) {
      this.toast.error('Please fill in the required fields (Title, Company)');
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

    const data: any = { 
      ...this.form, 
      period,
      start_date: this.form.start_date ? this.form.start_date + '-01' : null,
      end_date: this.form.is_current ? null : (this.form.end_date ? this.form.end_date + '-01' : null),
      achievements: this.form.achievementsText.split('\n').map((a: string) => a.trim()).filter((a: string) => a)
    };
    
    // Remove temporary and read-only fields
    delete data.achievementsText;
    delete data.id;
    delete data.created_at;
    delete data.updated_at;

    const req = this.editing() 
      ? this.http.patch(`/api/experiences/${this.editing()}`, data)
      : this.http.post('/api/experiences', data);

    req.pipe(
      switchMap(() => this.content.loadExperiences(true)),
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: () => {
        this.toast.success(this.editing() ? 'Experience updated' : 'Experience created');
        this.closeModal();
      },
      error: (e: any) => {
        console.error(e);
        const msg = e.error?.message || 'Error saving experience';
        this.toast.error(typeof msg === 'string' ? msg : (Array.isArray(msg) ? msg.join(', ') : JSON.stringify(msg)));
      }
    });
  }

  drop(event: CdkDragDrop<Experience[]>) {
    const experiences = [...this.sortedExperiences()];
    moveItemInArray(experiences, event.previousIndex, event.currentIndex);
    
    const updates = experiences.map((exp, index) => 
      this.http.patch(`/api/experiences/${exp.id}`, { display_order: index })
    );

    forkJoin(updates).pipe(
      switchMap(() => this.content.loadExperiences(true))
    ).subscribe({
      next: () => this.toast.success('Order updated'),
      error: (e) => {
        console.error(e);
        this.toast.error('Error updating order');
      }
    });
  }

  deleteExp(id: number) {
    if (confirm('Delete this experience?')) {
      this.isDeletingVal.set(id);
      this.http.delete(`/api/experiences/${id}`).pipe(
        switchMap(() => this.content.loadExperiences(true)),
        finalize(() => this.isDeletingVal.set(null))
      ).subscribe({
        next: () => this.toast.success('Experience deleted'),
        error: (e) => {
          console.error(e);
          this.toast.error('Error deleting');
        }
      });
    }
  }

  isDeleting(id: number) { return this.isDeletingVal() === id; }
}
