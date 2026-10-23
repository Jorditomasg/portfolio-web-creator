import { Component, computed, inject, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { Project } from '../../core/models/api.models';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit {
  content = inject(ContentService);

  featured = computed(() => this.content.sortedProjects().find(p => p.featured));
  rest = computed(() => this.content.sortedProjects().filter(p => p !== this.featured()));

  ngOnInit() {
    this.content.loadProjects().subscribe();
    this.content.loadSettings().subscribe();
  }

  period(project: Project): string {
    if (!project.start_date) return '';
    const fmt = (d: string) => formatDate(d, 'MMM y', 'en-US');
    const end = project.is_in_progress ? 'Present' : project.end_date ? fmt(project.end_date) : '';
    return end ? `${fmt(project.start_date)} — ${end}` : fmt(project.start_date);
  }
}
