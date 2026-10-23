import { Component, computed, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  imports: [DatePipe],
})
export class ProjectsComponent implements OnInit {
  content = inject(ContentService);

  featured = computed(() => this.content.sortedProjects().find(p => p.featured));
  rest = computed(() => this.content.sortedProjects().filter(p => p !== this.featured()));

  ngOnInit() {
    this.content.loadProjects().subscribe();
    this.content.loadSettings().subscribe();
  }
}
