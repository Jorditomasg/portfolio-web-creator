import { Component, inject, signal, effect, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../../core/services/content.service';
import { ToastService } from '../../core/services/toast.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-about',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './about.component.html',
})
export class AdminAboutComponent {
  private http = inject(HttpClient);
  content = inject(ContentService);
  private toast = inject(ToastService);

  isSaving = signal(false);
  isDirtyAbout = signal(false);
  isDirtyHero = signal(false);

  aboutForm = { bio: '', highlightsText: '' };
  initialAboutForm: any = {};

  heroForm: any = { title: '', title_highlight: '', title_en: '', title_highlight_en: '', subtitle: '', subtitle_en: '', description: '', description_en: '' };
  initialHeroForm: any = {};

  isDirty = computed(() => this.isDirtyAbout() || this.isDirtyHero());

  constructor() {
    effect(() => {
      const about = this.content.about();
      if (about) { 
        this.aboutForm.bio = about.bio || '';
        this.aboutForm.highlightsText = about.highlights?.join('\n') || '';
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

  checkDirtyAbout() {
    this.isDirtyAbout.set(JSON.stringify(this.aboutForm) !== JSON.stringify(this.initialAboutForm));
  }

  checkDirtyHero() {
    this.isDirtyHero.set(JSON.stringify(this.heroForm) !== JSON.stringify(this.initialHeroForm));
  }

  async save() {
    if (!this.isDirty()) return;
    
    this.isSaving.set(true);
    try {
      const promises = [];
      
      if (this.isDirtyAbout()) {
        const aboutData = { bio: this.aboutForm.bio, highlights: this.aboutForm.highlightsText.split('\n').map(h => h.trim()).filter(h => h) };
        promises.push(
          firstValueFrom(this.http.put('/api/about', aboutData))
            .then(() => {
              this.initialAboutForm = JSON.parse(JSON.stringify(this.aboutForm));
              this.checkDirtyAbout();
            })
        );
      }

      if (this.isDirtyHero()) {
        promises.push(
          firstValueFrom(this.http.put('/api/hero', this.heroForm))
            .then(() => {
              this.initialHeroForm = JSON.parse(JSON.stringify(this.heroForm));
              this.checkDirtyHero();
            })
        );
      }

      await Promise.all(promises);
      await this.content.loadAllContent();
      this.toast.success('Cambios guardados correctamente');
    } catch (e) {
      console.error(e);
      this.toast.error('Error al guardar los cambios');
    } finally {
      this.isSaving.set(false);
    }
  }
}
