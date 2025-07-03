import { Routes } from '@angular/router';
import { CompromissosComponent } from './components/agenda/agenda';
import { Home } from './components/home/home'; // opcional, se for usar em outras rotas

export const routes: Routes = [
  { path: '', component: CompromissosComponent },        // ← Página inicial
  { path: 'home', component: Home }       // ← Rota opcional
];