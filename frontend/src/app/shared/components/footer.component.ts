import { Component, inject } from '@angular/core';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="bg-ink text-[#A8A8A2] border-t border-line-dark">
      <div class="max-w-screen-xl mx-auto px-6 md:px-8 py-8 flex flex-wrap justify-between gap-4 font-mono text-[13px]">
        <span>© {{ currentYear }} {{ content.siteTitle() }}</span>
        @if (content.settings(); as settings) {
          <div class="flex flex-wrap gap-6">
            @if (settings.github_url) {
              <a [href]="settings.github_url" target="_blank" rel="noopener" class="text-paper hover:text-[#C9C9C3]">GitHub</a>
            }
            @if (settings.linkedin_url) {
              <a [href]="settings.linkedin_url" target="_blank" rel="noopener" class="text-paper hover:text-[#C9C9C3]">LinkedIn</a>
            }
            @if (settings.email) {
              <a [href]="'mailto:' + settings.email" class="text-paper hover:text-[#C9C9C3]">Email</a>
            }
          </div>
        }
      </div>
    </footer>
  `,
})
export class FooterComponent {
  content = inject(ContentService);
  currentYear = new Date().getFullYear();
}
