import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartaoTemplate } from '../shared/types/divida.types';

@Injectable({ providedIn: 'root' })
export class CartaoService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/cartoes`;

  listar(): Observable<CartaoTemplate[]> {
    return this.http.get<CartaoTemplate[]>(this.baseUrl);
  }

  criar(nome: string, diaVencimento: number): Observable<CartaoTemplate> {
    return this.http.post<CartaoTemplate>(this.baseUrl, { nome, diaVencimento });
  }

  desativar(id: number): Observable<CartaoTemplate> {
    return this.http.patch<CartaoTemplate>(`${this.baseUrl}/${id}/desativar`, {});
  }

  ativar(id: number): Observable<CartaoTemplate> {
    return this.http.patch<CartaoTemplate>(`${this.baseUrl}/${id}/ativar`, {});
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
