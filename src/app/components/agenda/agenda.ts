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
  editandoId: string | null = null;

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
        this.compromissos = dados.lstCompromissos.map(item => ({
          id: String(item.id),  // Forçar id como string
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
    this.editandoId = null;
    this.formCompromisso.reset({
      status: 'pendente',
      inicio: '',
      termino: ''
    });
  }

abrirEdicao(id: string) {
  this.modoEdicao = true;

  const index = this.compromissos.findIndex(c => c.id === id);
  if (index === -1) return;

  const c = this.compromissos[index];
  this.editandoId = c.id ?? null;

  this.formCompromisso.setValue({
    titulo: c.titulo,
    descricao: c.descricao,
    inicio: c.inicio,
    termino: c.termino,
    localizacao: c.localizacao,
    status: c.status
  });
}

  cancelar() {
    this.modoEdicao = false;
    this.editandoId = null;
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
      // id é gerado no backend
    };

    if (this.editandoId) {
      this.compromissosService.editar(this.editandoId, compromissoPayload).subscribe({
        next: c => {
          // Atualizar compromisso na lista, garantindo comparação string === string
          const idx = this.compromissos.findIndex(comp => comp.id === this.editandoId);
          if (idx !== -1) this.compromissos[idx] = {
            ...c,
            id: String(c.id)  // garantir id string no retorno
          };
          this.cancelar();
        },
        error: err => console.error('Erro ao editar compromisso', err)
      });
    } else {
      this.compromissosService.cadastrar(compromissoPayload).subscribe({
        next: c => {
          this.compromissos.push({
            ...c,
            id: String(c.id)  // garantir id string no retorno
          });
          this.cancelar();
        },
        error: err => console.error('Erro ao cadastrar compromisso', err)
      });
    }
  }

onExcluir(id: string) {
  if (!id) return;
  if (confirm('Tem certeza que deseja excluir este compromisso?')) {
    this.compromissosService.excluir(id).subscribe({
      next: () => {
        const idx = this.compromissos.findIndex(c => c.id === id);
        if (idx !== -1) this.compromissos.splice(idx, 1);
      },
      error: err => console.error('Erro ao excluir compromisso', err)
    });
  }
}
}
