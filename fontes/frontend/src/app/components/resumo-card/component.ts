import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resumo-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template.html',
  styleUrls: ['./styles.scss']
})
export class ResumoCardComponent {
  @Input() titulo: string = '';
  @Input() valor: number = 0;
  @Input() icone: string = 'attach_money';
  @Input() variante: 'total' | 'pago' | 'apagar' | 'neutro' = 'neutro';
  @Input() subtitulo: string = '';
}
