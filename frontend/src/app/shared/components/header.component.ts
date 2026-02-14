import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { ContentService } from '../../core/services/content.service';
import { TranslationService } from '../../core/services/translation.service';
import { DOCUMENT } from '@angular/common';

// Favicon SVG icons
const FAVICON_ICONS: Record<string, string> = {
  terminal: `<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
  code: `<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></svg>`,
  rocket: `<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  star: `<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`,
  briefcase: `<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>`,
  user: `<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [RouterLink, RouterLinkActive],
})
export class HeaderComponent {
  contentService = inject(ContentService);
  i18n = inject(TranslationService);
  private titleService = inject(Title);
  private document = inject(DOCUMENT);
  private sanitizer = inject(DomSanitizer);
  mobileMenuOpen = signal(false);

  constructor() {
    // Update browser title and favicon when settings change
    effect(() => {
      const title = this.contentService.siteTitle();
      this.titleService.setTitle(title);
      
      const settings = this.contentService.settings();
      if (settings) {
        // Update favicon
        if (settings.favicon_type) {
          this.updateFavicon(settings.favicon_type, settings.accent_color || '#F5A623');
        }
        // Update CSS variables for accent color
        if (settings.accent_color) {
          this.updateAccentColor(settings.accent_color);
        }
      }
    });
  }

  getLogoIcon(): SafeHtml {
    const faviconType = this.contentService.settings()?.favicon_type || 'terminal';
    const svg = FAVICON_ICONS[faviconType] || FAVICON_ICONS['terminal'];
    // We shouldn't need to replace currentColor here because we use text-primary class in HTML
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  updateFavicon(type: string, color: string) {
    const baseSvg = FAVICON_ICONS[type] || FAVICON_ICONS['terminal'];
    const svg = baseSvg.replace('class="w-6 h-6" ', '').replace(/currentColor/g, color);
    const encoded = encodeURIComponent(svg);
    const dataUrl = `data:image/svg+xml,${encoded}`;
    
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel*='icon']");
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'icon';
      this.document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = dataUrl;
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

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
}
