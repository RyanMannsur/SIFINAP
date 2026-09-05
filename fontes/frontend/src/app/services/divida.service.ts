import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Divida, DividaCreate } from '../shared/types/divida.types';

@Injectable({ providedIn: 'root' })
export class DividaService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/dividas`;

  criar(dto: DividaCreate): Observable<Divida> {
    return this.http.post<Divida>(this.baseUrl, dto);
  }

  atualizar(id: number, dados: { nome: string; valor?: number | null; diaVencimento: number; observacao?: string }): Observable<Divida> {
    return this.http.put<Divida>(`${this.baseUrl}/${id}`, dados);
  }

  atualizarValor(id: number, valor: number): Observable<Divida> {
    return this.http.patch<Divida>(`${this.baseUrl}/${id}/valor`, { valor });
  }

  marcarPago(id: number): Observable<Divida> {
    return this.http.patch<Divida>(`${this.baseUrl}/${id}/pagar`, {});
  }

  desmarcarPago(id: number): Observable<Divida> {
    return this.http.patch<Divida>(`${this.baseUrl}/${id}/estornar`, {});
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
