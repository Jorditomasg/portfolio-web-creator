import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContentService } from '../../core/services/content.service';
import { TranslationService } from '../../core/services/translation.service';

// SVG icons for specialty types (fixed, not editable)
const SPECIALTY_ICONS: Record<string, string> = {
  'frontend': `<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="M7 8l3 3-3 3M13 14h4" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`,
  'tools': `<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>`,
  'backend': `<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <circle cx="6" cy="6" r="1" fill="currentColor" />
    <circle cx="6" cy="18" r="1" fill="currentColor" />
    <path d="M10 6h8M10 18h8" stroke-linecap="round" />
  </svg>`,
  'devops': `<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>`,
  'database': `<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
  </svg>`,
  'mobile': `<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M12 18h.01" stroke-linecap="round" />
  </svg>`,
  'cloud': `<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>`,
  'design': `<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 19l7-7 3 3-7 7-3-3z"/>
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
    <path d="M2 2l7.586 7.586"/>
    <circle cx="11" cy="11" r="2"/>
  </svg>`,
  'security': `<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 1l10 5v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V6l9-5z"/>
  </svg>`,
  'testing': `<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>`,
  'ai': `<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V11a2 2 0 1 1-2 0V5.73C10.4 5.39 10 4.74 10 4a2 2 0 0 1 2-2z"/>
    <path d="M12 13v8"/>
    <path d="M12 18l-5-3"/>
    <path d="M12 18l5-3"/>
  </svg>`,
  'blockchain': `<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>`,
  'game': `<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M6 12h4m-2-2v4" />
    <circle cx="15" cy="11" r="1" />
    <circle cx="17" cy="13" r="1" />
  </svg>`,
  'desktop': `<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>`,
  'other': `<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>`,
};

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <!-- Hero Section -->
    <section class="py-20 bg-dark-surface -mt-20 pt-40">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl">
          <h1 class="text-4xl md:text-5xl font-bold mb-6 text-white">{{ i18n.t('about.title') }}</h1>
          <p class="text-xl text-gray-400">{{ i18n.t('about.subtitle') }}</p>
        </div>
      </div>
    </section>

    <!-- Main Content: Bio + Skills -->
    <section class="py-24">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <!-- Left: Bio & Specialties -->
          <div class="lg:col-span-7">
            @if (content.about(); as about) {
              <!-- Bio -->
              <div class="mb-12">
                <h2 class="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <span class="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </span>
                  {{ i18n.t('about.who') }}
                </h2>
                <p class="text-gray-300 leading-relaxed text-lg">
                  {{ i18n.isSpanish() ? about.bio : (about.bio_en || about.bio) }}
                </p>
              </div>

              <!-- Highlights -->
              @if ((i18n.isSpanish() ? about.highlights : (about.highlights_en && about.highlights_en.length ? about.highlights_en : about.highlights)).length) {
                <div class="mb-12">
                  <h3 class="text-xl font-semibold text-white mb-6">{{ i18n.t('about.highlights') }}</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    @for (highlight of (i18n.isSpanish() ? about.highlights : (about.highlights_en && about.highlights_en.length ? about.highlights_en : about.highlights)); track $index) {
                      <div class="flex items-start gap-3 p-4 bg-dark-surface rounded-xl border border-dark-border">
                        <span class="w-6 h-6 bg-primary/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                        </span>
                        <span class="text-gray-300">{{ highlight }}</span>
                      </div>
                    }
                  </div>
                </div>
              }
            }

            <!-- Specialties (Dynamic from Categories) -->
            <div>
              <h3 class="text-xl font-semibold text-white mb-6">{{ i18n.t('about.specialties') }}</h3>
              <div class="space-y-4">
                @for (group of content.specialtyCategories(); track group.category.id) {
                  <div class="p-6 bg-dark-surface rounded-xl border border-dark-border transition-colors hover:border-[var(--category-color)]"
                       [style.borderColor]="'transparent'" 
                       [style.--category-color]="group.category.color">
                    <div class="flex items-center gap-4 mb-3">
                      <span class="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary"
                            [style.color]="group.category.color"
                            [style.backgroundColor]="group.category.color + '20'"
                            [innerHTML]="getIconForType(group.category.icon)">
                      </span>
                      <h4 class="text-lg font-bold text-white">
                        {{ i18n.isSpanish() ? (group.category.long_title || group.category.name) : (group.category.long_title_en || group.category.long_title || group.category.name) }}
                      </h4>
                    </div>
                    <p class="text-gray-400">
                      {{ i18n.isSpanish() ? (group.category.description || '') : (group.category.description_en || group.category.description || '') }}
                    </p>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Right: Technical Skills -->
          <div class="lg:col-span-5">
            <div class="sticky top-28">
              <h2 class="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span class="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531"/>
                  </svg>
                </span>
                {{ i18n.t('about.skills') }}
              </h2>

              <div class="space-y-6">
                @for (group of content.skillsByCategory(); track group.category.id) {
                  <div class="bg-dark-surface p-6 rounded-xl border border-dark-border">
                    <h3 class="text-lg font-semibold mb-4" [style.color]="group.category.color">
                      {{ i18n.isSpanish() ? (group.category.short_title || group.category.name) : (group.category.short_title_en || group.category.name) }}
                    </h3>
                    <div class="space-y-3">
                      @for (skill of group.skills; track skill.id) {
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-2">
                            <img [src]="skill.icon" [alt]="skill.name" class="w-5 h-5 object-contain">
                            <span class="text-gray-300">{{ skill.name }}</span>
                          </div>
                          <div class="flex gap-1">
                            @for (_ of [1,2,3,4,5]; track $index; let i = $index) {
                              <span class="w-2 h-2 rounded-full transition-colors" 
                                    [class]="i < skill.level ? '' : 'bg-dark-border'"
                                    [style.backgroundColor]="i < skill.level ? group.category.color : ''"></span>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Timeline -->
    <section class="py-24 bg-dark-surface">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold mb-12 text-center text-white">{{ i18n.t('about.experience') }}</h2>

        <div class="max-w-3xl mx-auto space-y-8">
          @for (exp of content.experiences(); track exp.id) {
            <div class="relative pl-8 border-l-2 border-dark-border hover:border-primary transition-colors">
              <div class="absolute left-0 top-0 w-4 h-4 -translate-x-1/2 bg-primary rounded-full"></div>
              <div class="bg-dark-bg p-6 rounded-xl border border-dark-border hover:border-primary/50 transition-colors">
                <div class="flex flex-wrap justify-between items-start mb-2 gap-2">
                  <h3 class="text-xl font-bold text-white">{{ exp.title }}</h3>
                  <span class="text-primary text-sm font-mono bg-primary/10 px-3 py-1 rounded-full">{{ exp.period }}</span>
                </div>
                <p class="text-gray-400 mb-4">{{ exp.company }}</p>
                <p class="text-gray-300 mb-4">{{ exp.description }}</p>
                @if (exp.achievements.length) {
                  <ul class="space-y-2">
                    @for (achievement of exp.achievements; track $index) {
                      <li class="flex items-start gap-2 text-sm text-gray-400">
                        <span class="text-primary mt-1">▸</span>
                        {{ achievement }}
                      </li>
                    }
                  </ul>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class AboutComponent {
  content = inject(ContentService);
  i18n = inject(TranslationService);
  private sanitizer = inject(DomSanitizer);

  getIconForType(type: string | undefined): SafeHtml {
    if (!type) {
        return this.sanitizer.bypassSecurityTrustHtml(SPECIALTY_ICONS['frontend']);
    }
    const knownIcon = SPECIALTY_ICONS[type.toLowerCase()];
    if (knownIcon) {
        return this.sanitizer.bypassSecurityTrustHtml(knownIcon);
    }
    return this.sanitizer.bypassSecurityTrustHtml(type);
  }

  getTechIcon(tech: string): string {
    // 1. Check if we have a defined technology with icon
    const knownTech = this.content.technologies().find(t => t.name.toLowerCase() === tech.toLowerCase());
    if (knownTech && knownTech.icon) {
      return knownTech.icon;
    }

    // 2. Return empty string if not found
    return '';
  }
}
