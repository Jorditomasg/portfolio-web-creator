import { Component, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { UploadService } from '../../../core/services/upload.service';

@Component({
  selector: 'app-file-upload',
  template: `
    <div class="flex flex-col gap-2 w-full">
      <label class="text-sm font-medium text-gray-300 mb-1">{{ label || 'Imagen' }}</label>
      
      <div class="flex gap-4 items-start p-3 bg-dark-surface rounded-lg border border-dark-border group hover:border-primary/50 transition-colors">
        <!-- Preview / Placeholder -->
        <div class="relative w-20 h-20 shrink-0 rounded-md overflow-hidden bg-dark-bg border border-dark-border flex items-center justify-center">
          @if (previewUrl()) {
            <img [src]="previewUrl()" class="w-full h-full object-cover">
            <!-- Overlay actions -->
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button (click)="fileInput.click()" type="button" class="p-1.5 bg-primary/20 hover:bg-primary/40 text-primary rounded-full transition-colors" title="Cambiar">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button (click)="removeFile()" type="button" class="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-500 rounded-full transition-colors" title="Eliminar">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        </div>

        <!-- Info and Actions -->
        <div class="flex-1 min-w-0 flex flex-col justify-center gap-2">
          @if (!previewUrl()) {
            <div class="text-xs text-gray-500">
              <p>Formatos: JPG, PNG, WEBP</p>
              <p>Max: 5MB</p>
            </div>
            <button type="button" 
                    (click)="fileInput.click()"
                    [disabled]="isUploading()"
                    class="w-fit px-3 py-1.5 bg-dark-bg hover:bg-dark-border border border-dark-border rounded text-sm text-gray-300 transition-colors flex items-center gap-2">
              @if (isUploading()) {
                <svg class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Subiendo...
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Seleccionar Archivo
              }
            </button>
          } @else {
             <div class="text-sm text-gray-400 truncate break-all">
                {{ getFileName() }}
             </div>
             <p class="text-xs text-green-500 flex items-center gap-1">
               <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
               Listo
             </p>
          }
        </div>
      </div>

      <input #fileInput type="file" (change)="onFileSelected($event)" class="hidden" accept="image/*">
      
      @if (error()) {
        <p class="text-xs text-red-400 mt-1">{{ error() }}</p>
      }
    </div>
  `
})
export class FileUploadComponent {
  @Input() label: string = '';
  @Input() set currentPath(value: string | null | undefined) {
    this._currentPath.set(value || null);
  }
  @Output() pathChange = new EventEmitter<string | null>();

  private uploadService = inject(UploadService);
  
  _currentPath = signal<string | null>(null);
  previewUrl = signal<string | null>(null);
  isUploading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
        const path = this._currentPath();
        if (path) {
            this.previewUrl.set(this.uploadService.getFullUrl(path));
        } else {
            this.previewUrl.set(null);
        }
    }, { allowSignalWrites: true });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile(input.files[0]);
    }
  }

  uploadFile(file: File) {
    this.isUploading.set(true);
    this.error.set(null);
    
    this.uploadService.upload(file).subscribe({
      next: (res) => {
        this.isUploading.set(false);
        this.pathChange.emit(res.path);
        // We don't verify deletion of old file here, handled by backend logic on save or expected manual layout
      },
      error: (err) => {
        this.isUploading.set(false);
        this.error.set('Error subiendo archivo');
        console.error(err);
      }
    });
  }

  removeFile() {
    this.pathChange.emit(null);
    this._currentPath.set(null);
  }

  getFileName(): string {
    const path = this._currentPath();
    if (!path) return '';
    const parts = path.split('/');
    return parts[parts.length - 1];
  }
}
