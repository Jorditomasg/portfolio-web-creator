import { Component, inject, OnInit } from '@angular/core';
import { ContentService } from '../../core/services/content.service';
import { PortfolioSettings } from '../../core/models/api.models';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {
  content = inject(ContentService);

  ngOnInit() {
    this.content.loadSettings().subscribe();
  }

  contactLinks(settings: PortfolioSettings) {
    const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    return [
      settings.email && { label: 'Email', href: `mailto:${settings.email}`, text: settings.email, external: false },
      settings.linkedin_url && { label: 'LinkedIn', href: settings.linkedin_url, text: host(settings.linkedin_url), external: true },
      settings.github_url && { label: 'GitHub', href: settings.github_url, text: host(settings.github_url), external: true },
    ].filter(link => !!link);
  }
}
