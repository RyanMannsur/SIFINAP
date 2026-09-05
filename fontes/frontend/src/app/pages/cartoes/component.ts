import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartaoService } from '../../services/cartao.service';
import { CartaoTemplate } from '../../shared/types/divida.types';

@Component({
  selector: 'app-cartoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template.html',
  styleUrls: ['./styles.scss']
})
export class CartoesComponent implements OnInit {
  private cartaoService = inject(CartaoService);
  private router = inject(Router);

  cartoes = signal<CartaoTemplate[]>([]);
  salvando = signal(false);
  erro = signal<string | null>(null);

  // Form
  nome = '';
  diaVencimento = 10;

  ngOnInit() {
    this.carregarCartoes();
  }

  carregarCartoes() {
    this.cartaoService.listar().subscribe({
      next: (dados) => this.cartoes.set(dados),
      error: () => this.erro.set('Erro ao carregar cartões de crédito.')
    });
  }

  salvar() {
    this.erro.set(null);
    if (!this.nome.trim()) {
      this.erro.set('Nome do cartão é obrigatório.');
      return;
    }
    if (!this.diaVencimento || this.diaVencimento < 1 || this.diaVencimento > 31) {
      this.erro.set('Dia de vencimento inválido.');
      return;
    }

    this.salvando.set(true);
    this.cartaoService.criar(this.nome.trim(), this.diaVencimento).subscribe({
      next: () => {
        this.nome = '';
        this.diaVencimento = 10;
        this.salvando.set(false);
        this.carregarCartoes();
      },
      error: () => {
        this.erro.set('Erro ao salvar cartão.');
        this.salvando.set(false);
      }
    });
  }

  desativar(id: number) {
    this.cartaoService.desativar(id).subscribe(() => this.carregarCartoes());
  }

  ativar(id: number) {
    this.cartaoService.ativar(id).subscribe(() => this.carregarCartoes());
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }
}
