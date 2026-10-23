import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { Technology } from '../../core/models/technology.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [RouterLink, DatePipe, DecimalPipe],
})
export class HomeComponent implements OnInit {
  content = inject(ContentService);

  ngOnInit() {
    this.content.loadHero().subscribe();
    this.content.loadProjects().subscribe();
    this.content.loadExperiences().subscribe();
    this.content.loadTechnologies().subscribe();
    this.content.loadCategories().subscribe();
    this.content.loadSettings().subscribe();
  }

  skillNames(skills: Technology[]): string {
    return skills.slice(0, 6).map(s => s.name).join(' / ');
  }
}
