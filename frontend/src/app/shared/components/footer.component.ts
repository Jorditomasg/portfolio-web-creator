import { Component, inject } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="py-8 bg-dark-bg border-t border-dark-border">
      <div class="container mx-auto px-6 text-center">
        <p class="text-gray-500 text-sm">
          © {{ currentYear }} Portfolio Web Creator. {{ i18n.t('footer.rights') }}
        </p>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  i18n = inject(TranslationService);
  currentYear = new Date().getFullYear();
}
