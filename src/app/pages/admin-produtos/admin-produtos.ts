import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { AdminProdutoService, ProdutoAdmin, ProdutoFormulario } from '../../service/admin-produto';

@Component({
  selector: 'app-admin-produtos',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './admin-produtos.html',
  styleUrl: './admin-produtos.css',
})
export class AdminProdutos implements OnInit {
  private service = inject(AdminProdutoService);
  private cdr = inject(ChangeDetectorRef);

  produtos: ProdutoAdmin[] = [];
  pesquisa = '';
  erro = '';
  mensagem = '';
  carregando = false;
  salvando = false;

  mostrarFormulario = false;
  idEdicao: number | null = null;

  formulario: ProdutoFormulario = this.novoFormulario();

  ngOnInit(): void {
    this.carregar();
  }

  novoFormulario(): ProdutoFormulario {
    return {
      idCategoria: 1,
      item: '',
      descricaoItem: '',
      preco: 0,
      tipoItem: 'P',
      ativoProdutoServico: 'A',
      codigoPreco: 0,
      precoVenda: 0,
      unidade: 'UN',
    };
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
      error: () => {
        this.erro = 'Erro ao consultar produtos.';
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  get produtosFiltrados(): ProdutoAdmin[] {
    const termo = this.pesquisa.trim().toLowerCase();

    return this.produtos.filter((produto) =>
      produto.iditemNavigation?.item1?.toLowerCase().includes(termo),
    );
  }

  novo(): void {
    this.idEdicao = null;
    this.formulario = this.novoFormulario();
    this.mostrarFormulario = true;
    this.mensagem = '';
    this.erro = '';
  }

  editar(produto: ProdutoAdmin): void {
    const item = produto.iditemNavigation;

    this.idEdicao = produto.iditem;

    this.formulario = {
      idCategoria: item.idcategoria,
      item: item.item1,
      descricaoItem: item.descricaoItem,
      preco: item.preco,
      tipoItem: 'P',
      ativoProdutoServico: item.ativoProdutoServico,
      codigoPreco: produto.codigoPreco,
      precoVenda: produto.precoVenda,
      unidade: produto.unidade.trim(),
    };

    this.mostrarFormulario = true;
    this.mensagem = '';
  }

  salvar(): void {
    if (!this.formulario.item.trim()) {
      this.erro = 'Informe o nome do produto.';
      return;
    }

    this.salvando = true;
    this.erro = '';
    this.mensagem = '';

    const requisicao: Observable<unknown> =
      this.idEdicao === null
        ? this.service.cadastrar(this.formulario)
        : this.service.atualizar(this.idEdicao, this.formulario);
    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.mostrarFormulario = false;
        this.mensagem = 'Produto salvo com sucesso.';
        this.carregar();
      },
      error: (erro) => {
        this.salvando = false;
        this.erro = erro.error?.mensagem || 'Não foi possível salvar o produto.';
        this.cdr.detectChanges();
      },
    });
  }

  desativar(produto: ProdutoAdmin): void {
    if (!confirm('Deseja desativar este produto?')) {
      return;
    }

    const item = produto.iditemNavigation;

    const dados: ProdutoFormulario = {
      idCategoria: item.idcategoria,
      item: item.item1,
      descricaoItem: item.descricaoItem,
      preco: item.preco,
      tipoItem: 'P',
      ativoProdutoServico: 'N',
      codigoPreco: produto.codigoPreco,
      precoVenda: produto.precoVenda,
      unidade: produto.unidade,
    };

    this.service.atualizar(produto.iditem, dados).subscribe({
      next: () => {
        this.mensagem = 'Produto desativado.';
        this.carregar();
      },
      error: () => {
        this.erro = 'Erro ao desativar produto.';
        this.cdr.detectChanges();
      },
    });
  }
}
