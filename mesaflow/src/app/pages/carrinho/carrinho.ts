
import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CarrinhoService } from '../../service/carrinho';

@Component({
  selector: 'app-carrinho',
  imports: [CurrencyPipe],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class Carrinho {

  carrinhoService = inject(CarrinhoService);

  itens = this.carrinhoService.itens;

  total = computed(() =>
    this.itens().reduce(
      (soma, produto) => soma + produto.preco,
      0
    )
  );

  removerProduto(indice: number): void {
    this.carrinhoService.removerProduto(indice);
  }

  limparCarrinho(): void {
    this.carrinhoService.limparCarrinho();
  }
}
