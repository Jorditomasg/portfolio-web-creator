import { Component, inject, signal, effect, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize, switchMap } from 'rxjs';
import { ContentService } from '../../core/services/content.service';
import { ToastService } from '../../core/services/toast.service';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';

@Component({
  selector: 'app-admin-settings',
  imports: [FormsModule, FileUploadComponent],
  templateUrl: './settings.component.html',
})
export class AdminSettingsComponent implements OnInit {
  private http = inject(HttpClient);
  content = inject(ContentService);
  private toast = inject(ToastService);

  ngOnInit() {
    this.content.loadSettings().subscribe();
  }

  isSaving = signal(false);
  isDirty = signal(false);
  initialForm: any = {};

  faviconOptions = [
    { value: 'terminal', label: 'Terminal', emoji: '💻' },
    { value: 'code', label: 'Code', emoji: '</>' },
    { value: 'rocket', label: 'Rocket', emoji: '🚀' },
    { value: 'star', label: 'Star', emoji: '⭐' },
    { value: 'briefcase', label: 'Briefcase', emoji: '💼' },
    { value: 'user', label: 'User', emoji: '👤' },
  ];

  accentColors = [
    { value: '#F5A623', label: 'Yellow' },
    { value: '#10B981', label: 'Green' },
    { value: '#3B82F6', label: 'Blue' },
    { value: '#8B5CF6', label: 'Purple' },
    { value: '#EC4899', label: 'Pink' },
    { value: '#EF4444', label: 'Red' },
  ];

  form: any = { 
    site_title: '', main_photo_url: '', meta_description: '', seo_image_url: '', hero_background_url: '',
    linkedin_url: '', github_url: '', email: '',
    favicon_type: 'terminal', accent_color: '#F5A623', show_admin_link: false,
    umami_url: '', umami_website_id: ''
  };

  constructor() {
    effect(() => {
      const settings = this.content.settings();
      if (settings) {
        this.form.site_title = settings.site_title || '';
        this.form.main_photo_url = settings.main_photo_url || '';
        this.form.hero_background_url = settings.hero_background_url || '';
        this.form.meta_description = settings.meta_description || '';
        this.form.seo_image_url = settings.seo_image_url || '';
        this.form.linkedin_url = settings.linkedin_url || '';
        this.form.github_url = settings.github_url || '';
        this.form.email = settings.email || '';
        this.form.favicon_type = settings.favicon_type || 'terminal';
        this.form.accent_color = settings.accent_color || '#F5A623';
        this.form.show_admin_link = settings.show_admin_link || false;
        
        this.form.umami_url = settings.umami_url || '';
        this.form.umami_website_id = settings.umami_website_id || '';

        this.initialForm = JSON.parse(JSON.stringify(this.form));
        this.checkDirty();
      }
    }, { allowSignalWrites: true });
  }

  save() {
    this.isSaving.set(true);

    const data = {
      site_title: this.form.site_title,
      main_photo_url: this.form.main_photo_url || null,
      hero_background_url: this.form.hero_background_url || null,
      seo_image_url: this.form.seo_image_url || null,
      meta_description: this.form.meta_description,
      linkedin_url: this.form.linkedin_url || null,
      github_url: this.form.github_url || null,
      email: this.form.email || null,
      favicon_type: this.form.favicon_type,
      accent_color: this.form.accent_color,
      show_admin_link: this.form.show_admin_link,
      
      umami_url: this.form.umami_url || null,
      umami_website_id: this.form.umami_website_id || null,
    };

    this.http.put('/api/settings', data).pipe(
      switchMap(() => this.content.loadSettings(true)),
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: () => {
        this.initialForm = JSON.parse(JSON.stringify(this.form));
        this.checkDirty();
        this.toast.success('Settings saved successfully');
      },
      error: (err) => {
        console.error('Error saving settings', err);
        this.toast.error('Error saving settings');
      }
    });
  }
  
  checkDirty() {
    this.isDirty.set(JSON.stringify(this.form) !== JSON.stringify(this.initialForm));
  }
  
}
