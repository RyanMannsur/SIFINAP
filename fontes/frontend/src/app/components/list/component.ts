import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class ListComponent {
  @Input() columns: 1 | 2 | 3 | 4 = 2;
  @Input() items: any[] = [];
  @Input() itemTemplate!: TemplateRef<any>;

  get columnClass() {
    if (this.columns === 1) return 'col-12';
    if (this.columns === 2) return 'col-md-6';
    if (this.columns === 3) return 'col-md-4';
    if (this.columns === 4) return 'col-md-3';
    return 'col-md-6';
  }
}
