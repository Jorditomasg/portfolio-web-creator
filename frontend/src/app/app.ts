import { Component, inject, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header.component';
import { FooterComponent } from './shared/components/footer.component';
import { ContentService } from './core/services/content.service';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    @if (showLayout()) {
      <div class="min-h-screen bg-dark-bg text-white flex flex-col">
        <app-header />
        <main class="flex-1 pt-20">
          <router-outlet />
        </main>
        <app-footer />
      </div>
    } @else {
      <router-outlet />
    }
  `,
})
export class App {
  private router = inject(Router);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private contentService = inject(ContentService);
  private document = inject(DOCUMENT);

  constructor() {
    effect(() => {
      const settings = this.contentService.settings();
      if (settings) {
        if (settings.site_title) this.titleService.setTitle(settings.site_title);
        if (settings.meta_description) this.metaService.updateTag({ name: 'description', content: settings.meta_description });
        
        // OG Tags
        this.metaService.updateTag({ property: 'og:title', content: settings.site_title || 'Portfolio' });
        this.metaService.updateTag({ property: 'og:description', content: settings.meta_description || '' });
        
        const image = settings.seo_image_url || settings.main_photo_url;
        if (image) {
          // If relative path, prepend origin (though in SSR it might need base url, for SPA window.location is fine)
          const fullUrl = image.startsWith('http') ? image : window.location.origin + image;
          this.metaService.updateTag({ property: 'og:image', content: fullUrl });
        }

        // Umami analytics (injected once)
        if (settings.umami_url && settings.umami_website_id && !this.document.getElementById('umami-script')) {
          const script = this.document.createElement('script');
          script.id = 'umami-script';
          script.defer = true;
          script.src = `${settings.umami_url.replace(/\/+$/, '')}/script.js`;
          script.setAttribute('data-website-id', settings.umami_website_id);
          this.document.head.appendChild(script);
        }
      }
    });
  }

  showLayout = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => !e.urlAfterRedirects.startsWith('/admin')),
      startWith(!this.router.url.startsWith('/admin'))
    ),
    { initialValue: true }
  );
}
