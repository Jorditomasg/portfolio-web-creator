import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../core/services/toast.service';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

@Component({
  selector: 'app-admin-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
})
export class AdminContactComponent implements OnInit {
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  messages = signal<ContactMessage[]>([]);
  expandedId = signal<number | null>(null);

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.http.get<ContactMessage[]>('/api/admin/contacts').subscribe({
      next: (messages) => this.messages.set(messages),
      error: (err) => {
        console.error('Error loading messages', err);
        this.toast.error('Error al cargar mensajes');
      }
    });
  }

  toggleExpand(id: number) {
    if (this.expandedId() === id) {
      this.expandedId.set(null);
    } else {
      this.expandedId.set(id);
      const msg = this.messages().find(m => m.id === id);
      if (msg && !msg.read) {
        this.markAsRead(id);
      }
    }
  }

  markAsRead(id: number) {
    this.http.post(`/api/admin/contacts/${id}/read`, {}).subscribe({
      next: () => {
        this.messages.update(msgs => 
          msgs.map(m => m.id === id ? { ...m, read: true } : m)
        );
      }, // No error toast needed for background read mark
      error: (err) => console.error('Error marking as read', err)
    });
  }

  deleteMessage(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Eliminar este mensaje?')) {
      this.http.delete(`/api/admin/contacts/${id}`).subscribe({
        next: () => {
          this.messages.update(msgs => msgs.filter(m => m.id !== id));
          this.toast.success('Mensaje eliminado');
          if (this.expandedId() === id) this.expandedId.set(null);
        },
        error: (err) => {
          this.toast.error('Error al eliminar mensaje');
        }
      });
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
