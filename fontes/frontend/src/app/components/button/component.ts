import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'dark' | 'outline' | 'text' = 'primary';
  @Input() disabled: boolean = false;
  @Input() block: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Output() onClick = new EventEmitter<Event>();

  get buttonClasses() {
    let base = `btn`;
    if (this.variant === 'primary') base += ` btn-primary`;
    if (this.variant === 'secondary') base += ` btn-secondary`;
    if (this.variant === 'dark') base += ` btn-dark`;
    if (this.variant === 'outline') base += ` btn-outline-secondary`;
    if (this.variant === 'text') base += ` btn-link text-decoration-none`;
    
    if (this.size === 'sm') base += ` btn-sm`;
    if (this.size === 'lg') base += ` btn-lg`;

    if (this.block) base += ` w-100`;

    return base;
  }

  handleClick(event: Event) {
    if (!this.disabled) {
      this.onClick.emit(event);
    }
  }
}
