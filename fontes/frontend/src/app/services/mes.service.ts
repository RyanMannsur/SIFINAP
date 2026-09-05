import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MesFinanceiroResponse, MesFinanceiroSummary } from '../shared/types/mes-financeiro.types';

@Injectable({ providedIn: 'root' })
export class MesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/meses`;

  listarTodos(): Observable<MesFinanceiroSummary[]> {
    return this.http.get<MesFinanceiroSummary[]>(this.baseUrl);
  }

  buscar(ano: number, mes: number): Observable<MesFinanceiroResponse> {
    return this.http.get<MesFinanceiroResponse>(`${this.baseUrl}/${ano}/${mes}`);
  }

  mesAtual(): Observable<MesFinanceiroResponse> {
    return this.http.get<MesFinanceiroResponse>(`${this.baseUrl}/atual`);
  }
}
