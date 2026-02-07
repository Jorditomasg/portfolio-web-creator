import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../core/services/content.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  template: `
    <!-- Hero Section -->
    <section class="py-20 bg-dark-surface -mt-20 pt-40">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl">
          <h1 class="text-4xl md:text-5xl font-bold mb-6 text-white">{{ i18n.t('contact.title') }}</h1>
          <p class="text-xl text-gray-400">{{ i18n.t('contact.subtitle') }}</p>
        </div>
      </div>
    </section>

    <!-- Contact Content -->
    <section class="py-24">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <!-- Contact Form -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-8">{{ i18n.t('contact.form.title') }}</h2>
            <form (ngSubmit)="submitForm()" class="space-y-6">
              <div>
                <label class="block text-sm text-gray-400 mb-2">{{ i18n.t('contact.form.name') }}</label>
                <input [(ngModel)]="form.name" name="name" required
                       class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:border-primary outline-none text-white transition-colors">
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">{{ i18n.t('contact.form.email') }}</label>
                <input [(ngModel)]="form.email" name="email" type="email" required
                       class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:border-primary outline-none text-white transition-colors">
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">{{ i18n.t('contact.form.subject') }}</label>
                <input [(ngModel)]="form.subject" name="subject"
                       class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:border-primary outline-none text-white transition-colors">
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">{{ i18n.t('contact.form.message') }}</label>
                <textarea [(ngModel)]="form.message" name="message" rows="5" required
                          class="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg focus:border-primary outline-none text-white resize-none transition-colors"></textarea>
              </div>
              <button type="submit" [disabled]="isSubmitting()"
                      class="w-full py-4 bg-primary hover:bg-primary-dark disabled:opacity-50 text-dark-bg font-semibold rounded-lg transition-all transform hover:scale-[1.02]">
                {{ isSubmitting() ? i18n.t('contact.form.sending') : i18n.t('contact.form.send') }}
              </button>
              @if (submitted()) {
                <div class="p-4 bg-green-500/20 text-green-400 rounded-lg text-center border border-green-500/30">
                  ✓ {{ i18n.t('contact.form.success') }}
                </div>
              }
            </form>
          </div>

          <!-- Contact Info -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-8">{{ i18n.t('contact.direct') }}</h2>

            @if (content.settings(); as settings) {
              <div class="space-y-6">
                @if (settings.email) {
                  <a [href]="'mailto:' + settings.email" 
                     class="flex items-center gap-4 p-6 bg-dark-surface rounded-xl border border-dark-border hover:border-primary/50 transition-colors group">
                    <div class="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-gray-400 text-sm">Email</p>
                      <p class="text-white font-medium">{{ settings.email }}</p>
                    </div>
                  </a>
                }

                @if (settings.linkedin_url) {
                  <a [href]="settings.linkedin_url" target="_blank" rel="noopener"
                     class="flex items-center gap-4 p-6 bg-dark-surface rounded-xl border border-dark-border hover:border-accent-blue/50 transition-colors group">
                    <div class="w-14 h-14 bg-accent-blue/20 rounded-xl flex items-center justify-center group-hover:bg-accent-blue/30 transition-colors">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" class="w-7 h-7">
                    </div>
                    <div>
                      <p class="text-gray-400 text-sm">LinkedIn</p>
                      <p class="text-white font-medium">{{ i18n.t('contact.linkedin') }}</p>
                    </div>
                  </a>
                }

                @if (settings.github_url) {
                  <a [href]="settings.github_url" target="_blank" rel="noopener"
                     class="flex items-center gap-4 p-6 bg-dark-surface rounded-xl border border-dark-border hover:border-gray-500/50 transition-colors group">
                    <div class="w-14 h-14 bg-gray-700/50 rounded-xl flex items-center justify-center group-hover:bg-gray-600/50 transition-colors">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" class="w-7 h-7 invert">
                    </div>
                    <div>
                      <p class="text-gray-400 text-sm">GitHub</p>
                      <p class="text-white font-medium">{{ i18n.t('contact.github') }}</p>
                    </div>
                  </a>
                }
              </div>

              @if (!settings.email && !settings.linkedin_url && !settings.github_url) {
                <p class="text-gray-400">{{ i18n.t('contact.empty') }}</p>
              }
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ContactComponent {
  content = inject(ContentService);
  i18n = inject(TranslationService);
  
  isSubmitting = signal(false);
  submitted = signal(false);
  form = { name: '', email: '', subject: '', message: '' };

  async submitForm() {
    this.isSubmitting.set(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.isSubmitting.set(false);
    this.submitted.set(true);
    this.form = { name: '', email: '', subject: '', message: '' };
    setTimeout(() => this.submitted.set(false), 5000);
  }
}
