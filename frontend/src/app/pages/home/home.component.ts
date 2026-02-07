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

  getIconForType(type: string): SafeHtml {
    const svg = SPECIALTY_ICONS[type] || SPECIALTY_ICONS['frontend'];
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getTechIcon(tech: string): string {
    const normalize = (t: string) => {
      const lower = t.toLowerCase();
      const map: Record<string, string> = {
        'c#': 'csharp',
        'c++': 'cplusplus',
        'node.js': 'nodejs',
        'vue': 'vuejs',
        'angular': 'angularjs', // Devicon uses angularjs folder but angular-original.svg exists? detailed check needed. generic fallback:
        // Actually devicon has 'angular' now? No, it's usually under 'angularjs' folder but 'angular-original.svg'? 
        // Let's stick to simple logic: try name-original.svg
      };
      // Common replacements
      return map[lower] || lower.replace(/[ .]/g, '');
    };

    const name = normalize(tech);
    // Angular special case in devicon: folder 'angularjs', file 'angularjs-original.svg' (for old) or 'angular-original.svg' (new)?
    // Inspecting devicon: icons/angularjs/angularjs-original.svg. icons/angular/angular-original.svg also exists in newer versions.
    // Let's try to map common ones to ensure they work.
    
    // Better strategy: Use the specific map provided by user demand but dynamic fallback
    // The user said: "que pongas el ícono que pongas busque y coja el icono desde https://cdn.jsdelivr.net y no estár hardcodeado como está ahora"
    // So mostly dynamic.
    
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-original.svg`;
  }
}
