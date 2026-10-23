import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastContainerComponent } from '../../shared/components/toast-container.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  content = inject(ContentService);

  links = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/projects', label: 'Projects' },
    { path: '/admin/about', label: 'About me' },
    { path: '/admin/technologies', label: 'Tech stack' },
    { path: '/admin/experience', label: 'Experience' },
    { path: '/admin/settings', label: 'Settings' },
  ];

  constructor() {
    this.content.loadSettings().subscribe();
  }

  logout() {
    this.authService.logout();
  }
}
