import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  template: `
    <div role="status" aria-live="polite" class="fixed bottom-6 right-6 left-6 sm:left-auto z-[100] flex flex-col items-end gap-2">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="flex items-center gap-3 max-w-sm pl-4 pr-1 py-1 rounded-full bg-ink text-paper shadow-[0_8px_30px_rgb(0_0_0/0.2)] animate-slide-in">
          <span aria-hidden="true" class="w-2 h-2 shrink-0 rounded-full" [class]="dotClass(toast.type)"></span>
          <span class="text-sm font-medium">{{ toast.message }}</span>
          <button type="button" (click)="toastService.dismiss(toast.id)" aria-label="Dismiss"
                  class="w-9 h-9 shrink-0 rounded-full opacity-60 hover:opacity-100 hover:bg-paper/10 transition">&times;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from { transform: translateY(12px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-in { animation: slide-in 0.2s ease-out; }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  dotClass(type: string): string {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-paper/60';
    }
  }
}
