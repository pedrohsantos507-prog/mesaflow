import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { FuncionarioService } from '../../../service/funcionario';
import {
  Funcionario,
  FuncionarioCadastro,
  EnderecoFuncionario,
} from '../../../models/funcionario.model';

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
  excluindo = signal<number | null>(null);

  erro = signal('');
  mensagem = signal('');

  mostrarFormulario = signal(false);
  funcionarioEmEdicao = signal<number | null>(null);
  idEnderecoEmEdicao = signal(0);

  // Guarda os endereços para preservar os demais no PUT
  private enderecosOriginais: EnderecoFuncionario[] = [];

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

  // ABRIR OU CANCELAR FORMULÁRIO
  novoFuncionario(): void {
    if (this.salvando()) return;

    if (this.mostrarFormulario()) {
      this.mostrarFormulario.set(false);
    } else {
      this.formulario.reset();
      this.funcionarioEmEdicao.set(null);
      this.idEnderecoEmEdicao.set(0);
      this.enderecosOriginais = [];
      this.erro.set('');
      this.mensagem.set('');
      this.mostrarFormulario.set(true);
    }
  }

  // BUSCAR FUNCIONÁRIO PARA EDIÇÃO
  editarFuncionario(id: number): void {
    this.erro.set('');
    this.mensagem.set('');

    this.funcionarioService.buscarPorId(id).subscribe({
      next: (funcionario) => {
        const pessoa = funcionario.pessoa;
        const endereco = pessoa.enderecos?.[0];

        this.enderecosOriginais = [...(pessoa.enderecos ?? [])];

        this.funcionarioEmEdicao.set(funcionario.idPessoa);
        this.idEnderecoEmEdicao.set(endereco?.idEndereco ?? 0);

        this.formulario.patchValue({
          nome: pessoa.nome,
          cpf: pessoa.cpf,
          dataNascimento: pessoa.dataNascimento?.substring(0, 10),
          sexo: pessoa.sexo,
          email: pessoa.email,
          telefone: String(pessoa.telefone),
          ativoPessoa: pessoa.ativoPessoa,
          cargo: funcionario.cargo,
          dataAdmissao: funcionario.dataAdmissao?.substring(0, 10),
          cep: endereco?.cep ?? '',
          numero: endereco?.numero ?? '',
          complemento: endereco?.complemento ?? '',
        });

        this.mostrarFormulario.set(true);
      },
      error: (erro) => {
        console.error('Erro ao buscar funcionário:', erro);
        this.erro.set('Não foi possível carregar os dados do funcionário.');
      },
    });
  }

  // DECIDIR ENTRE POST E PUT
  salvarFuncionario(): void {
    if (this.funcionarioEmEdicao() === null) {
      this.cadastrarFuncionario();
    } else {
      this.atualizarFuncionario();
    }
  }

  // MONTAR OBJETO PARA API
  private montarFuncionario(idPessoa: number): FuncionarioCadastro {
    const dados = this.formulario.getRawValue();

    const enderecoAtual: EnderecoFuncionario = {
      idEndereco: idPessoa === 0 ? 0 : this.idEnderecoEmEdicao(),
      idPessoa,
      cep: dados.cep,
      numero: dados.numero,
      complemento: dados.complemento,
    };

    const outrosEnderecos =
      idPessoa === 0
        ? []
        : this.enderecosOriginais.filter((e) => e.idEndereco !== this.idEnderecoEmEdicao());

    return {
      idPessoa,
      cargo: dados.cargo,
      dataAdmissao: dados.dataAdmissao,
      pessoa: {
        idPessoa,
        nome: dados.nome,
        cpf: dados.cpf,
        dataNascimento: dados.dataNascimento,
        sexo: dados.sexo,
        email: dados.email,
        telefone: Number(dados.telefone),
        ativoPessoa: dados.ativoPessoa,
        enderecos: [enderecoAtual, ...outrosEnderecos],
      },
    };
  }

  // POST - CADASTRAR
  cadastrarFuncionario(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const funcionario = this.montarFuncionario(0);

    this.salvando.set(true);
    this.erro.set('');
    this.mensagem.set('');

    this.funcionarioService.cadastrar(funcionario).subscribe({
      next: () => {
        this.salvando.set(false);
        this.mensagem.set('Funcionário cadastrado com sucesso!');
        this.limparFormulario();
        this.carregarFuncionarios();
      },
      error: (erro) => {
        console.error('Erro ao cadastrar funcionário:', erro);
        this.erro.set(erro.error?.mensagem || 'Não foi possível cadastrar o funcionário.');
        this.salvando.set(false);
      },
    });
  }

  // PUT - ATUALIZAR
  atualizarFuncionario(): void {
    const id = this.funcionarioEmEdicao();

    if (id === null) return;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const funcionario = this.montarFuncionario(id);

    this.salvando.set(true);
    this.erro.set('');
    this.mensagem.set('');

    this.funcionarioService.atualizar(id, funcionario).subscribe({
      next: () => {
        this.salvando.set(false);
        this.mensagem.set('Funcionário atualizado com sucesso!');
        this.limparFormulario();
        this.carregarFuncionarios();
      },
      error: (erro) => {
        console.error('Erro ao atualizar funcionário:', erro);
        this.erro.set(erro.error?.mensagem || 'Não foi possível atualizar o funcionário.');
        this.salvando.set(false);
      },
    });
  }

  // DELETE - EXCLUIR
  excluirFuncionario(id: number): void {
    if (this.salvando() || this.excluindo() !== null) return;

    const confirmado = window.confirm('Deseja realmente excluir este funcionário?');

    if (!confirmado) return;

    this.excluindo.set(id);
    this.erro.set('');
    this.mensagem.set('');

    this.funcionarioService.excluir(id).subscribe({
      next: () => {
        this.excluindo.set(null);
        this.mensagem.set('Funcionário excluído com sucesso!');

        if (this.funcionarioEmEdicao() === id) {
          this.limparFormulario();
        }

        this.carregarFuncionarios();
      },
      error: (erro) => {
        console.error('Erro ao excluir funcionário:', erro);

        this.erro.set(
          erro.status === 409
            ? 'Funcionário possui atendimentos vinculados e não pode ser excluído.'
            : 'Não foi possível excluir o funcionário.',
        );

        this.excluindo.set(null);
      },
    });
  }

  // LIMPAR FORMULÁRIO
  private limparFormulario(): void {
    this.formulario.reset();
    this.funcionarioEmEdicao.set(null);
    this.idEnderecoEmEdicao.set(0);
    this.enderecosOriginais = [];
    this.mostrarFormulario.set(false);
  }
}
