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

  abaAtiva: 'tabela' | 'calendario' = 'tabela';
  diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  mesAtual = new Date();
  diasDoMes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private compromissosService: CompromissosService
  ) {}

  ngOnInit() {
    this.criarFormulario();
    this.carregarCompromissos();
  }

  criarFormulario() {
    this.formCompromisso = this.fb.group({
      titulo: ['', Validators.required],
      descricao: [''],
      inicio: ['', Validators.required],
      termino: ['', Validators.required],
      localizacao: [''],
      status: ['pendente', Validators.required],
    });
  }

  carregarCompromissos() {
    this.compromissosService.listar().subscribe({
      next: (dados) => {
        this.compromissos = dados.lstCompromissos.map(item => ({
          id: String(item.id),
          titulo: item.titulo,
          descricao: item.descricao,
          inicio: item.dataInicio,
          termino: item.dataFim,
          localizacao: item.localizacao,
          status: item.status
        }));
        this.gerarCalendario();
      },
      error: (err) => console.error('Erro ao carregar compromissos', err)
    });
  }

  abrirNovo() {
    this.modoEdicao = true;
    this.editandoId = null;

    const agora = new Date();
    const maisUmaHora = new Date(agora.getTime() + 60 * 60 * 1000);

    const formatarData = (data: Date): string => data.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm

    this.formCompromisso.reset({
      titulo: '',
      descricao: '',
      inicio: formatarData(agora),
      termino: formatarData(maisUmaHora),
      localizacao: '',
      status: 'pendente'
    });
  }

  abrirEdicao(id: string) {
    this.modoEdicao = true;
    const c = this.compromissos.find(c => c.id === id);
    if (!c) return;
    this.editandoId = c.id ?? null;

    const formatarData = (data: string | Date): string => {
      const d = new Date(data);
      return d.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
    };

    this.formCompromisso.setValue({
      titulo: c.titulo,
      descricao: c.descricao,
      inicio: formatarData(c.inicio),
      termino: formatarData(c.termino),
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
    };

    if (this.editandoId) {
      this.compromissosService.editar(this.editandoId, compromissoPayload).subscribe({
        next: c => {
          const idx = this.compromissos.findIndex(comp => comp.id === this.editandoId);
          if (idx !== -1) this.compromissos[idx] = { ...c, id: String(c.id) };
          this.gerarCalendario();
          this.cancelar();
        },
        error: err => console.error('Erro ao editar compromisso', err)
      });
    } else {
      this.compromissosService.cadastrar(compromissoPayload).subscribe({
        next: c => {
          this.compromissos.push({ ...c, id: String(c.id) });
          this.gerarCalendario();
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
          this.gerarCalendario();
        },
        error: err => console.error('Erro ao excluir compromisso', err)
      });
    }
  }

  getTextoStatus(status: any): string {
    switch (status) {
      case '0': case 0: return 'Cancelado';
      case '1': case 1: return 'Confirmado';
      case '2': case 2: return 'Pendente';
      case 'confirmado': return 'Confirmado';
      case 'pendente': return 'Pendente';
      case 'cancelado': return 'Cancelado';
      default: return 'Desconhecido';
    }
  }

  visualizarCalendario() {
    this.abaAtiva = 'calendario';
    this.gerarCalendario();
  }

  gerarCalendario() {
    const ano = this.mesAtual.getFullYear();
    const mes = this.mesAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const primeiroDiaSemana = primeiroDia.getDay();
    const totalCelulas = primeiroDiaSemana + diasNoMes;
    const dias: any[] = [];

    for (let i = 0; i < totalCelulas; i++) {
      if (i < primeiroDiaSemana) {
        dias.push({ vazio: true });
      } else {
        const diaNumero = i - primeiroDiaSemana + 1;
        const data = new Date(ano, mes, diaNumero);
        const hoje = this.ehMesmoDia(data, new Date());
        const compromissosDoDia = this.compromissos.filter(c =>
          this.ehMesmoDia(new Date(c.inicio), data)
        );

        dias.push({ numero: diaNumero, data, compromissos: compromissosDoDia, hoje });
      }
    }

    this.diasDoMes = dias;
  }

  ehMesmoDia(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }
}
