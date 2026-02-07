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
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="fixed top-0 left-0 right-0 z-50 bg-dark-bg/95 backdrop-blur-md border-b border-dark-border">
      <nav class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo with dynamic icon -->
          <a routerLink="/" class="flex items-center gap-3 text-xl font-bold text-white hover:text-primary transition-colors group">
            <span class="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors text-primary"
                  [innerHTML]="getLogoIcon()">
            </span>
            <span class="font-mono">{{ contentService.siteTitle() }}</span>
          </a>

          <!-- Navigation + Language Switch -->
          <div class="hidden md:flex items-center gap-8">
            <ul class="flex items-center gap-8">
              <li>
                <a routerLink="/" routerLinkActive="text-primary" [routerLinkActiveOptions]="{exact: true}"
                   class="text-gray-400 hover:text-white transition-colors font-medium">
                  {{ i18n.t('nav.home') }}
                </a>
              </li>
              <li>
                <a routerLink="/about" routerLinkActive="text-primary"
                   class="text-gray-400 hover:text-white transition-colors font-medium">
                  {{ i18n.t('nav.about') }}
                </a>
              </li>
              <li>
                <a routerLink="/projects" routerLinkActive="text-primary"
                   class="text-gray-400 hover:text-white transition-colors font-medium">
                  {{ i18n.t('nav.projects') }}
                </a>
              </li>
              <li>
                <a routerLink="/contact" routerLinkActive="text-primary"
                   class="text-gray-400 hover:text-white transition-colors font-medium">
                  {{ i18n.t('nav.contact') }}
                </a>
              </li>
              @if (contentService.settings()?.show_admin_link) {
                <li>
                  <a routerLink="/admin/login" 
                     class="flex items-center gap-2 px-3 py-1.5 bg-dark-surface border border-dark-border rounded-lg text-gray-400 hover:text-white hover:border-primary/50 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <span class="text-sm font-medium">Admin</span>
                  </a>
                </li>
              }
            </ul>

            <!-- Language Switch -->
            <button (click)="i18n.toggleLanguage()" 
                    class="flex items-center gap-2 px-3 py-1.5 bg-dark-surface border border-dark-border rounded-lg hover:border-primary/50 transition-colors text-sm">
              <span class="text-gray-400">{{ i18n.currentLang() === 'es' ? '🇪🇸' : '🇬🇧' }}</span>
              <span class="text-white font-medium uppercase">{{ i18n.currentLang() }}</span>
            </button>
          </div>

          <!-- Mobile menu button -->
          <button class="md:hidden text-white" (click)="toggleMobileMenu()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>

        <!-- Mobile menu -->
        @if (mobileMenuOpen()) {
          <div class="md:hidden mt-4 py-4 border-t border-dark-border">
            <ul class="flex flex-col gap-4">
              <li><a routerLink="/" (click)="closeMobileMenu()" class="text-gray-300 hover:text-white">{{ i18n.t('nav.home') }}</a></li>
              <li><a routerLink="/about" (click)="closeMobileMenu()" class="text-gray-300 hover:text-white">{{ i18n.t('nav.about') }}</a></li>
              <li><a routerLink="/projects" (click)="closeMobileMenu()" class="text-gray-300 hover:text-white">{{ i18n.t('nav.projects') }}</a></li>
              <li><a routerLink="/contact" (click)="closeMobileMenu()" class="text-gray-300 hover:text-white">{{ i18n.t('nav.contact') }}</a></li>
              @if (contentService.settings()?.show_admin_link) {
                <li>
                  <a routerLink="/admin/login" (click)="closeMobileMenu()" class="flex items-center gap-2 text-gray-300 hover:text-white">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    Admin
                  </a>
                </li>
              }
            </ul>
            <button (click)="i18n.toggleLanguage()" class="mt-4 px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-white">
              {{ i18n.currentLang() === 'es' ? '🇪🇸 Español' : '🇬🇧 English' }}
            </button>
          </div>
        }
      </nav>
    </header>
  `,
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
      if (settings?.favicon_type) {
        this.updateFavicon(settings.favicon_type, settings.accent_color || '#F5A623');
      }
    });
  }

  getLogoIcon(): SafeHtml {
    const faviconType = this.contentService.settings()?.favicon_type || 'terminal';
    const svg = FAVICON_ICONS[faviconType] || FAVICON_ICONS['terminal'];
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  updateFavicon(type: string, color: string) {
    const baseSvg = FAVICON_ICONS[type] || FAVICON_ICONS['terminal'];
    // Remove class for favicon, replace currentColor with actual color
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

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
}
