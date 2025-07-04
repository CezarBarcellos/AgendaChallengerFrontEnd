import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Compromisso {
  id?: string;
  titulo: string;
  descricao: string;
  inicio: string;  // data em ISO string
  termino: string;
  localizacao: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
}

// Interface da resposta da API para listar compromissos
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

  private apiUrl = 'https://localhost:7068/';

  constructor(private http: HttpClient) {}

  listar(): Observable<ListaCompromissosResponse> {
    return this.http.post<ListaCompromissosResponse>(this.apiUrl+'ObterTodosCompromissos', {
      dataInicio: '2025-07-03T00:00:00Z',
      dataFim: '2025-07-03T23:59:59Z'
    });
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

  return this.http.post<Compromisso>(this.apiUrl+'CriarCompromisso', payload);
}

  editar(id: string, compromisso: Compromisso): Observable<Compromisso> {
  const payload = {
    id: id, // ← importante incluir o ID se a API exige
    titulo: compromisso.titulo,
    descricao: compromisso.descricao,
    dataInicio: compromisso.inicio,
    dataFim: compromisso.termino,
    localizacao: compromisso.localizacao,
    status: this.converterStatusParaNumero(compromisso.status)
  };

  return this.http.post<Compromisso>(this.apiUrl+'AtualizarCompromisso', payload);
}

excluir(id: string): Observable<void> {
  const url = this.apiUrl+`RemoverCompromisso?id=${id}`;
  return this.http.delete<void>(url);
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
