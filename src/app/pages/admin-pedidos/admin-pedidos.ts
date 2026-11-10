import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { AdminPedidoService, PedidoAdmin } from '../../service/admin-pedido';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './admin-pedidos.html',
  styleUrl: './admin-pedidos.css',
})
export class AdminPedidos implements OnInit {
  private service = inject(AdminPedidoService);
  private cdr = inject(ChangeDetectorRef);

  pedidos: PedidoAdmin[] = [];
  pesquisa = '';
  filtroStatus = '';
  carregando = false;
  salvandoId: number | null = null;
  erro = '';
  mensagem = '';

  pedidoSelecionado: PedidoAdmin | null = null;

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';

    this.service.listar().subscribe({
      next: (resposta) => {
        this.pedidos = resposta;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Não foi possível carregar os pedidos.';
        this.carregando = false;
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
  }

  fecharDetalhes(): void {
    this.pedidoSelecionado = null;
  }

  atualizarStatus(pedido: PedidoAdmin, novoStatus: string): void {
    if (this.salvandoId !== null) {
      return;
    }

    if (novoStatus === pedido.statusAtendimento) {
      return;
    }

    // Cancelamento exige uma regra própria
    // para devolução de estoque.
    if (novoStatus === 'C') {
      this.erro = 'Cancelamento ainda não está disponível.';
      this.cdr.detectChanges();
      return;
    }

    this.salvandoId = pedido.idAtendimento;
    this.erro = '';
    this.mensagem = '';

    this.service.atualizarStatus(pedido.idAtendimento, novoStatus).subscribe({
      next: () => {
        pedido.statusAtendimento = novoStatus;

        this.salvandoId = null;
        this.mensagem = `Pedido #${pedido.idAtendimento} atualizado.`;

        this.cdr.detectChanges();
      },
      error: (erro) => {
        this.salvandoId = null;
        this.erro =
          erro.status === 403
            ? 'Você não possui permissão para alterar pedidos.'
            : erro.status === 401
              ? 'Faça login como administrador.'
              : 'Não foi possível atualizar o pedido.';

        this.cdr.detectChanges();
      },
    });
  }
}
