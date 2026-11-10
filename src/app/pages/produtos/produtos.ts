
import {Component,computed,inject,OnInit,signal} from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Produto } from '../../models/produto.model';
import { CarrinhoService } from '../../service/carrinho';
import { ProdutoService } from '../../service/produto';


@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css'
})
export class Produtos implements OnInit {

  produtos = signal<Produto[]>([]);
  carregando = signal(true);
  erro = signal('');

  pesquisa = signal('');
  tipoSelecionado = signal('Todos');
  categoriaSelecionada = signal('Todas');

  private carrinhoService = inject(CarrinhoService);
  private produtoService = inject(ProdutoService);

  categorias = computed(() => {
    const ids = this.produtos().map(p => p.idCategoria);
    return [...new Set(ids)].sort((a, b) => a - b);
  });

  produtosFiltrados = computed(() => {

    const nome = this.pesquisa().toLowerCase().trim();
    const tipo = this.tipoSelecionado();
    const categoria = this.categoriaSelecionada();

    return this.produtos().filter(produto => {

      const correspondeNome =
        produto.nome.toLowerCase().includes(nome);

      const correspondeTipo =
        tipo === 'Todos' || produto.tipo === tipo;

      const correspondeCategoria =
        categoria === 'Todas' ||
        produto.idCategoria.toString() === categoria;

      return correspondeNome &&
        correspondeTipo &&
        correspondeCategoria;
    });
  });

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {

    this.carregando.set(true);
    this.erro.set('');

    this.produtoService.listarProdutos().subscribe({

      next: (dados) => {
        this.produtos.set(dados);
        this.carregando.set(false);
      },

      error: (erro) => {
        console.error('Erro ao carregar catálogo:', erro);

        this.erro.set(
          'Não foi possível carregar o catálogo.'
        );

        this.carregando.set(false);
      }
    });
  }

  adicionarAoCarrinho(produto: Produto): void {
    this.carrinhoService.adicionarProduto(produto);
  }
}
