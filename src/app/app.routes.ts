import { Routes } from '@angular/router';
import { CompromissosComponent } from './components/agenda/agenda';
import { Home } from './components/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'agenda', component: CompromissosComponent }
];
