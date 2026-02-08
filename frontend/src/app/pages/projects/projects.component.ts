import { Component, inject } from '@angular/core';
import { ContentService } from '../../core/services/content.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  template: `
    <section class="py-20 bg-dark-surface -mt-20 pt-40">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl">
          <h1 class="text-4xl md:text-5xl font-bold mb-6 text-white">{{ i18n.t('projects.title') }}</h1>
          <p class="text-xl text-gray-400">{{ i18n.t('projects.subtitle') }}</p>
        </div>
      </div>
    </section>

    <section class="py-24">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (project of getSortedProjects(); track project.id) {
            <article class="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer relative"
                     [class]="project.featured 
                       ? 'bg-gradient-to-br from-primary/20 via-dark-surface to-dark-surface border-2 border-primary/50 shadow-lg shadow-primary/10' 
                       : 'bg-dark-surface border border-dark-border hover:border-primary/50'"
                     (click)="openProject(project)">
              
              <!-- Featured Badge -->
              @if (project.featured) {
                <div class="absolute top-3 right-3 z-10 px-2 py-1 bg-dark-surface/90 border border-primary/50 text-primary text-xs font-bold rounded-full flex items-center gap-1">
                  <span class="text-current">⭐</span> Destacado
                </div>
              }
              
              <!-- In Progress Badge -->
              @if (project.is_in_progress) {
                <div class="absolute top-3 z-10 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center gap-1"
                     [class]="project.featured ? 'left-3' : 'right-3'">
                  🔨 En desarrollo
                </div>
              }

              @if (project.image_url) {
                <div class="aspect-video bg-dark-bg overflow-hidden">
                  <img [src]="project.image_url" [alt]="project.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                </div>
              } @else {
                <div class="aspect-video bg-gradient-to-br from-primary/20 to-dark-bg flex items-center justify-center">
                  <span class="text-6xl opacity-50">📁</span>
                </div>
              }
              <div class="p-6">
                <h3 class="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  {{ i18n.isSpanish() ? project.title : (project.title_en || project.title) }}
                </h3>
                <p class="text-gray-400 mb-4 line-clamp-2">
                  {{ i18n.isSpanish() ? project.description : (project.description_en || project.description) }}
                </p>
                
                <!-- Technologies -->
                <div class="flex flex-wrap gap-2 mb-6">
                  @for (tech of project.technologies.slice(0, 5); track tech) {
                    <span class="flex items-center gap-1 px-2 py-1 bg-dark-bg text-xs text-gray-300 rounded-lg border border-dark-border">
                      <img [src]="getTechIcon(tech)" [alt]="tech" class="w-3.5 h-3.5">
                      {{ tech }}
                    </span>
                  }
                </div>

                <!-- Links -->
                <div class="flex gap-3" (click)="$event.stopPropagation()">
                  @if (project.demo_url) {
                    <a [href]="project.demo_url" target="_blank" rel="noopener"
                       class="flex-1 py-2 text-center bg-primary hover:bg-primary-dark text-dark-bg font-medium rounded-lg transition-colors text-sm">
                      {{ i18n.t('projects.demo') }}
                    </a>
                  }
                  @if (project.github_url) {
                    <a [href]="project.github_url" target="_blank" rel="noopener"
                       class="flex-1 py-2 text-center border border-dark-border hover:border-primary text-gray-300 hover:text-primary rounded-lg transition-colors text-sm">
                      {{ i18n.t('projects.code') }}
                    </a>
                  }
                </div>
              </div>
            </article>
          } @empty {
            <div class="col-span-full text-center py-20 text-gray-400">
              {{ i18n.t('projects.empty') }}
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class ProjectsComponent {
  content = inject(ContentService);
  i18n = inject(TranslationService);

  openProject(project: any) {
    // Open demo_url first, fallback to github_url
    const url = project.demo_url || project.github_url;
    if (url) {
      window.open(url, '_blank', 'noopener');
    }
  }

  getSortedProjects() {
    const projects = [...this.content.projects()];
    // Sort by display_order only (set via admin drag-and-drop)
    return projects.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
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
      'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
    };
    return iconMap[tech] || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg';
  }
}
