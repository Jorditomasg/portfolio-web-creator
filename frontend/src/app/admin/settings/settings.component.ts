import { Component, inject, signal, effect, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, finalize, switchMap } from 'rxjs';
import { ContentService } from '../../core/services/content.service';
import { ToastService } from '../../core/services/toast.service';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
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
  isSendingTest = signal(false);
  isDirty = signal(false);
  initialForm: any = {};

  faviconOptions = [
    { value: 'terminal', label: 'Terminal', emoji: '💻' },
    { value: 'code', label: 'Código', emoji: '</>' },
    { value: 'rocket', label: 'Cohete', emoji: '🚀' },
    { value: 'star', label: 'Estrella', emoji: '⭐' },
    { value: 'briefcase', label: 'Maletín', emoji: '💼' },
    { value: 'user', label: 'Usuario', emoji: '👤' },
  ];

  accentColors = [
    { value: '#F5A623', label: 'Amarillo' },
    { value: '#10B981', label: 'Verde' },
    { value: '#3B82F6', label: 'Azul' },
    { value: '#8B5CF6', label: 'Morado' },
    { value: '#EC4899', label: 'Rosa' },
    { value: '#EF4444', label: 'Rojo' },
  ];

  form: any = { 
    site_title: '', main_photo_url: '', meta_description: '', seo_image_url: '', hero_background_url: '',
    linkedin_url: '', github_url: '', email: '',
    favicon_type: 'terminal', accent_color: '#F5A623', show_admin_link: false,
    enable_contact_form: true, enable_email_sending: false, enable_database_storage: true,
    smtp_host: '', smtp_port: 587, smtp_user: '', smtp_pass: '', smtp_secure: false, smtp_require_tls: true, smtp_from: ''
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
        
        // Contact & SMTP
        this.form.enable_contact_form = settings.enable_contact_form ?? true;
        this.form.enable_email_sending = settings.enable_email_sending ?? false;
        this.form.enable_database_storage = settings.enable_database_storage ?? true;
        this.form.smtp_host = settings.smtp_host || '';
        this.form.smtp_port = settings.smtp_port || 587;
        this.form.smtp_user = settings.smtp_user || '';
        this.form.smtp_pass = settings.smtp_pass || '';
        this.form.smtp_secure = settings.smtp_secure ?? false;
        this.form.smtp_require_tls = settings.smtp_require_tls ?? true;
        this.form.smtp_from = settings.smtp_from || '';

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
      
      enable_contact_form: this.form.enable_contact_form,
      enable_email_sending: this.form.enable_email_sending,
      enable_database_storage: this.form.enable_database_storage,
      smtp_host: this.form.smtp_host || null,
      smtp_port: this.form.smtp_port || 587,
      smtp_user: this.form.smtp_user || null,
      smtp_pass: this.form.smtp_pass || null,
      smtp_secure: this.form.smtp_secure,
      smtp_require_tls: this.form.smtp_require_tls,
      smtp_from: this.form.smtp_from || null,
    };

    this.http.put('/api/settings', data).pipe(
      switchMap(() => this.content.loadSettings(true)),
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: () => {
        this.initialForm = JSON.parse(JSON.stringify(this.form));
        this.checkDirty();
        this.toast.success('Configuración guardada correctamente');
      },
      error: (err) => {
        console.error('Error saving settings', err);
        this.toast.error('Error al guardar la configuración');
      }
    });
  }
  
  checkDirty() {
    this.isDirty.set(JSON.stringify(this.form) !== JSON.stringify(this.initialForm));
  }
  
  onContactFormToggle() {
    if (!this.form.enable_contact_form) {
      this.form.enable_email_sending = false;
      this.form.enable_database_storage = false;
    }
  }

  sendTestEmail() {
    this.isSendingTest.set(true);
    
    // First save settings to ensure backend has latest config to test with
    // Or we could pass current form data to test endpoint. 
    // Let's passed form data since we might want to test without saving yet?
    // Actually usually user saves first. Let's send current form data to the test endpoint.
    const data = {
      host: this.form.smtp_host,
      port: this.form.smtp_port,
      user: this.form.smtp_user,
      pass: this.form.smtp_pass,
      secure: this.form.smtp_secure,
      require_tls: this.form.smtp_require_tls,
      from: this.form.smtp_from,
      to: this.form.email // Send to the configured contact email or logged in user? 
                          // Using contact email if available, otherwise maybe alert user.
    };
    
    if (!data.to) {
      this.toast.error('Configura un "Email de Contacto" para recibir la prueba');
      this.isSendingTest.set(false);
      return;
    }

    this.http.post('/api/admin/contact/test-email', data)
      .pipe(finalize(() => this.isSendingTest.set(false)))
      .subscribe({
        next: () => this.toast.success(`Correo de prueba enviado a ${data.to}`),
        error: (err: any) => {
          console.error('Error sending test email', err);
          const errorMsg = err.error?.message || 'Error al enviar correo de prueba';
          this.toast.error(errorMsg);
        }
      });
  }
}
