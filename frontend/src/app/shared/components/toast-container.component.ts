import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  template: `
    <div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md border animate-slide-in"
          [class]="getToastClasses(toast.type)"
          (click)="toastService.dismiss(toast.id)">
          <span class="text-lg">{{ getToastIcon(toast.type) }}</span>
          <span class="font-medium">{{ toast.message }}</span>
          <button class="ml-2 opacity-60 hover:opacity-100 transition-opacity text-lg">&times;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  getToastClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-green-500/90 text-white border-green-400';
      case 'error':
        return 'bg-red-500/90 text-white border-red-400';
      case 'info':
        return 'bg-blue-500/90 text-white border-blue-400';
      default:
        return 'bg-dark-surface text-white border-dark-border';
    }
  }

  getToastIcon(type: string): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'info': return 'ℹ';
      default: return '•';
    }
  }
}
