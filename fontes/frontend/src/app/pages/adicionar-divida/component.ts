import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DividaService } from '../../services/divida.service';
import { CartaoService } from '../../services/cartao.service';
import { DividaCreate, TipoDivida, CartaoTemplate } from '../../shared/types/divida.types';

@Component({
  selector: 'app-adicionar-divida',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template.html',
  styleUrls: ['./styles.scss']
})
export class AdicionarDividaComponent implements OnInit {
  private dividaService = inject(DividaService);
  private cartaoService = inject(CartaoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  cartoes = signal<CartaoTemplate[]>([]);
  salvando = signal(false);
  erro = signal<string | null>(null);

  // Formulário
  nome = '';
  tipo: TipoDivida = 'UNICA';
  valor: number | null = null;
  diaVencimento: number = 10;
  parcelaAtual: number = 1;
  totalParcelas: number = 1;
  responsavel = '';
  observacao = '';
  cartaoTemplateId: number | null = null;
  ano: number = new Date().getFullYear();
  mes: number = new Date().getMonth() + 1;

  readonly TIPOS: { value: TipoDivida; label: string; descricao: string }[] = [
    { value: 'UNICA', label: 'Única', descricao: 'Aparece apenas neste mês' },
    { value: 'PARCELADA', label: 'Parcelada', descricao: 'Divide em X parcelas mensais' },
    { value: 'EMPRESTIMO', label: 'Empréstimo', descricao: 'Dívida mensal com parcelas' },
    { value: 'REPASSE', label: 'Repasse', descricao: 'Recorrente mensal (copia o mesmo valor todo mês)' },
  ];

  get precisaParcelas(): boolean {
    return this.tipo === 'PARCELADA' || this.tipo === 'EMPRESTIMO';
  }

  get precisaResponsavel(): boolean {
    return this.tipo === 'REPASSE';
  }

  get precisaCartao(): boolean {
    return this.tipo === 'CARTAO';
  }

  get valorObrigatorio(): boolean {
    return this.tipo !== 'CARTAO';
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['ano']) this.ano = parseInt(params['ano']);
      if (params['mes']) this.mes = parseInt(params['mes']);
    });
    this.cartaoService.listar().subscribe(c => this.cartoes.set(c.filter(x => x.ativa)));
  }

  onTipoChange() {
    this.nome = '';
    this.cartaoTemplateId = null;
    this.responsavel = '';
    this.parcelaAtual = 1;
    this.totalParcelas = 1;
  }

  onCartaoSelecionado() {
    const cartao = this.cartoes().find(c => c.id === Number(this.cartaoTemplateId));
    if (cartao) {
      this.nome = cartao.nome;
      this.diaVencimento = cartao.diaVencimento;
    }
  }

  salvar() {
    this.erro.set(null);

    if (!this.nome.trim()) { this.erro.set('Nome é obrigatório.'); return; }
    if (!this.diaVencimento || this.diaVencimento < 1 || this.diaVencimento > 31) {
      this.erro.set('Dia de vencimento inválido.'); return;
    }
    if (this.valorObrigatorio && (this.valor == null || this.valor <= 0)) {
      this.erro.set('Valor é obrigatório para este tipo de dívida.'); return;
    }
    if (this.precisaResponsavel && !this.responsavel.trim()) {
      this.erro.set('Informe o nome do responsável pelo repasse.'); return;
    }

    this.salvando.set(true);

    const dto: DividaCreate = {
      nome: this.nome.trim(),
      tipo: this.tipo,
      diaVencimento: this.diaVencimento,
      ano: this.ano,
      mes: this.mes,
      observacao: this.observacao || undefined,
    };

    if (this.valor != null) dto.valor = this.valor;
    if (this.precisaParcelas) {
      dto.parcelaAtual = this.parcelaAtual;
      dto.totalParcelas = this.totalParcelas;
    }
    if (this.precisaResponsavel) dto.responsavel = this.responsavel.trim();
    if (this.cartaoTemplateId) dto.dividaTemplateId = Number(this.cartaoTemplateId);

    this.dividaService.criar(dto).subscribe({
      next: () => {
        this.router.navigate(['/mes', this.ano, this.mes]);
      },
      error: (e) => {
        this.erro.set('Erro ao salvar. Tente novamente.');
        this.salvando.set(false);
      }
    });
  }

  voltar() {
    this.router.navigate(['/mes', this.ano, this.mes]);
  }
}
