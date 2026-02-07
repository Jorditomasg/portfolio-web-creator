import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for date pipes
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../core/services/toast.service';
import { firstValueFrom } from 'rxjs';

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

  async loadMessages() {
    try {
      const messages = await firstValueFrom(this.http.get<ContactMessage[]>('/api/admin/contacts'));
      this.messages.set(messages);
    } catch (err) {
      console.error('Error loading messages', err);
      this.toast.error('Error al cargar mensajes');
    }
  }

  async toggleExpand(id: number) {
    if (this.expandedId() === id) {
      this.expandedId.set(null);
    } else {
      this.expandedId.set(id);
      const msg = this.messages().find(m => m.id === id);
      if (msg && !msg.read) {
        await this.markAsRead(id);
      }
    }
  }

  async markAsRead(id: number) {
    try {
      await firstValueFrom(this.http.post(`/api/admin/contacts/${id}/read`, {}));
      this.messages.update(msgs => 
        msgs.map(m => m.id === id ? { ...m, read: true } : m)
      );
    } catch (err) {
      console.error('Error marking as read', err);
    }
  }

  async deleteMessage(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Eliminar este mensaje?')) {
      try {
        await firstValueFrom(this.http.delete(`/api/admin/contacts/${id}`));
        this.messages.update(msgs => msgs.filter(m => m.id !== id));
        this.toast.success('Mensaje eliminado');
        if (this.expandedId() === id) this.expandedId.set(null);
      } catch (err) {
        this.toast.error('Error al eliminar mensaje');
      }
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
