import { Component, inject, OnInit } from '@angular/core';
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

  ngOnInit() {
    this.content.loadProjects().subscribe();
    this.content.loadTechnologies().subscribe();
    this.content.loadExperiences().subscribe();
  }
}
