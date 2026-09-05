export type TipoDivida = 'UNICA' | 'PARCELADA' | 'CARTAO' | 'REPASSE' | 'EMPRESTIMO';

export interface Divida {
  id: number;
  nome: string;
  valor: number | null;
  diaVencimento: number;
  tipo: TipoDivida;
  parcelaAtual: number | null;
  totalParcelas: number | null;
  responsavel: string | null;
  pago: boolean;
  dataPagamento: string | null;
  observacao: string | null;
  dividaTemplateId: number | null;
  dataVencimento: string;
}

export interface DividaCreate {
  nome: string;
  valor?: number;
  diaVencimento: number;
  tipo: TipoDivida;
  parcelaAtual?: number;
  totalParcelas?: number;
  responsavel?: string;
  ano?: number;
  mes?: number;
  dividaTemplateId?: number;
  observacao?: string;
}

export interface CartaoTemplate {
  id: number;
  nome: string;
  diaVencimento: number;
  ativa: boolean;
}
