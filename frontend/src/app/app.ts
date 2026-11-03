import { Component, inject, effect, computed, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header.component';
import { FooterComponent } from './shared/components/footer.component';
import { ContentService } from './core/services/content.service';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    @if (showLayout()) {
      <div class="min-h-screen bg-paper text-ink font-sans flex flex-col">
        <app-header />
        <main class="flex-1">
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
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  showLayout = computed(() => !this.url().startsWith('/admin'));

  constructor() {
    effect(() => {
      const settings = this.contentService.settings();
      if (settings) {
        if (settings.site_title) this.titleService.setTitle(settings.site_title);
        if (settings.meta_description) this.metaService.updateTag({ name: 'description', content: settings.meta_description });
        
        // OG Tags
        this.metaService.updateTag({ property: 'og:title', content: settings.site_title || 'Portfolio' });
        this.metaService.updateTag({ property: 'og:description', content: settings.meta_description || '' });
        
        const origin = this.document.location.origin;
        const pageUrl = origin + this.url().split(/[?#]/)[0];
        this.metaService.updateTag({ property: 'og:type', content: 'website' });
        this.metaService.updateTag({ property: 'og:url', content: pageUrl });
        this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        let canonical = this.document.head.querySelector<HTMLLinkElement>("link[rel='canonical']");
        if (!canonical) {
          canonical = this.document.createElement('link');
          canonical.setAttribute('rel', 'canonical');
          this.document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', pageUrl);

        const image = settings.seo_image_url || settings.main_photo_url;
        if (image) {
          const fullUrl = image.startsWith('http') ? image : origin + image;
          this.metaService.updateTag({ property: 'og:image', content: fullUrl });
        }

        // Umami analytics (injected once)
        if (this.isBrowser && settings.umami_url && settings.umami_website_id && !this.document.getElementById('umami-script')) {
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
}
