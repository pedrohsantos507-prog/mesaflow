
import { Injectable, signal } from '@angular/core';
import { Produto } from '../models/produto.model';

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private readonly itensSignal = signal<ItemCarrinho[]>([]);

  readonly itens = this.itensSignal.asReadonly();

  adicionarProduto(produto: Produto): void {
    this.itensSignal.update(itens => {

      const existente = itens.find(
        item => item.produto.id === produto.id
      );

      if (existente) {
        return itens.map(item =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...itens, { produto, quantidade: 1 }];
    });
  }

  alterarQuantidade(idProduto: number, quantidade: number): void {

    if (!Number.isInteger(quantidade) || quantidade < 1) {
      return;
    }

    this.itensSignal.update(itens =>
      itens.map(item =>
        item.produto.id === idProduto
          ? { ...item, quantidade }
          : item
      )
    );
  }

  removerProduto(idProduto: number): void {
    this.itensSignal.update(itens =>
      itens.filter(item => item.produto.id !== idProduto)
    );
  }

  limparCarrinho(): void {
    this.itensSignal.set([]);
  }

  obterItensAgrupados(): ItemCarrinho[] {
    return this.itens();
  }
}
