import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService, PedidoHistorico } from '../../service/pedido';

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meus-pedidos.html',
  styleUrl: './meus-pedidos.css',
})
export class MeusPedidos implements OnInit {
  private pedidoService = inject(PedidoService);
  private cdr = inject(ChangeDetectorRef);

  pedidos: PedidoHistorico[] = [];
  carregando = true;
  erro = '';

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.carregando = true;
    this.erro = '';

    this.pedidoService.listarMeusPedidos().subscribe({
      next: (resposta) => {
        this.pedidos = resposta;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        this.carregando = false;

        if (erro.status === 401) {
          this.erro = 'Faça login para visualizar seus pedidos.';
        } else {
          this.erro = 'Não foi possível carregar seus pedidos.';
        }

        this.cdr.detectChanges();
      },
    });
  }

  calcularTotal(pedido: PedidoHistorico): number {
    return pedido.itens.reduce((total, item) => total + item.quantidade * item.valorUnitario, 0);
  }

  descricaoStatus(status: string): string {
    switch (status) {
      case 'A':
        return 'Aberto';
      case 'F':
        return 'Finalizado';
      case 'C':
        return 'Cancelado';
      default:
        return status;
    }
  }
}
