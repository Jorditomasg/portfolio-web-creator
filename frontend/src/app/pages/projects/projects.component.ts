import { Component, inject, OnInit } from '@angular/core';
import { ContentService } from '../../core/services/content.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit {
  content = inject(ContentService);
  i18n = inject(TranslationService);

  ngOnInit() {
    this.content.loadProjects().subscribe();
    this.content.loadTechnologies().subscribe();
    this.content.loadSettings().subscribe();
  }

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
    // 1. Check if we have a defined technology with icon
    const knownTech = this.content.technologies().find(t => t.name.toLowerCase() === tech.toLowerCase());
    if (knownTech && knownTech.icon) {
      return knownTech.icon;
    }

    // 2. Return empty string if not found (matching Home component strictness)
    return '';
  }

  formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    // Capitalize first letter of month
    const fmt = new Intl.DateTimeFormat(this.i18n.isSpanish() ? 'es-ES' : 'en-US', { month: 'short', year: 'numeric' }).format(date);
    return fmt.charAt(0).toUpperCase() + fmt.slice(1);
  }
}
