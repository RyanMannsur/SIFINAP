import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import { DummyArticle } from '../shared/types/article';

export interface ArticleFilter {
  search?: string;
  category?: string;
  minRating?: number;
  maxRating?: number;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

interface BackendArticle {
  id: number;
  // Campos em inglês (formato atual do backend)
  title?: string;
  content?: string;
  summary?: string | null;
  category?: string;
  rating?: number;
  imageUrl?: string | null;
  authorId?: number;
  author?: string;
  authorAvatar?: string | null;
  authorBio?: string | null;
  date?: string;
  updatedAt?: string;
  // Campos em português (compatibilidade legada)
  titulo?: string;
  conteudo?: string;
  resumo?: string | null;
  categoria?: string;
  media_notas?: number;
  nota?: number;
  image_url?: string | null;
  autor_id?: number;
  autor_nome?: string;
  autor_avatar?: string | null;
  autor_bio?: string | null;
  criado_em?: string;
  atualizado_em?: string;
}

interface BackendPaginatedArticlesResponse {
  artigos: BackendArticle[];
  paginacao: {
    totalArtigos: number;
    totalPaginas: number;
    paginaAtual: number;
    limite: number;
  };
}

interface BackendSingleArticleResponse {
  id: number;
  // Campos em inglês (formato atual do backend)
  title?: string;
  content?: string;
  summary?: string | null;
  category?: string;
  rating?: number;
  imageUrl?: string | null;
  authorId?: number;
  author?: string;
  authorAvatar?: string | null;
  authorBio?: string | null;
  date?: string;
  updatedAt?: string;
  // Campos em português (compatibilidade legada)
  titulo?: string;
  conteudo?: string;
  resumo?: string | null;
  categoria?: string;
  media_notas?: number;
  nota?: number;
  image_url?: string | null;
  autor_id?: number;
  autor_nome?: string;
  autor_avatar?: string | null;
  autor_bio?: string | null;
  criado_em?: string;
  atualizado_em?: string;
}

interface BackendApiResponse<T> {
  success: boolean;
  data: T;
}

interface BackendUploadResponse {
  imageUrl: string;
}

type BackendArticleResponse = BackendApiResponse<BackendSingleArticleResponse> | BackendSingleArticleResponse;

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getArticles(page: number, size: number, filter?: ArticleFilter): Observable<PaginatedResult<DummyArticle>> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', size);

    if (filter?.search) {
      params = params.set('search', filter.search);
    }

    if (filter?.category) {
      params = params.set('categoria', filter.category);
    }

    if (filter?.minRating !== undefined && filter.minRating > 0) {
      params = params.set('minNota', filter.minRating);
    }

    if (filter?.maxRating !== undefined && filter.maxRating > 0) {
      params = params.set('maxNota', filter.maxRating);
    }

    if (filter?.startDate) {
      params = params.set('startDate', filter.startDate);
    }

    if (filter?.endDate) {
      params = params.set('endDate', filter.endDate);
    }

