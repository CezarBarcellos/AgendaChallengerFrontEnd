import { Component } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCheckCircle, faClock, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
   selector: 'app-compromissos',
  standalone: true,      // <- importante
  imports: [CommonModule,FontAwesomeModule], // ou outros módulos que você usa no template
  templateUrl: './agenda.html',
  styleUrls: ['./agenda.scss']
})
export class CompromissosComponent {
  compromissos = [
    {
      titulo: 'Reunião com cliente',
      descricao: 'Apresentar proposta comercial',
      dataHoraInicio: new Date('2025-07-05T10:00:00'),
      dataHoraTermino: new Date('2025-07-05T11:00:00'),
      localizacao: 'Sala 3',
      status: 'confirmado'
    },
    // outros compromissos...
  ];

  constructor(library: FaIconLibrary) {
    library.addIcons(faCheckCircle, faClock, faTimesCircle);
  }
}
