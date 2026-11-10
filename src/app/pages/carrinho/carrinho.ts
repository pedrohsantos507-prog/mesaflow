
import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { CarrinhoService } from '../../service/carrinho';
import { PedidoService, FinalizarPedido } from '../../service/pedido';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class Carrinho {

  carrinhoService = inject(CarrinhoService);
  private pedidoService = inject(PedidoService);

  itens = this.carrinhoService.itens;

  carregando = signal(false);
  mensagem = signal('');
  erro = signal('');

  total = computed(() =>
    this.itens().reduce(
      (soma, item) =>
        soma + item.produto.preco * item.quantidade,
      0
    )
  );

  aumentarQuantidade(idProduto: number): void {
    const item = this.itens().find(
      i => i.produto.id === idProduto
    );

    if (item) {
      this.carrinhoService.alterarQuantidade(
        idProduto,
        item.quantidade + 1
      );
    }
  }

  diminuirQuantidade(idProduto: number): void {
    const item = this.itens().find(
      i => i.produto.id === idProduto
    );

    if (item && item.quantidade > 1) {
      this.carrinhoService.alterarQuantidade(
        idProduto,
        item.quantidade - 1
      );
    }
  }

  removerProduto(idProduto: number): void {
    this.carrinhoService.removerProduto(idProduto);
  }

  limparCarrinho(): void {
    this.carrinhoService.limparCarrinho();
  }

  finalizarPedido(): void {

    if (this.carregando()) {
      return;
    }

    if (this.itens().length === 0) {
      this.erro.set('Seu carrinho está vazio.');
      return;
    }

    this.mensagem.set('');
    this.erro.set('');

    const pedido: FinalizarPedido = {
      itens: this.itens().map(item => ({
        idItem: item.produto.id,
        quantidade: item.quantidade
      }))
    };

    this.carregando.set(true);

    this.pedidoService.finalizarPedido(pedido).subscribe({
      next: resposta => {
        this.carregando.set(false);

        this.carrinhoService.limparCarrinho();

        this.mensagem.set(
          `Pedido #${resposta.idAtendimento} realizado com sucesso! ` +
          `Total: R$ ${resposta.total.toFixed(2)}. ` +
          `Aguardando um funcionário assumir.`
        );
      },

      error: (erro: HttpErrorResponse) => {
        this.carregando.set(false);

        if (erro.status === 401) {
          this.erro.set(
            'Você precisa fazer login antes de finalizar o pedido.'
          );
        }
        else if (erro.status === 403) {
          this.erro.set(
            'Você não tem permissão para realizar esta operação.'
          );
        }
        else if (erro.status === 400) {
          this.erro.set(
            erro.error?.mensagem ??
            'Verifique os itens e a disponibilidade em estoque.'
          );
        }
        else if (erro.status === 0) {
          this.erro.set(
            'Não foi possível conectar ao servidor.'
          );
        }
        else {
          this.erro.set(
            'Não foi possível finalizar o pedido. Tente novamente.'
          );
        }

        console.error('Erro ao finalizar pedido:', erro);
      }
    });
  }
}
