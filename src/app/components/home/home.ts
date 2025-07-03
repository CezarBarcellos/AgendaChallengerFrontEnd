import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService, LoginRequest } from '../../services/login.services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home {
  username: string = '';
  password: string = '';
  erro: string = '';

  constructor(private authService: LoginService, private router: Router) {}

  onSubmit() {
    const loginPayload: LoginRequest = {
      usuario: this.username,
      senha: this.password
    };

    this.authService.login(loginPayload).subscribe({
      next: (res) => {
        if (res.sucesso) {
          console.log('Autenticado com sucesso! Token:', res.token);
          this.router.navigate(['/agenda']);
        } else {
          this.erro = res.mensagem || 'Usuário ou senha inválidos';
        }
      },
      error: (err) => {
        console.error('Erro de autenticação:', err);
        this.erro = 'Erro ao autenticar. Verifique o console.';
      }
    });
  }

  onClear() {
    this.username = '';
    this.password = '';
    this.erro = '';
  }
}
