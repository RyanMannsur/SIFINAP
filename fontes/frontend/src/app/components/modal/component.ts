import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() text: string = '';
  
  @Output() onClose = new EventEmitter<void>();

  close() {
    this.isOpen = false;
    this.onClose.emit();
  }
}
