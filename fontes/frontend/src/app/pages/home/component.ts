import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonComponent } from '../../components/button/component';
import { InputComponent } from '../../components/input/component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ButtonComponent, InputComponent],
  templateUrl: './template.html',
  styleUrl: './styles.scss'
})
export class HomeComponent {
  protected searchTerm = '';

  startSearch(): void {
    console.log('Buscar no frontend:', this.searchTerm);
  }
}
