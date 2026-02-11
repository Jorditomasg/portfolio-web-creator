import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../../core/services/content.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  content = inject(ContentService);
  private http = inject(HttpClient);

  unreadMessages = signal(0);
  totalMessages = signal(0);

  ngOnInit() {
    this.content.loadProjects().subscribe();
    this.content.loadTechnologies().subscribe();
    this.content.loadExperiences().subscribe();
    this.fetchMessages();
  }

  fetchMessages() {
    this.http.get<any[]>('/api/admin/contacts').subscribe({
      next: (messages) => {
        this.totalMessages.set(messages.length);
        this.unreadMessages.set(messages.filter(m => !m.read).length);
      },
      error: (e) => console.error('Error loading messages stats', e)
    });
  }
}
