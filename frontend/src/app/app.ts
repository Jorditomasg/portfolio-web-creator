import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header.component';
import { FooterComponent } from './shared/components/footer.component';
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

  showLayout = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => !e.urlAfterRedirects.startsWith('/admin')),
      startWith(!this.router.url.startsWith('/admin'))
    ),
    { initialValue: true }
  );
}
