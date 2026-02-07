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
              @if ((i18n.isSpanish() ? about.highlights : (about.highlights_en && about.highlights_en.length ? about.highlights_en : about.highlights))?.length) {
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

            <!-- Specialties -->
            <div>
              <h3 class="text-xl font-semibold text-white mb-6">{{ i18n.t('about.specialties') }}</h3>
              <div class="space-y-4">
                @for (specialty of content.specialties(); track specialty.id) {
                  <div class="p-6 bg-dark-surface rounded-xl border border-dark-border hover:border-primary/50 transition-colors"
                       [class.hover:border-accent-green/50]="specialty.color === 'green'"
                       [class.hover:border-accent-blue/50]="specialty.color === 'blue'">
                    <div class="flex items-center gap-4 mb-3">
                      <span class="w-12 h-12 rounded-xl flex items-center justify-center"
                            [class.bg-primary/20]="specialty.color === 'primary'"
                            [class.text-primary]="specialty.color === 'primary'"
                            [class.bg-accent-green/20]="specialty.color === 'green'"
                            [class.text-accent-green]="specialty.color === 'green'"
                            [class.bg-accent-blue/20]="specialty.color === 'blue'"
                            [class.text-accent-blue]="specialty.color === 'blue'"
                            [innerHTML]="getIconForType(specialty.icon_type)">
                      </span>
                      <h4 class="text-lg font-bold text-white">
                        {{ i18n.isSpanish() ? specialty.title : (specialty.title_en || specialty.title) }}
                      </h4>
                    </div>
                    <p class="text-gray-400">
                      {{ i18n.isSpanish() ? specialty.description : (specialty.description_en || specialty.description) }}
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
                <!-- Frontend -->
                <div class="bg-dark-surface p-6 rounded-xl border border-dark-border">
                  <h3 class="text-lg font-semibold text-primary mb-4">{{ i18n.t('about.frontend') }}</h3>
                  <div class="space-y-3">
                    @for (skill of content.skillsByCategory().frontend; track skill.id) {
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <img [src]="getTechIcon(skill.name)" [alt]="skill.name" class="w-5 h-5">
                          <span class="text-gray-300">{{ skill.name }}</span>
                        </div>
                        <div class="flex gap-1">
                          @for (_ of [1,2,3,4,5]; track $index; let i = $index) {
                            <span class="w-2 h-2 rounded-full transition-colors" 
                                  [class]="i < skill.level ? 'bg-primary' : 'bg-dark-border'"></span>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>

                <!-- Backend -->
                <div class="bg-dark-surface p-6 rounded-xl border border-dark-border">
                  <h3 class="text-lg font-semibold text-accent-green mb-4">{{ i18n.t('about.backend') }}</h3>
                  <div class="space-y-3">
                    @for (skill of content.skillsByCategory().backend; track skill.id) {
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <img [src]="getTechIcon(skill.name)" [alt]="skill.name" class="w-5 h-5">
                          <span class="text-gray-300">{{ skill.name }}</span>
                        </div>
                        <div class="flex gap-1">
                          @for (_ of [1,2,3,4,5]; track $index; let i = $index) {
                            <span class="w-2 h-2 rounded-full transition-colors" 
                                  [class]="i < skill.level ? 'bg-accent-green' : 'bg-dark-border'"></span>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>

                <!-- Tools -->
                <div class="bg-dark-surface p-6 rounded-xl border border-dark-border">
                  <h3 class="text-lg font-semibold text-accent-blue mb-4">{{ i18n.t('about.tools') }}</h3>
                  <div class="space-y-3">
                    @for (skill of content.skillsByCategory().tools; track skill.id) {
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <img [src]="getTechIcon(skill.name)" [alt]="skill.name" class="w-5 h-5">
                          <span class="text-gray-300">{{ skill.name }}</span>
                        </div>
                        <div class="flex gap-1">
                          @for (_ of [1,2,3,4,5]; track $index; let i = $index) {
                            <span class="w-2 h-2 rounded-full transition-colors" 
                                  [class]="i < skill.level ? 'bg-accent-blue' : 'bg-dark-border'"></span>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>
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
                @if (exp.achievements?.length) {
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

  getIconForType(type: string): SafeHtml {
    const svg = SPECIALTY_ICONS[type] || SPECIALTY_ICONS['frontend'];
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getTechIcon(tech: string): string {
    const iconMap: Record<string, string> = {
      'Angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
      'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'Vue': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
      'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      'NestJS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg',
      'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      'Tailwind': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
      'Bootstrap': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
      'Material': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg',
      'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      'Spring Boot': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
      'Laravel': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg',
      'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
      'Jenkins': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg',
      'English': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg',
      'DevExtreme': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg',
      'CodeIgniter': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/codeigniter/codeigniter-plain.svg',
    };
    return iconMap[tech] || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg';
  }
}
