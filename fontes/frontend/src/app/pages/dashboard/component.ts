import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MesService } from '../../services/mes.service';
import { DividaService } from '../../services/divida.service';
import { MesFinanceiroResponse } from '../../shared/types/mes-financeiro.types';
import { Divida } from '../../shared/types/divida.types';
import { NavbarComponent } from '../../components/navbar/component';
import { ResumoCardComponent } from '../../components/resumo-card/component';
import { DividaRowComponent } from '../../components/divida-row/component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, ResumoCardComponent, DividaRowComponent],
  templateUrl: './template.html',
  styleUrls: ['./styles.scss']
})
export class DashboardComponent implements OnInit {
  private mesService = inject(MesService);
  private dividaService = inject(DividaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  mes = signal<MesFinanceiroResponse | null>(null);
  loading = signal(true);
  erro = signal<string | null>(null);

  // Modal editar valor
  modalEditarValorAberto = false;
  dividaEditando: Divida | null = null;
  novoValor: number | null = null;

  // Modal confirmar deletar
  modalDeletarAberto = false;
  dividaDeletando: Divida | null = null;

  // Modal adicionar dívida — abre o formulário
  modalAdicionarAberto = false;

  get anoAtual(): number { return this.mes()?.ano ?? new Date().getFullYear(); }
  get mesAtual(): number { return this.mes()?.mes ?? new Date().getMonth() + 1; }

  get dividasProximasAVencer(): Divida[] {
    const hoje = new Date();
    const limite = new Date();
    limite.setDate(limite.getDate() + 7);
    return (this.mes()?.dividas ?? [])
      .filter(d => {
        if (d.pago || !d.dataVencimento) return false;
        const venc = new Date(d.dataVencimento + 'T00:00:00');
        return venc >= hoje && venc <= limite;
      })
      .sort((a, b) => a.diaVencimento - b.diaVencimento);
  }

  get dividasVencidas(): Divida[] {
    const hoje = new Date();
    return (this.mes()?.dividas ?? [])
      .filter(d => {
        if (d.pago || !d.dataVencimento) return false;
        const venc = new Date(d.dataVencimento + 'T00:00:00');
        return venc < hoje;
      });
  }

  isVencida(divida: Divida): boolean {
    if (divida.pago || !divida.dataVencimento) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const venc = new Date(divida.dataVencimento + 'T00:00:00');
    return venc < hoje;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const ano = params['ano'] ? parseInt(params['ano']) : new Date().getFullYear();
      const mes = params['mes'] ? parseInt(params['mes']) : new Date().getMonth() + 1;
      this.carregarMes(ano, mes);
    });
  }

  carregarMes(ano: number, mes: number) {
    this.loading.set(true);
    this.erro.set(null);
    this.mesService.buscar(ano, mes).subscribe({
      next: (data) => {
        this.mes.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.erro.set('Erro ao carregar dados do mês.');
        this.loading.set(false);
      }
    });
  }

  navegarMesAnterior() {
    let { ano, mes } = { ano: this.anoAtual, mes: this.mesAtual };
    mes--;
    if (mes < 1) { mes = 12; ano--; }
    this.router.navigate(['/mes', ano, mes]);
  }

  navegarProximoMes() {
    let { ano, mes } = { ano: this.anoAtual, mes: this.mesAtual };
    mes++;
    if (mes > 12) { mes = 1; ano++; }
    this.router.navigate(['/mes', ano, mes]);
  }

  // Modal editar completa (nome, valor, vencimento, obs)
  modalEditarCompletoAberto = false;
  editNome = '';
  editValor: number | null = null;
  editDiaVencimento = 10;
  editObservacao = '';

  abrirAdicionarDivida() {
    this.router.navigate(['/adicionar-divida'], {
      queryParams: { ano: this.anoAtual, mes: this.mesAtual }
    });
  }

  // Pagamento
  marcarPago(id: number) {
    this.dividaService.marcarPago(id).subscribe(() => this.recarregar());
  }

  desmarcarPago(id: number) {
    this.dividaService.desmarcarPago(id).subscribe(() => this.recarregar());
  }

  // Editar valor rápido (para faturas de cartão sem valor)
  abrirEditarValor(divida: Divida) {
    this.dividaEditando = divida;
    this.novoValor = divida.valor;
    this.modalEditarValorAberto = true;
  }

  salvarValor() {
    if (!this.dividaEditando || this.novoValor == null) return;
    this.dividaService.atualizarValor(this.dividaEditando.id, this.novoValor).subscribe(() => {
      this.modalEditarValorAberto = false;
      this.dividaEditando = null;
      this.recarregar();
    });
  }

  fecharModalValor() {
    this.modalEditarValorAberto = false;
    this.dividaEditando = null;
    this.novoValor = null;
  }

  // Editar completo
  abrirEditarCompleto(divida: Divida) {
    this.dividaEditando = divida;
    this.editNome = divida.nome;
    this.editValor = divida.valor;
    this.editDiaVencimento = divida.diaVencimento;
    this.editObservacao = divida.observacao || '';
    this.modalEditarCompletoAberto = true;
  }

  salvarEdicaoCompleta() {
    if (!this.dividaEditando || !this.editNome.trim() || !this.editDiaVencimento) return;
    this.dividaService.atualizar(this.dividaEditando.id, {
      nome: this.editNome.trim(),
      valor: this.editValor,
      diaVencimento: this.editDiaVencimento,
      observacao: this.editObservacao
    }).subscribe(() => {
      this.fecharModalEditarCompleto();
      this.recarregar();
    });
  }

  fecharModalEditarCompleto() {
    this.modalEditarCompletoAberto = false;
    this.dividaEditando = null;
    this.editNome = '';
    this.editValor = null;
    this.editDiaVencimento = 10;
    this.editObservacao = '';
  }

  // Deletar
  confirmarDeletar(id: number) {
    const divida = this.mes()?.dividas.find(d => d.id === id) ?? null;
    this.dividaDeletando = divida;
    this.modalDeletarAberto = true;
  }

  executarDeletar() {
    if (!this.dividaDeletando) return;
    this.dividaService.deletar(this.dividaDeletando.id).subscribe(() => {
      this.modalDeletarAberto = false;
      this.dividaDeletando = null;
      this.recarregar();
    });
  }

  recarregar() {
    this.carregarMes(this.anoAtual, this.mesAtual);
  }
}
