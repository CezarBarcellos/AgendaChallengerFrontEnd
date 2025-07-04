import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/env.dev';

export interface TokenRequest {
  nome: string;
  senha: string;
}

export interface TokenResponse {
  sucesso: boolean;
  token?: string;
  mensagem?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private apiUrl = environment.apiUrl;
  nomeT = environment.token.nome;
  senhaT = environment.token.senha;

  constructor(private http: HttpClient) {}

  getToken(): Observable<TokenResponse> {
    const credentials: TokenRequest = {
      nome: this.nomeT,
      senha: this.senhaT
    };

    return this.http.post<TokenResponse>(this.apiUrl + 'Login', credentials);
  }
}
