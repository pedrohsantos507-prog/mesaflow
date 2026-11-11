import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { AdminPedidoService, PedidoAdmin } from '../../service/admin-pedido';

import { FuncionarioService } from '../../service/funcionario';
import { Funcionario } from '../../models/funcionario.model';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './admin-pedidos.html',
  styleUrl: './admin-pedidos.css',
})
export class AdminPedidos implements OnInit {
  private service = inject(AdminPedidoService);
  private funcionarioService = inject(FuncionarioService);
  private cdr = inject(ChangeDetectorRef);

  pedidos: PedidoAdmin[] = [];
  funcionarios: Funcionario[] = [];

  pesquisa = '';
  filtroStatus = '';
  carregando = false;
  salvandoId: number | null = null;
  erro = '';
  mensagem = '';

  pedidoSelecionado: PedidoAdmin | null = null;

  idFuncionarioSelecionado: number | null = null;
  salvandoFuncionario = false;
  carregandoFuncionarios = false;

  ngOnInit(): void {
    this.carregar();
    this.carregarFuncionarios();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';

    this.service.listar().subscribe({
      next: (resposta) => {
        this.pedidos = resposta;
        this.carregando = false;

        if (this.pedidoSelecionado) {
          this.pedidoSelecionado =
            this.pedidos.find((p) => p.idAtendimento === this.pedidoSelecionado?.idAtendimento) ??
            null;
        }

        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Não foi possível carregar os pedidos.';
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  carregarFuncionarios(): void {
    this.carregandoFuncionarios = true;

    this.funcionarioService.listar().subscribe({
      next: (resposta) => {
        this.funcionarios = resposta;
        this.carregandoFuncionarios = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Não foi possível carregar os funcionários.';
        this.carregandoFuncionarios = false;
        this.cdr.detectChanges();
      },
    });
  }

  get pedidosFiltrados(): PedidoAdmin[] {
    const termo = this.pesquisa.trim().toLowerCase();

    return this.pedidos.filter((pedido) => {
      const correspondePesquisa =
        pedido.nomePessoa.toLowerCase().includes(termo) ||
        pedido.idAtendimento.toString().includes(termo);

      const correspondeStatus =
        !this.filtroStatus || pedido.statusAtendimento === this.filtroStatus;

      return correspondePesquisa && correspondeStatus;
    });
  }

  total(pedido: PedidoAdmin): number {
    return pedido.itens.reduce((soma, item) => soma + item.quantidade * item.valorUnitario, 0);
  }

  visualizar(pedido: PedidoAdmin): void {
    this.pedidoSelecionado = pedido;

    const ids = pedido.itens
      .map((item) => item.idFuncionario)
      .filter((id): id is number => id !== null);

    this.idFuncionarioSelecionado =
      ids.length > 0 && ids.every((id) => id === ids[0]) ? ids[0] : null;
  }

  fecharDetalhes(): void {
    this.pedidoSelecionado = null;
    this.idFuncionarioSelecionado = null;
  }

  atribuirFuncionario(pedido: PedidoAdmin): void {
    if (this.idFuncionarioSelecionado === null || this.salvandoFuncionario) {
      return;
    }

    const idFuncionario = this.idFuncionarioSelecionado;

    this.salvandoFuncionario = true;
    this.erro = '';
    this.mensagem = '';

    this.service.atribuirFuncionario(pedido.idAtendimento, idFuncionario).subscribe({
      next: () => {
        this.salvandoFuncionario = false;
        this.mensagem = `Funcionário atribuído ao pedido #${pedido.idAtendimento}.`;

        this.carregar();
      },
      error: (erro) => {
        this.salvandoFuncionario = false;

        this.erro =
          erro.status === 403
            ? 'Você não possui permissão para atribuir funcionários.'
            : erro.status === 401
              ? 'Faça login como administrador.'
              : erro.error?.mensagem || 'Não foi possível atribuir o funcionário.';

        this.cdr.detectChanges();
      },
    });
  }

  atualizarStatus(pedido: PedidoAdmin, novoStatus: string): void {
    if (this.salvandoId !== null || this.salvandoFuncionario) {
      return;
    }

    if (novoStatus === pedido.statusAtendimento) {
      return;
    }

    // Cancelamento permitido somente para pedidos abertos.
    if (novoStatus === 'C') {
      if (pedido.statusAtendimento !== 'A') {
        this.erro = 'Somente pedidos em aberto podem ser cancelados.';
        this.cdr.detectChanges();
        return;
      }

      const confirmou = window.confirm(
        `Deseja realmente cancelar o pedido #${pedido.idAtendimento}?\n\n` +
          'Os produtos serão devolvidos ao estoque.',
      );

      if (!confirmou) {
        this.cdr.detectChanges();
        return;
      }
    }

    this.salvandoId = pedido.idAtendimento;
    this.erro = '';
    this.mensagem = '';

    this.service.atualizarStatus(pedido.idAtendimento, novoStatus).subscribe({
      next: () => {
        pedido.statusAtendimento = novoStatus;
        this.salvandoId = null;

        this.mensagem =
          novoStatus === 'C'
            ? `Pedido #${pedido.idAtendimento} cancelado. Estoque devolvido.`
            : `Pedido #${pedido.idAtendimento} atualizado.`;

        this.cdr.detectChanges();
      },
      error: (erro) => {
        this.salvandoId = null;

        this.erro =
          erro.status === 409
            ? erro.error?.mensagem || 'Não é possível alterar este pedido.'
            : erro.status === 403
              ? 'Você não possui permissão para alterar pedidos.'
              : erro.status === 401
                ? 'Faça login como administrador.'
                : erro.error?.mensagem || 'Não foi possível atualizar o pedido.';

        // Restaura a situação real do pedido no seletor.
        this.carregar();
        this.cdr.detectChanges();
      },
    });
  }
}
