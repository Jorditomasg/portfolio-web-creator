import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  private idCounter = 0;

  readonly toasts = this._toasts.asReadonly();

  show(message: string, type: 'success' | 'error' | 'info' = 'success', duration = 3000): void {
    const id = ++this.idCounter;
    const toast: Toast = { id, message, type };
    
    this._toasts.update(toasts => [...toasts, toast]);
    
    setTimeout(() => {
      this._toasts.update(toasts => toasts.filter(t => t.id !== id));
    }, duration);
  }

  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 4000): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  dismiss(id: number): void {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}
