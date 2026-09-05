import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './template.html',
  styleUrls: ['./styles.scss']
})
export class NavbarComponent {
  @Input() ano: number = new Date().getFullYear();
  @Input() mes: number = new Date().getMonth() + 1;

  @Output() mesAnterior = new EventEmitter<void>();
  @Output() proximoMes = new EventEmitter<void>();
  @Output() adicionarDivida = new EventEmitter<void>();

  readonly MESES = [
    '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  get nomeMes(): string {
    return this.MESES[this.mes] ?? '';
  }
}
