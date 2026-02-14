import { Component, inject, signal, effect, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../../core/services/content.service';
import { ToastService } from '../../core/services/toast.service';
import { forkJoin, switchMap, finalize, tap, of } from 'rxjs';

@Component({
  selector: 'app-admin-about',
  templateUrl: './about.component.html',
  imports: [FormsModule],
})
export class AdminAboutComponent implements OnInit {
  private http = inject(HttpClient);
  content = inject(ContentService);
  private toast = inject(ToastService);

  isSaving = signal(false);
  isDirtyAbout = signal(false);
  isDirtyHero = signal(false);

  aboutForm: { bio: string; bio_en: string; highlightsText: string; highlightsText_en: string } = { 
    bio: '', bio_en: '', highlightsText: '', highlightsText_en: '' 
  };

  initialAboutForm: any = {};

  heroForm: any = { 
    title: '', title_highlight: '', title_en: '', title_highlight_en: '', 
    subtitle: '', subtitle_en: '', description: '', description_en: '' 
  };

  initialHeroForm: any = {};

  isDirty = computed(() => this.isDirtyAbout() || this.isDirtyHero());

  constructor() {
    effect(() => {
      const about = this.content.about();
      if (about) { 
        this.aboutForm.bio = about.bio || '';
        this.aboutForm.bio_en = about.bio_en || '';
        this.aboutForm.highlightsText = about.highlights?.join('\n') || '';
        this.aboutForm.highlightsText_en = about.highlights_en?.join('\n') || '';
        this.initialAboutForm = JSON.parse(JSON.stringify(this.aboutForm));
        this.checkDirtyAbout();
      }
    }, { allowSignalWrites: true });
    
    effect(() => {
      const hero = this.content.hero();
      if (hero) { 
        this.heroForm.title = hero.title || '';
        this.heroForm.title_highlight = hero.title_highlight || '';
        this.heroForm.title_en = hero.title_en || '';
        this.heroForm.title_highlight_en = hero.title_highlight_en || '';
        this.heroForm.subtitle = hero.subtitle || '';
        this.heroForm.subtitle_en = hero.subtitle_en || '';
        this.heroForm.description = hero.description || '';
        this.heroForm.description_en = hero.description_en || '';
        this.initialHeroForm = JSON.parse(JSON.stringify(this.heroForm));
        this.checkDirtyHero();
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.content.loadAbout().subscribe();
    this.content.loadHero().subscribe();
  }

  checkDirtyAbout() {
    this.isDirtyAbout.set(JSON.stringify(this.aboutForm) !== JSON.stringify(this.initialAboutForm));
  }

  checkDirtyHero() {
    this.isDirtyHero.set(JSON.stringify(this.heroForm) !== JSON.stringify(this.initialHeroForm));
  }

  save() {
    if (!this.isDirty()) return;

    this.isSaving.set(true);

    const tasks: any[] = [];

    if (this.isDirtyAbout()) {
      const aboutPayload = {
        bio: this.aboutForm.bio,
        bio_en: this.aboutForm.bio_en,
        highlights: this.aboutForm.highlightsText.split('\n').map(h => h.trim()).filter(h => h),
        highlights_en: this.aboutForm.highlightsText_en.split('\n').map(h => h.trim()).filter(h => h)
      };
      
      tasks.push(
        this.http.put('/api/about', aboutPayload).pipe(
          tap(() => {
            this.initialAboutForm = JSON.parse(JSON.stringify(this.aboutForm));
            this.checkDirtyAbout();
          })
        )
      );
    }

    if (this.isDirtyHero()) {
      const heroPayload = { ...this.heroForm };
      
      tasks.push(
        this.http.put('/api/hero', heroPayload).pipe(
          tap(() => {
            this.initialHeroForm = JSON.parse(JSON.stringify(this.heroForm));
            this.checkDirtyHero();
          })
        )
      );
    }

    if (tasks.length === 0) {
      this.isSaving.set(false);
      return;
    }

    forkJoin(tasks).pipe(
      switchMap(() => forkJoin([
        this.content.loadAbout(true),
        this.content.loadHero(true)
      ])),
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: () => {
        this.toast.success('Cambios guardados correctamente');
      },
      error: (e) => {
        console.error(e);
        this.toast.error('Error al guardar los cambios');
      }
    });
  }
}
