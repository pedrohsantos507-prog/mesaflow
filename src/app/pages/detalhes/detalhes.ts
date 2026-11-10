import { Component, OnInit, signal, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Produto } from '../../models/produto.model';
import { ProdutoService } from '../../service/produto';
import { CarrinhoService } from '../../service/carrinho';

@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './detalhes.html',
  styleUrl: './detalhes.css',
})
export class Detalhes implements OnInit {
  private route = inject(ActivatedRoute);
  private produtoService = inject(ProdutoService);
  private carrinhoService = inject(CarrinhoService);

  produto = signal<Produto | null>(null);
  carregando = signal(true);
  erro = signal('');
  mensagem = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.erro.set('Identificador inválido.');
      this.carregando.set(false);
      return;
    }

    this.produtoService.listarProdutos().subscribe({
      next: (produtos) => {
        const encontrado = produtos.find(p => p.id === id);

        if (encontrado) {
          this.produto.set(encontrado);
        } else {
          this.erro.set('Produto ou serviço não encontrado.');
        }
        this.carregando.set(false);
      },

      error: () => {
        this.erro.set('Não foi possivel consultar o item.');
        this.carregando.set(false);
      },
    });
  }

  adicionarAoCarrinho(): void {
    const produto = this.produto();

    if (produto) {
      this.carrinhoService.adicionarProduto(produto);
      this.mensagem.set('Item adicionado ao carrinho!');
    }
  }
}
