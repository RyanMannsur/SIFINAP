import { isPlatformBrowser } from '@angular/common';
import { Injectable, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthCredentials, AuthSession, AuthUser, MockApiRequest, MockApiResponse, RegisterPayload, BackendAuthResponse } from '../../shared/types/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly sessionStorageKey = 'openfeed.auth.session';
  private readonly currentUserSignal = signal<AuthUser | null>(this.loadSession());

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  login(credentials: AuthCredentials): Observable<MockApiResponse<AuthSession>> {
    const request: MockApiRequest<AuthCredentials> = {
      method: 'POST',
      url: `${environment.apiUrl}/auth/login`,
      body: credentials
    };

    return this.http.post<BackendAuthResponse>(`${environment.apiUrl}/auth/login`, {
      email: credentials.email,
      senha: credentials.password
    }).pipe(
      map((response) => {
        const session = this.createSession(response.data.usuario, response.data.token);
        this.persistSession(session);

        return {
          request,
          message: 'Login realizado com sucesso.',
          data: session
        };
      })
    );
  }

  register(payload: RegisterPayload): Observable<MockApiResponse<AuthUser>> {
    const request: MockApiRequest<RegisterPayload> = {
      method: 'POST',
      url: `${environment.apiUrl}/auth/register`,
      body: payload
    };

    return this.http.post<BackendAuthResponse>(`${environment.apiUrl}/auth/registrar`, {
      nome: payload.name,
      email: payload.email,
      senha: payload.password
    }).pipe(
      map((response) => {
        const user = this.toPublicUser(response.data.usuario);

        return {
          request,
          message: 'Usuário registrado com sucesso.',
          data: user
        };
      })
    );
  }

  logout(): void {
    this.currentUserSignal.set(null);

    if (this.canUseStorage()) {
      window.localStorage.removeItem(this.sessionStorageKey);
    }
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSignal();
  }

  getToken(): string | null {
    if (!this.canUseStorage()) {
      return null;
    }

    const rawSession = window.localStorage.getItem(this.sessionStorageKey);
    if (!rawSession) {
      return null;
    }

    try {
      const session = JSON.parse(rawSession) as { token?: string };
      return session.token ?? null;
    } catch {
      return null;
    }
  }

  private createSession(user: { id: number; nome: string; email: string }, token: string): AuthSession {
    return {
      token,
      user: this.toPublicUser(user),
      loginAt: new Date().toISOString()
    };
  }

  private toPublicUser(user: { id: number; nome: string; email: string }): AuthUser {
    return {
      id: user.id,
      name: user.nome,
      email: user.email,
      role: user.email === 'admin@openfeed.com' || user.id === 1 ? 'admin' : 'user'
    };
  }

  private loadSession(): AuthUser | null {
    if (!this.canUseStorage()) {
      return null;
    }

    const rawSession = window.localStorage.getItem(this.sessionStorageKey);

    if (!rawSession) {
      return null;
    }

    try {
      const parsed = JSON.parse(rawSession) as { user?: AuthUser } | AuthUser;
      if ('user' in parsed && parsed.user) {
        return parsed.user;
      }

      return parsed as AuthUser;
    } catch {
      return null;
    }
  }

  private persistSession(session: AuthSession): void {
    this.currentUserSignal.set(session.user);

    if (!this.canUseStorage()) {
      return;
    }

    window.localStorage.setItem(this.sessionStorageKey, JSON.stringify(session));
  }

  private canUseStorage(): boolean {
    return isPlatformBrowser(this.platformId) && typeof window !== 'undefined';
  }
}