import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { TokenService } from './token.services';
import { environment } from '../../environments/env.dev';

export interface Compromisso {
  id?: string;
  titulo: string;
  descricao: string;
  inicio: string;
  termino: string;
  localizacao: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
}

export interface ListaCompromissosResponse {
  lstCompromissos: Array<{
    titulo: string;
    descricao: string;
    dataInicio: string;
    dataFim: string;
    localizacao: string;
    status: 'confirmado' | 'pendente' | 'cancelado';
    id?: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class CompromissosService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  private criarHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: ` ${token}`
    });
  }

  listar(): Observable<ListaCompromissosResponse> {
    const body = {
      dataInicio: '2025-07-03T00:00:00Z',
      dataFim: '2025-07-03T23:59:59Z'
    };

    return this.tokenService.getToken().pipe(
      switchMap(res => {
        const headers = this.criarHeaders(res.token || '');
        return this.http.post<ListaCompromissosResponse>(this.apiUrl + 'ObterTodosCompromissos', body, { headers });
      })
    );
  }

  cadastrar(compromisso: Compromisso): Observable<Compromisso> {
    const payload = {
      titulo: compromisso.titulo,
      descricao: compromisso.descricao,
      dataInicio: compromisso.inicio,
      dataFim: compromisso.termino,
      localizacao: compromisso.localizacao,
      status: this.converterStatusParaNumero(compromisso.status)
    };

    return this.tokenService.getToken().pipe(
      switchMap(res => {
        const headers = this.criarHeaders(res.token || '');
        return this.http.post<Compromisso>(this.apiUrl + 'CriarCompromisso', payload, { headers });
      })
    );
  }

  editar(id: string, compromisso: Compromisso): Observable<Compromisso> {
    const payload = {
      id: id,
      titulo: compromisso.titulo,
      descricao: compromisso.descricao,
      dataInicio: compromisso.inicio,
      dataFim: compromisso.termino,
      localizacao: compromisso.localizacao,
      status: this.converterStatusParaNumero(compromisso.status)
    };

    return this.tokenService.getToken().pipe(
      switchMap(res => {
        const headers = this.criarHeaders(res.token || '');
        return this.http.post<Compromisso>(this.apiUrl + 'AtualizarCompromisso', payload, { headers });
      })
    );
  }

  excluir(id: string): Observable<void> {
    return this.tokenService.getToken().pipe(
      switchMap(res => {
        const headers = this.criarHeaders(res.token || '');
        return this.http.delete<void>(`${this.apiUrl}RemoverCompromisso?id=${id}`, { headers });
      })
    );
  }

  private converterStatusParaNumero(status: 'confirmado' | 'pendente' | 'cancelado'): number {
    switch (status) {
      case 'pendente': return 0;
      case 'confirmado': return 1;
      case 'cancelado': return 2;
      default: return 0;
    }
  }
}
