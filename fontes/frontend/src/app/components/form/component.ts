import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class FormComponent {
  @Output() onSubmit = new EventEmitter<Event>();

  handleSubmit(event: Event) {
    event.preventDefault();
    this.onSubmit.emit(event);
  }
}
