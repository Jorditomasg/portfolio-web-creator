import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="py-8 bg-dark-bg border-t border-dark-border">
      <div class="container mx-auto px-6 text-center">
        <p class="text-gray-500 text-sm">
          © {{ currentYear }} Portfolio Web Creator. All rights reserved.
        </p>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
