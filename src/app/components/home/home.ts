import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  username: string = '';
  password: string = '';

  onSubmit() {
    console.log('Login:', this.username, this.password);
    // Aqui você pode chamar um AuthService ou Mediar um request
  }

  onClear() {
    this.username = '';
    this.password = '';
  }
}
