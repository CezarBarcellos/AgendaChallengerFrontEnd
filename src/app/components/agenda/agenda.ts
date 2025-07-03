import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CompromissosService, Compromisso } from '../../services/compromissos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compromissos',
  templateUrl: './agenda.html',
  styleUrls: ['./agenda.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CompromissosComponent implements OnInit {

  compromissos: Compromisso[] = [];
  modoEdicao = false;
  editandoIndex: number | null = null;

  formCompromisso!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private compromissosService: CompromissosService
  ) {}

  ngOnInit() {
    this.carregarCompromissos();
    this.criarFormulario();
  }

  criarFormulario() {
    this.formCompromisso = this.fb.group({
      titulo: ['', Validators.required],
      descricao: [''],
      inicio: ['', Validators.required],    // string ISO
      termino: ['', Validators.required],   // string ISO
      localizacao: [''],
      status: ['pendente', Validators.required],
    });
  }

carregarCompromissos() {
  this.compromissosService.listar().subscribe({
    next: (dados) => {
      // Mapeia o retorno para a interface Compromisso da UI
      this.compromissos = dados.lstCompromissos.map(item => ({
        id: item.id,
        titulo: item.titulo,
        descricao: item.descricao,
        inicio: item.dataInicio,
        termino: item.dataFim,
        localizacao: item.localizacao,
        status: item.status
      }));
      console.log('Compromissos carregados:', this.compromissos);
    },
    error: (err) => {
      console.error('Erro ao carregar compromissos', err);
    }
  });
}


  abrirNovo() {
    this.modoEdicao = true;
    this.editandoIndex = null;
    this.formCompromisso.reset({
      status: 'pendente',
      inicio: '',
      termino: ''
    });
  }

  abrirEdicao(index: number) {
    this.modoEdicao = true;
    this.editandoIndex = index;

    const c = this.compromissos[index];
    this.formCompromisso.setValue({
      titulo: c.titulo,
      descricao: c.descricao,
      inicio: c.inicio,    // ISO string
      termino: c.termino,  // ISO string
      localizacao: c.localizacao,
      status: c.status
    });
  }

  cancelar() {
    this.modoEdicao = false;
    this.editandoIndex = null;
    this.formCompromisso.reset();
  }

  salvar() {
    if (this.formCompromisso.invalid) return;

    const formValue = this.formCompromisso.value;

    const compromissoPayload: Compromisso = {
      titulo: formValue.titulo,
      descricao: formValue.descricao,
      inicio: formValue.inicio,
      termino: formValue.termino,
      localizacao: formValue.localizacao,
      status: formValue.status,
      // id fica no backend
    };

    if (this.editandoIndex !== null) {
      const id = this.compromissos[this.editandoIndex].id!;
      this.compromissosService.editar(id, compromissoPayload).subscribe({
        next: c => {
          this.compromissos[this.editandoIndex!] = c;
          this.cancelar();
        },
        error: err => console.error('Erro ao editar compromisso', err)
      });
    } else {
      this.compromissosService.cadastrar(compromissoPayload).subscribe({
        next: c => {
          this.compromissos.push(c);
          this.cancelar();
        },
        error: err => console.error('Erro ao cadastrar compromisso', err)
      });
    }
  }

  onExcluir(index: number) {
    const compromisso = this.compromissos[index];
    if (compromisso.id && confirm('Tem certeza que deseja excluir este compromisso?')) {
      this.compromissosService.excluir(compromisso.id).subscribe({
        next: () => {
          this.compromissos.splice(index, 1);
        },
        error: err => console.error('Erro ao excluir compromisso', err)
      });
    }
  }
}
