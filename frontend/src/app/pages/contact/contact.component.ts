import { Component, inject, OnInit } from '@angular/core';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {
  content = inject(ContentService);

  ngOnInit() {
    this.content.loadSettings().subscribe();
  }
}
