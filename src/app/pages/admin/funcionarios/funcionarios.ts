import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { FuncionarioService } from '../../../service/funcionario';
import { Funcionario, FuncionarioCadastro } from '../../../models/funcionario.model';

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.css',
})
export class Funcionarios implements OnInit {
  private funcionarioService = inject(FuncionarioService);
  private fb = inject(FormBuilder);

  funcionarios = signal<Funcionario[]>([]);
  carregando = signal(false);
  salvando = signal(false);
  erro = signal('');
  mensagem = signal('');

  mostrarFormulario = signal(false);

  formulario = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    dataNascimento: ['', Validators.required],
    sexo: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    ativoPessoa: ['A', Validators.required],
    cargo: ['', Validators.required],
    dataAdmissao: ['', Validators.required],
    cep: ['', Validators.required],
    numero: ['', Validators.required],
    complemento: [''],
  });

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  carregarFuncionarios(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.funcionarioService.listar().subscribe({
      next: (dados) => {
        this.funcionarios.set(dados);
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error('Erro ao carregar funcionários:', erro);
        this.erro.set('Não foi possível carregar os funcionários.');
        this.carregando.set(false);
      },
    });
  }

  cadastrarFuncionario(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const dados = this.formulario.getRawValue();

    const funcionario: FuncionarioCadastro = {
      idPessoa: 0,
      cargo: dados.cargo,
      dataAdmissao: dados.dataAdmissao,
      pessoa: {
        idPessoa: 0,
        nome: dados.nome,
        cpf: dados.cpf,
        dataNascimento: dados.dataNascimento,
        sexo: dados.sexo,
        email: dados.email,
        telefone: Number(dados.telefone),
        ativoPessoa: dados.ativoPessoa,
        enderecos: [
          {
            idEndereco: 0,
            idPessoa: 0,
            cep: dados.cep,
            numero: dados.numero,
            complemento: dados.complemento,
          },
        ],
      },
    };

    this.salvando.set(true);
    this.erro.set('');
    this.mensagem.set('');

    this.funcionarioService.cadastrar(funcionario).subscribe({
      next: () => {
        this.salvando.set(false);
        this.mensagem.set('Funcionário cadastrado com sucesso!');
        this.formulario.reset();
        this.mostrarFormulario.set(false);
        this.carregarFuncionarios();
      },
      error: (erro) => {
        console.error('Erro ao cadastrar funcionário:', erro);
        this.erro.set(erro.error?.mensagem || 'Não foi possível cadastrar o funcionário.');
        this.salvando.set(false);
      },
    });
  }
}
