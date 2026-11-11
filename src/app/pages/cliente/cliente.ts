import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { PessoaService } from '../../service/pessoa';
import { Pessoa } from '../../models/pessoa.model';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css',
})
export class Cliente implements OnInit {
  private pessoaService = inject(PessoaService);
  private cdr = inject(ChangeDetectorRef);

  // Lista de clientes
  pessoas: Pessoa[] = [];

  // Cliente selecionado para visualizar detalhes
  clienteSelecionado: Pessoa | null = null;

  // Cliente selecionado para edição
  clienteEmEdicao: Pessoa | null = null;

  // Estados de carregamento
  carregando = true;
  carregandoDetalhes = false;
  carregandoEdicao = false;

  // Estados de salvamento
  salvandoEdicao = false;

  // Mensagens
  erro = '';
  erroDetalhes = '';
  erroEdicao = '';
  mensagemEdicao = '';

  ngOnInit(): void {
    this.carregarClientes();
  }

  // LISTAR CLIENTES
  carregarClientes(): void {
    this.carregando = true;
    this.erro = '';

    this.pessoaService.listarPessoas().subscribe({
      next: (resposta: Pessoa[]) => {
        this.pessoas = resposta;
        this.carregando = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.erro = 'Não foi possível carregar os clientes.';
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  // VISUALIZAR DETALHES
  verDetalhes(idPessoa: number): void {
    this.clienteSelecionado = null;
    this.clienteEmEdicao = null;

    this.carregandoEdicao = false;
    this.carregandoDetalhes = true;

    this.erroDetalhes = '';
    this.erroEdicao = '';
    this.mensagemEdicao = '';

    this.pessoaService.buscarPorId(idPessoa).subscribe({
      next: (resposta: Pessoa | Pessoa[]) => {
        const cliente = Array.isArray(resposta)
          ? resposta.find((p) => p.idPessoa === idPessoa)
          : resposta;

        if (!cliente) {
          this.erroDetalhes = 'Cliente não encontrado.';
        } else {
          this.clienteSelecionado = cliente;
        }

        this.carregandoDetalhes = false;
        this.cdr.detectChanges();
      },

      error: (erro) => {
        this.erroDetalhes =
          erro.status === 404 ? 'Cliente não encontrado.' : 'Não foi possível consultar o cliente.';

        this.carregandoDetalhes = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ABRIR EDIÇÃO
  editarCliente(idPessoa: number): void {
    this.clienteEmEdicao = null;
    this.clienteSelecionado = null;

    this.carregandoDetalhes = false;
    this.carregandoEdicao = true;

    this.erroDetalhes = '';
    this.erroEdicao = '';
    this.mensagemEdicao = '';

    this.pessoaService.buscarPorId(idPessoa).subscribe({
      next: (resposta: Pessoa | Pessoa[]) => {
        const cliente = Array.isArray(resposta)
          ? resposta.find((p) => p.idPessoa === idPessoa)
          : resposta;

        if (!cliente) {
          this.erroEdicao = 'Cliente não encontrado.';
        } else {
          // Cria uma cópia para edição
          this.clienteEmEdicao = {
            ...cliente,
            enderecos: cliente.enderecos?.map((endereco) => ({ ...endereco })) ?? [],
          };
        }

        this.carregandoEdicao = false;
        this.cdr.detectChanges();
      },

      error: (erro) => {
        this.erroEdicao =
          erro.status === 404
            ? 'Cliente não encontrado.'
            : 'Não foi possível carregar os dados para edição.';

        this.carregandoEdicao = false;
        this.cdr.detectChanges();
      },
    });
  }

  // CANCELAR EDIÇÃO
  cancelarEdicao(): void {
    this.clienteEmEdicao = null;
    this.carregandoEdicao = false;
    this.erroEdicao = '';
    this.mensagemEdicao = '';
  }

  // FECHAR DETALHES
  fecharDetalhes(): void {
    this.clienteSelecionado = null;
    this.carregandoDetalhes = false;
    this.erroDetalhes = '';
  }
}
