import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Divida } from '../../shared/types/divida.types';

@Component({
  selector: 'tr[app-divida-row]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template.html',
  styleUrls: ['./styles.scss'],
  host: {
    'class': 'divida-tr',
    '[class.divida-tr--pago]': 'divida?.pago'
  }
})
export class DividaRowComponent {
  @Input() divida!: Divida;
  @Input() ano: number = new Date().getFullYear();
  @Input() mes: number = new Date().getMonth() + 1;

  @Output() onPagar = new EventEmitter<number>();
  @Output() onEstornar = new EventEmitter<number>();
  @Output() onEditarValor = new EventEmitter<Divida>();
  @Output() onEditarCompleto = new EventEmitter<Divida>();
  @Output() onDeletar = new EventEmitter<number>();

  get statusClass(): string {
    if (this.divida.pago) return 'pago';
    if (!this.divida.valor) return 'sem-valor';
    const hoje = new Date();
    const venc = new Date(this.divida.dataVencimento + 'T00:00:00');
    if (venc < hoje) return 'vencido';
    return 'em-dia';
  }

  get statusLabel(): string {
    const s = this.statusClass;
    if (s === 'pago') return 'Pago';
    if (s === 'sem-valor') return 'Aguardando fatura';
    if (s === 'vencido') return 'Vencida';
    return 'Em dia';
  }

  get parcelaLabel(): string | null {
    if (this.divida.parcelaAtual && this.divida.totalParcelas) {
      return `${this.divida.parcelaAtual}/${this.divida.totalParcelas}`;
    }
    return null;
  }

  get tipoLabel(): string {
    const labels: Record<string, string> = {
      UNICA: 'Única',
      PARCELADA: 'Parcelada',
      CARTAO: 'Cartão',
      REPASSE: 'Repasse',
      EMPRESTIMO: 'Empréstimo'
    };
    return labels[this.divida.tipo] ?? this.divida.tipo;
  }

  get diaVencimentoFormatado(): string {
    if (!this.divida.dataVencimento) return `Dia ${this.divida.diaVencimento}`;
    const d = new Date(this.divida.dataVencimento + 'T00:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
}
