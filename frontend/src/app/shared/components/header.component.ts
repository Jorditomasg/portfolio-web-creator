import { Component, inject, effect } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ContentService } from '../../core/services/content.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [RouterLink, RouterLinkActive],
})
export class HeaderComponent {
  contentService = inject(ContentService);
  private titleService = inject(Title);
  private document = inject(DOCUMENT);

  links = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  constructor() {
    // Update browser title and favicon when settings change
    effect(() => {
      const title = this.contentService.siteTitle();
      this.titleService.setTitle(title);
      
      const settings = this.contentService.settings();
      if (settings) {
        // Update favicon
        const icon = this.document.querySelector<HTMLLinkElement>("link[rel='icon'][type='image/svg+xml']");
        if (icon) icon.href = `/api/favicon.svg?v=${encodeURIComponent(settings.favicon_type + settings.accent_color)}`;
        // Update CSS variables for accent color
        if (settings.accent_color) {
          this.updateAccentColor(settings.accent_color);
        }
      }
    });
  }

  updateAccentColor(color: string) {
    const root = this.document.documentElement;
    root.style.setProperty('--color-primary', color);
    
    // Convert hex to RGB for opacity utilities
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
    root.style.setProperty('--color-primary-rgb', `${r}, ${g}, ${b}`);
    
    // Calculate a darker shade
    // Simple darkening logic (reduce RGB by 20%)
    const darkR = Math.max(0, Math.floor(r * 0.8));
    const darkG = Math.max(0, Math.floor(g * 0.8));
    const darkB = Math.max(0, Math.floor(b * 0.8));
    root.style.setProperty('--color-primary-dark', `rgb(${darkR}, ${darkG}, ${darkB})`);
  }
}
