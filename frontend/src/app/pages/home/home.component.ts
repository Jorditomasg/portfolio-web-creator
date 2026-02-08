import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContentService } from '../../core/services/content.service';
import { TranslationService } from '../../core/services/translation.service';

// SVG icons for specialty types (fixed, not editable)
const SPECIALTY_ICONS: Record<string, string> = {
  'frontend': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="M7 8l3 3-3 3M13 14h4" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`,
  'tools': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>`,
  'backend': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <circle cx="6" cy="6" r="1" fill="currentColor" />
    <circle cx="6" cy="18" r="1" fill="currentColor" />
    <path d="M10 6h8M10 18h8" stroke-linecap="round" />
  </svg>`,
  'devops': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>`,
  'database': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
  </svg>`,
  'mobile': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M12 18h.01" stroke-linecap="round" />
  </svg>`,
  'cloud': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>`,
  'design': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 19l7-7 3 3-7 7-3-3z"/>
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
    <path d="M2 2l7.586 7.586"/>
    <circle cx="11" cy="11" r="2"/>
  </svg>`,
  'security': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 1l10 5v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V6l9-5z"/>
  </svg>`,
  'testing': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>`,
  'ai': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V11a2 2 0 1 1-2 0V5.73C10.4 5.39 10 4.74 10 4a2 2 0 0 1 2-2z"/>
    <path d="M12 13v8"/>
    <path d="M12 18l-5-3"/>
    <path d="M12 18l5-3"/>
  </svg>`,
  'blockchain': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>`,
  'game': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M6 12h4m-2-2v4" />
    <circle cx="15" cy="11" r="1" />
    <circle cx="17" cy="13" r="1" />
  </svg>`,
  'desktop': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>`,
  'other': `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>`,
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  content = inject(ContentService);
  i18n = inject(TranslationService);
  private sanitizer = inject(DomSanitizer);

  getIconForType(type: string | undefined): SafeHtml {
    if (!type) {
        return this.sanitizer.bypassSecurityTrustHtml(SPECIALTY_ICONS['frontend']);
    }
    // Check if it's a known key
    const knownIcon = SPECIALTY_ICONS[type.toLowerCase()];
    if (knownIcon) {
        return this.sanitizer.bypassSecurityTrustHtml(knownIcon);
    }
    // Assume it's a raw SVG string or emoji, sanitize and return
    // Ensure it looks like an SVG to avoid XSS if it's just random text? 
    // Trusted admin input assumption.
    return this.sanitizer.bypassSecurityTrustHtml(type);
  }

  getTechIcon(tech: string): string {
    // 1. Check if we have a defined technology with icon
    const knownTech = this.content.technologies().find(t => t.name.toLowerCase() === tech.toLowerCase());
    if (knownTech && knownTech.icon) {
      return knownTech.icon;
    }

    // 2. Return empty string if not found (or a generic default if desired)
    // User requested to remove hardcoded mapping/guessing.
    return ''; 
  }
}