    return this.http.get<{ success: boolean; data: BackendPaginatedArticlesResponse }>(`${environment.apiUrl}/artigos`, { params }).pipe(
      map((response) => ({
        data: response.data.artigos.map((article) => this.mapArticle(article)),
        total: response.data.paginacao.totalArtigos
      }))
    );
  }

  getCategories(): Observable<{label: string, value: string}[]> {
    return new Observable((subscriber) => {
      subscriber.next([
        { label: 'Tecnologia', value: 'tech' },
        { label: 'Esportes', value: 'sports' },
        { label: 'Política', value: 'politics' },
        { label: 'Entretenimento', value: 'entertainment' }
      ]);
      subscriber.complete();
    });
  }

  getArticleById(id: number): Observable<DummyArticle> {
    return this.http.get<BackendArticleResponse>(`${environment.apiUrl}/artigos/${id}`).pipe(
      map((response) => {
        const article = this.unwrapArticleResponse(response);

        return this.mapArticle(article);
      })
    );
  }

  getMyArticles(page: number, size: number): Observable<PaginatedResult<DummyArticle>> {
    return this.http.get<{ success: boolean; data: BackendArticle[] }>(`${environment.apiUrl}/usuarios/artigos`).pipe(
      map((response) => {
        const articles = response.data.map((article) => this.mapArticle(article));
        const total = articles.length;
        const startIndex = (page - 1) * size;

        return {
          data: articles.slice(startIndex, startIndex + size),
          total
        };
      })
    );
  }

  createArticle(payload: { title: string; content: string; category: string; imageUrl?: string; summary?: string | null }): Observable<DummyArticle> {
    return this.http.post<{ success: boolean; data: BackendSingleArticleResponse }>(`${environment.apiUrl}/artigos`, {
      titulo: payload.title,
      conteudo: payload.content,
      categoria: payload.category,
      resumo: payload.summary ?? null,
      imageUrl: payload.imageUrl ?? null
    }).pipe(
      map((response) => this.mapArticle(response.data))
    );
  }

  updateArticle(id: number, payload: { title: string; content: string }): Observable<DummyArticle> {
    return this.http.put<{ success: boolean; data: BackendSingleArticleResponse }>(`${environment.apiUrl}/artigos/${id}`, {
      titulo: payload.title,
      conteudo: payload.content
    }).pipe(
      map((response) => this.mapArticle(response.data))
    );
  }

  deleteArticle(id: number): Observable<void> {
    return this.http.delete<{ success: boolean; message?: string }>(`${environment.apiUrl}/artigos/${id}`).pipe(
      map(() => void 0)
    );
  }

  uploadArticleImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<{ success: boolean; data: BackendUploadResponse }>(`${environment.apiUrl}/uploads/artigos/imagem`, formData).pipe(
      map((response) => this.resolveImageUrl(response.data.imageUrl))
    );
  }

  getArticleRating(id: number): Observable<{ tipo: string; valor: number }> {
    return this.http.get<{ success: boolean; data: { tipo: string; valor: number } }>(`${environment.apiUrl}/artigos/${id}/nota`).pipe(
      map((response) => response.data)
    );
  }

  rateArticle(id: number, valor: number): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${environment.apiUrl}/artigos/${id}/nota`, { valor });
  }

  getUserProfile(): Observable<{ id: number; nome: string; bio: string; avatar_url: string; media_nota: number; nota: number }> {
    return this.http.get<{ success: boolean; data: { id: number; nome: string; bio: string; avatar_url: string; media_nota: number; nota?: number } }>(`${environment.apiUrl}/usuarios/perfil`).pipe(
      map((response) => ({
        ...response.data,
        media_nota: Number(response.data.nota ?? response.data.media_nota ?? 0),
        nota: Number(response.data.nota ?? response.data.media_nota ?? 0)
      }))
    );
  }

  updateProfile(payload: { nome: string; bio: string; avatarUrl?: string }): Observable<any> {
    return this.http.put<{ success: boolean; data: any }>(`${environment.apiUrl}/usuarios/perfil`, payload);
  }

  getPublicUserProfile(id: number): Observable<{ id: number; nome: string; bio: string; avatar_url: string; media_nota: number; nota: number }> {
    return this.http.get<{ success: boolean; data: { id: number; nome: string; bio: string; avatar_url: string; media_nota: number; nota?: number } }>(`${environment.apiUrl}/usuarios/${id}`).pipe(
      map((response) => ({
        ...response.data,
        media_nota: Number(response.data.nota ?? response.data.media_nota ?? 0),
        nota: Number(response.data.nota ?? response.data.media_nota ?? 0)
      }))
    );
  }

  private mapArticle(article: BackendArticle | BackendSingleArticleResponse): DummyArticle {
    const rawCategory = article.categoria ?? article.category ?? '';
    const normalizedCategory = this.normalizeCategory(rawCategory);
    const rawTitle = article.titulo ?? article.title ?? '';
    const rawContent = article.conteudo ?? article.content ?? '';
    const rawSummary = article.resumo ?? article.summary ?? null;
    const rawRating = article.nota ?? article.media_notas ?? article.rating ?? 0;
    const rawImageUrl = article.image_url ?? article.imageUrl ?? '';
    const rawAuthorId = article.autor_id ?? article.authorId;
    const rawAuthor = article.autor_nome ?? article.author ?? 'OpenFeed';
    const rawAuthorAvatar = article.autor_avatar ?? article.authorAvatar ?? null;
    const rawAuthorBio = article.autor_bio ?? article.authorBio ?? null;
    const rawDate = article.criado_em ?? article.date ?? new Date().toISOString();
    const rawUpdatedAt = article.atualizado_em ?? article.updatedAt;

    return {
      id: article.id,
      authorId: rawAuthorId,
      imageUrl: this.resolveImageUrl(rawImageUrl),
      date: rawDate,
      updatedAt: rawUpdatedAt,
      title: rawTitle,
      content: rawContent,
      summary: rawSummary,
      author: rawAuthor,
      authorAvatar: rawAuthorAvatar,
      authorBio: rawAuthorBio,
      category: normalizedCategory.value,
      categoryLabel: normalizedCategory.label,
      categoryIcon: normalizedCategory.icon,
      rating: Number(rawRating ?? 0)
    };
  }

  private normalizeCategory(category: string): { label: string; icon: string; value: string } {
    const normalized = (category || '').toLowerCase();

    const categoryMap: Record<string, { label: string; icon: string; value: string }> = {
      tech: { label: 'Tecnologia', icon: 'code', value: 'tech' },
      tecnologia: { label: 'Tecnologia', icon: 'code', value: 'tech' },
      sports: { label: 'Esportes', icon: 'sports_soccer', value: 'sports' },
      esportes: { label: 'Esportes', icon: 'sports_soccer', value: 'sports' },
      politics: { label: 'Política', icon: 'gavel', value: 'politics' },
      politica: { label: 'Política', icon: 'gavel', value: 'politics' },
      entertainment: { label: 'Entretenimento', icon: 'movie', value: 'entertainment' },
      entretenimento: { label: 'Entretenimento', icon: 'movie', value: 'entertainment' }
    };

    return categoryMap[normalized] ?? { label: category, icon: 'article', value: normalized };
  }

  private resolveImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      return '';
    }

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }

    if (imageUrl.startsWith('/img/')) {
      return `${environment.assetUrl}${imageUrl}`;
    }

    if (imageUrl.startsWith('img/')) {
      return `${environment.assetUrl}/${imageUrl}`;
    }

    return imageUrl;
  }

  private unwrapArticleResponse(response: BackendArticleResponse): BackendSingleArticleResponse {
    if (response && typeof response === 'object' && 'data' in response && response.data) {
      return response.data;
    }

    return response as BackendSingleArticleResponse;
  }
}
