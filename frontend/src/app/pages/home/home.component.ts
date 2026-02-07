import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContentService } from '../../core/services/content.service';
import { TranslationService } from '../../core/services/translation.service';

// SVG icons for specialty types (fixed, not editable)
const SPECIALTY_ICONS: Record<string, string> = {
  'frontend': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="M7 8l3 3-3 3M13 14h4" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`,
  'backend': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <circle cx="6" cy="6" r="1" fill="currentColor" />
    <circle cx="6" cy="18" r="1" fill="currentColor" />
    <path d="M10 6h8M10 18h8" stroke-linecap="round" />
  </svg>`,
  'devops': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>`,
  'database': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
  </svg>`,
  'mobile': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M12 18h.01" stroke-linecap="round" />
  </svg>`,
  'cloud': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>`,
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero Section - Full viewport height minus header -->
    <section class="min-h-[calc(100vh-80px)] flex items-center bg-gradient-to-b from-dark-surface via-dark-bg to-dark-bg -mt-20 pt-20">
      <div class="container mx-auto px-6 py-16">
        <div class="max-w-3xl">
          @if (content.hero(); as hero) {
            <p class="text-primary font-mono text-sm tracking-wider mb-4 uppercase">
              {{ i18n.isSpanish() ? hero.subtitle : (hero.subtitle_en || hero.subtitle) }}
            </p>
            <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span class="text-white">{{ i18n.isSpanish() ? hero.title : (hero.title_en || hero.title) }}</span>
              @if (i18n.isSpanish() ? hero.title_highlight : (hero.title_highlight_en || hero.title_highlight); as highlight) {
                <span class="text-primary">, {{ highlight }}</span>
              }
            </h1>
            <p class="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
              {{ i18n.isSpanish() ? hero.description : (hero.description_en || hero.description) }}
            </p>
            <div class="flex flex-wrap gap-4">
              <a routerLink="/projects" 
                 class="px-8 py-4 bg-primary hover:bg-primary-dark text-dark-bg font-semibold rounded-lg transition-all transform hover:scale-105">
                {{ i18n.t('home.cta.projects') }}
              </a>
              <a routerLink="/contact" 
                 class="px-8 py-4 border-2 border-gray-600 hover:border-primary text-gray-300 hover:text-primary rounded-lg transition-all">
                {{ i18n.t('home.cta.contact') }}
              </a>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Especialidades - Dynamic from API -->
    @if (content.specialties().length > 0) {
      <section class="py-24 bg-dark-bg">
        <div class="container mx-auto px-6">
          <h2 class="text-3xl font-bold text-center mb-4 text-white">{{ i18n.t('home.specialties') }}</h2>
          <p class="text-gray-400 text-center mb-16 max-w-2xl mx-auto">{{ i18n.t('home.specialties.subtitle') }}</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (specialty of content.specialties(); track specialty.id) {
              <div class="group p-8 bg-dark-surface rounded-2xl border border-dark-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
                   [class.hover:border-accent-green/50]="specialty.color === 'green'"
                   [class.hover:border-accent-blue/50]="specialty.color === 'blue'">
                <!-- SVG Icon based on icon_type -->
                <div class="w-16 h-16 mb-6 rounded-xl flex items-center justify-center transition-colors"
                     [class.bg-primary/20]="specialty.color === 'primary'"
                     [class.text-primary]="specialty.color === 'primary'"
                     [class.bg-accent-green/20]="specialty.color === 'green'"
                     [class.text-accent-green]="specialty.color === 'green'"
                     [class.bg-accent-blue/20]="specialty.color === 'blue'"
                     [class.text-accent-blue]="specialty.color === 'blue'"
                     [innerHTML]="getIconForType(specialty.icon_type)">
                </div>
                <h3 class="text-xl font-bold text-white mb-4">
                  {{ i18n.isSpanish() ? specialty.title : (specialty.title_en || specialty.title) }}
                </h3>
                <p class="text-gray-400 mb-6">
                  {{ i18n.isSpanish() ? specialty.description : (specialty.description_en || specialty.description) }}
                </p>
                @if (specialty.technologies?.length) {
                  <div class="flex flex-wrap gap-2">
                    @for (tech of specialty.technologies; track tech) {
                      <span class="flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full"
                            [class.bg-primary/10]="specialty.color === 'primary'"
                            [class.text-primary]="specialty.color === 'primary'"
                            [class.bg-accent-green/10]="specialty.color === 'green'"
                            [class.text-accent-green]="specialty.color === 'green'"
                            [class.bg-accent-blue/10]="specialty.color === 'blue'"
                            [class.text-accent-blue]="specialty.color === 'blue'">
                        <img [src]="getTechIcon(tech)" [alt]="tech" class="w-3.5 h-3.5">
                        {{ tech }}
                      </span>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </section>
    }
  `,
})
export class HomeComponent {
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
      'CI/CD': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      'DevExtreme': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg',
      'CodeIgniter': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/codeigniter/codeigniter-plain.svg',
    };
    return iconMap[tech] || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg';
  }
}
