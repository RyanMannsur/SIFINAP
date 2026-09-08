import { Divida } from './divida.types';

export interface MesFinanceiroSummary {
  id: number;
  ano: number;
  mes: number;
}

export interface MesFinanceiroResponse {
  id: number;
  ano: number;
  mes: number;
  dividas: Divida[];
  totalMes: number;
  totalPago: number;
  totalAPagar: number;
  totalAVencer: number;
  quantidadePagas: number;
  quantidadeAVencer: number;
  quantidadeVencidas: number;
}
