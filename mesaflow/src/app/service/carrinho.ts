import { Injectable, signal } from '@angular/core';
import { Produto } from '../models/produto.models';
export { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {

  private readonly itensSignal = signal<Produto[]>([]);

  readonly itens = this.itensSignal.asReadonly();

  adicionarProduto(produto: Produto): void {
    this.itensSignal.update(itens => [...itens, produto]);
  }

  removerProduto(indice: number):void {
    this.itensSignal.update(itens =>
      itens.filter((_, i) => i !== indice)
    );
  }

  limparCarrinho(): void {
    this.itensSignal.set([]);
  }
}
