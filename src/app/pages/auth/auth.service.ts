import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { JwtAuthResponseDto, JwtPayload, LoginDto, RegisterDto } from './auth.model';
import { environment } from '../../../environments/environment';

// const API_URL = process.env['API_URL'];


const STORAGE_KEY = 'eventos_auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;
  // private readonly baseUrl = `${API_URL}/auth`;

  private readonly tokenSignal = signal<string | null>(this.readStoredToken());

  /** true si hay un token presente y no expirado */
  readonly isAuthenticated = computed(() => {
    const token = this.tokenSignal();
    return !!token && !this.isExpired(token);
  });

  /** username (claim "sub") extraído del JWT, o null si no hay sesión */
  readonly username = computed(() => this.decode(this.tokenSignal())?.sub ?? null);

  /** roles extraídos del JWT, si el backend los incluye como claim */
  readonly roles = computed(() => this.decode(this.tokenSignal())?.roles ?? []);

  login(dto: LoginDto): Observable<JwtAuthResponseDto> {
    return this.http.post<JwtAuthResponseDto>(`${this.baseUrl}/login`, dto).pipe(
      tap((response) => this.setSession(response)),
    );
  }

  register(dto: RegisterDto): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, dto, { responseType: 'text' });
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.tokenSignal.set(null);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private setSession(response: JwtAuthResponseDto): void {
    localStorage.setItem(STORAGE_KEY, response.accessToken);
    this.tokenSignal.set(response.accessToken);
  }

  private readStoredToken(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  }

  private decode(token: string | null): JwtPayload | null {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }

  private isExpired(token: string): boolean {
    const payload = this.decode(token);
    if (!payload?.exp) return false;
    return Date.now() >= payload.exp * 1000;
  }
}
