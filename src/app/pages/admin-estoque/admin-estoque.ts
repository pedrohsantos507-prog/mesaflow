import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminEstoqueService, ProdutoEstoque } from '../../service/admin-estoque';

@Component({
  selector: 'app-admin-estoque',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './admin-estoque.html',
  styleUrl: './admin-estoque.css',
})
export class AdminEstoque implements OnInit {
  private service = inject(AdminEstoqueService);
  private cdr = inject(ChangeDetectorRef);

  produtos: ProdutoEstoque[] = [];
  carregando = false;
  salvando = false;
  erro = '';
  mensagem = '';

  produtoSelecionado: ProdutoEstoque | null = null;
  carregandoDetalhes = false;
  erroDetalhes = '';
  // Dados do formulário
  idProduto = 0;
  quantidadeEntrada = 1;
  valorUnitario = 0;
  unidade = 'UN';

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';

    this.service.listar().subscribe({
      next: (resposta) => {
        this.produtos = resposta;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        this.carregando = false;

        this.erro =
          erro.status === 403
            ? 'Acesso permitido somente para administradores.'
            : erro.status === 401
              ? 'Faça login como administrador.'
              : 'Não foi possível consultar o estoque.';

        this.cdr.detectChanges();
      },
    });
  }

  get totalProdutos(): number {
    return this.produtos.length;
  }

  get disponiveis(): number {
    return this.produtos.filter((produto) => produto.quantidade > 5).length;
  }

  get estoqueBaixo(): number {
    return this.produtos.filter((produto) => produto.quantidade > 0 && produto.quantidade <= 5)
      .length;
  }

  get esgotados(): number {
    return this.produtos.filter((produto) => produto.quantidade === 0).length;
  }

  situacao(quantidade: number): string {
    if (quantidade === 0) {
      return 'Esgotado';
    }

    if (quantidade <= 5) {
      return 'Estoque baixo';
    }

    return 'Disponível';
  }

  registrarEntrada(): void {
    if (
      !this.idProduto ||
      !Number.isInteger(this.quantidadeEntrada) ||
      this.quantidadeEntrada <= 0 ||
      !Number.isFinite(this.valorUnitario) ||
      this.valorUnitario < 0
    ) {
      this.erro = 'Preencha corretamente os dados da entrada.';
      return;
    }

    this.salvando = true;
    this.erro = '';
    this.mensagem = '';

    this.service
      .registrarEntrada({
        idItem: this.idProduto,
        dataEntradaProduto: new Date().toLocaleDateString('en-CA'),
        quantidadeEntrada: this.quantidadeEntrada,
        unidade: this.unidade,
        valorUnitarioEntrada: this.valorUnitario,
      })
      .subscribe({
        next: () => {
          this.salvando = false;
          this.mensagem = 'Entrada registrada com sucesso!';

          this.idProduto = 0;
          this.quantidadeEntrada = 1;
          this.valorUnitario = 0;

          this.carregar();
        },
        error: (erro) => {
          this.salvando = false;
          this.erro =
            erro.status === 401
              ? 'Faça login novamente.'
              : erro.status === 403
                ? 'Somente administradores podem registrar entradas.'
                : 'Não foi possível registrar a entrada.';

          this.cdr.detectChanges();
        },
      });
  }

  verDetalhes(id: number): void {
    this.produtoSelecionado = null;
    this.carregandoDetalhes = true;
    this.erroDetalhes = '';

    this.service.buscarPorId(id).subscribe({
      next: (produto: ProdutoEstoque) => {
        this.produtoSelecionado = produto;
        this.carregandoDetalhes = false;
        this.cdr.detectChanges();
      },

      error: (erro) => {
        this.carregandoDetalhes = false;

        this.erroDetalhes =
          erro.status === 404
            ? 'Produto não encontrado no estoque.'
            : erro.status === 401
              ? 'Faça login como administrador.'
              : erro.status === 403
                ? 'Acesso permitido somente para administradores.'
                : 'Não foi possível consultar o produto.';

        this.cdr.detectChanges();
      },
    });
  }

  fecharDetalhes(): void {
    this.produtoSelecionado = null;
    this.erroDetalhes = '';
  }
}
