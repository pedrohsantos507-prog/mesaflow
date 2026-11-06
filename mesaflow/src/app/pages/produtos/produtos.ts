import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Produto } from '../../models/produto.models';
import { CarrinhoService } from '../../service/carrinho';

@Component({
  selector: 'app-produtos',
  imports: [CurrencyPipe],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css',
})
export class Produtos {
  produtos: Produto[] = [ 
    {
    id: 1,
    nome: 'Hambúrguer Artesanal',
    descricao: 'Pão, carne, queijo e salada',
    preco: 25.90,
    imagem: ''
  },
  {
    id: 2,
    nome:'Pizza de calabresa',
    descricao:'molho,mussarela e calabresa',
    preco: 49.90,
    imagem:''
  },
  {
    id: 3,
    nome:'Refrigerante',
    descricao:'Lata de 350ml',
    preco: 6.50,
    imagem:''
  }
 ];

 private carrinhoService = inject(CarrinhoService);

 adicionarAoCarrinho(produto: Produto): void {
  this.carrinhoService.adicionarProduto(produto);
 }

}
