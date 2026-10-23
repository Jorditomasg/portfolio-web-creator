import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  imports: [DatePipe, DecimalPipe],
})
export class AboutComponent implements OnInit {
  content = inject(ContentService);
  levels = [1, 2, 3, 4, 5];

  ngOnInit() {
    this.content.loadAbout().subscribe();
    this.content.loadExperiences().subscribe();
    this.content.loadTechnologies().subscribe();
    this.content.loadCategories().subscribe();
    this.content.loadSettings().subscribe();
  }
}
