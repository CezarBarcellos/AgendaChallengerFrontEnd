import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/env.dev';

export interface LoginRequest {
  usuario: string;
  senha: string;
}

export interface LoginResponse {
  sucesso: boolean;
  token?: string;
  mensagem?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl + 'AutenticarUsuario', credentials);
  }
}
