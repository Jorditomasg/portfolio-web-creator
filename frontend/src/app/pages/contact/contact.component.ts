import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../../core/services/content.service';
import { TranslationService } from '../../core/services/translation.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  private http = inject(HttpClient);
  content = inject(ContentService);
  i18n = inject(TranslationService);
  
  isSubmitting = signal(false);
  submitted = signal(false);
  error = signal<string | null>(null);
  form = { name: '', email: '', subject: '', message: '' };

  async submitForm() {
    this.isSubmitting.set(true);
    this.error.set(null);
    try {
      await firstValueFrom(this.http.post('/api/contact', this.form));
      this.submitted.set(true);
      this.form = { name: '', email: '', subject: '', message: '' };
      setTimeout(() => this.submitted.set(false), 5000);
    } catch (err: any) {
      console.error('Error sending message', err);
      // Determine error message based on language
      const isSpanish = this.i18n.isSpanish();
      if (err.status === 429) {
        this.error.set(isSpanish ? 'Demasiados intentos. Por favor, inténtalo más tarde.' : 'Too many attempts. Please try again later.');
      } else {
        this.error.set(isSpanish ? 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.' : 'Error sending message. Please try again.');
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
