import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  content = inject(ContentService);

  stats = computed(() => [
    { label: 'Projects', value: this.content.projects().length, link: '/admin/projects' },
    { label: 'Featured', value: this.content.featuredProjects().length, link: '/admin/projects' },
    { label: 'Technologies', value: this.content.technologies().length, link: '/admin/technologies' },
    { label: 'Experiences', value: this.content.experiences().length, link: '/admin/experience' },
  ]);

  actions = [
    { label: 'New project', link: '/admin/projects' },
    { label: 'Edit about me', link: '/admin/about' },
    { label: 'Manage tech stack', link: '/admin/technologies' },
    { label: 'Add experience', link: '/admin/experience' },
    { label: 'Site settings', link: '/admin/settings' },
  ];

  ngOnInit() {
    this.content.loadProjects().subscribe();
    this.content.loadTechnologies().subscribe();
    this.content.loadExperiences().subscribe();
  }
}
