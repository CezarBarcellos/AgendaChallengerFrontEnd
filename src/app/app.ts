import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './components/home/home';
import { CompromissosComponent } from './components/agenda/agenda';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  imports: [RouterOutlet, CompromissosComponent, Home]
})
export class App {
  protected title = 'Agenda';
}
