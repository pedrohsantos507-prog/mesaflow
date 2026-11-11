import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { PessoaService } from '../../service/pessoa';
import { AdminProdutoService } from '../../service/admin-produto';
import { AdminServicoService } from '../../service/admin-servico';
import { AdminPedidoService } from '../../service/admin-pedido';
import { AdminEstoqueService } from '../../service/admin-estoque';

interface IndicadorAdmin {
  titulo: string;
  valor: string;
  classe: string;
  descricao: string;
}

interface RecursoAdmin {
  titulo: string;
  descricao: string;
  rota: string | null;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private pessoaService = inject(PessoaService);
  private produtoService = inject(AdminProdutoService);
  private servicoService = inject(AdminServicoService);
  private pedidoService = inject(AdminPedidoService);
  private estoqueService = inject(AdminEstoqueService);
  private cdr = inject(ChangeDetectorRef);

  carregando = false;
  erro = '';

  indicadores: IndicadorAdmin[] = [
    {
      titulo: 'Clientes',
      valor: '—',
      classe: 'clientes',
      descricao: 'Pessoas cadastradas',
    },
    {
      titulo: 'Produtos',
      valor: '—',
      classe: 'produtos',
      descricao: 'Produtos cadastrados',
    },
    {
      titulo: 'Serviços',
      valor: '—',
      classe: 'servicos',
      descricao: 'Serviços cadastrados',
    },
    {
      titulo: 'Pedidos',
      valor: '—',
      classe: 'pedidos',
      descricao: 'Pedidos registrados',
    },
    {
      titulo: 'Estoque',
      valor: '—',
      classe: 'estoque',
      descricao: 'Unidades disponíveis',
    },
  ];

  recursos: RecursoAdmin[] = [
    {
      titulo: 'Clientes',
      descricao: 'Consultar e pesquisar clientes cadastrados.',
      rota: '/admin/clientes',
    },
    {
      titulo: 'Produtos',
      descricao: 'Cadastrar, editar e desativar produtos.',
      rota: '/admin/produtos',
    },
    {
      titulo: 'Serviços',
      descricao: 'Gerenciar os serviços oferecidos.',
      rota: '/admin/servicos',
    },
    {
      titulo: 'Categorias',
      descricao: 'Organizar produtos e serviços por categoria.',
      rota: '/admin/categorias',
    },
    {
      titulo: 'Pedidos',
      descricao: 'Consultar e atualizar pedidos.',
      rota: '/admin/pedidos',
    },
    {
      titulo: 'Estoque',
      descricao: 'Consultar estoque e registrar entradas.',
      rota: '/admin/estoque',
    },
    {
      titulo: 'Funcionários',
      descricao: 'Gerenciar funcionários cadastrados.',
      rota: '/funcionario',

    },
    {
      titulo: 'Mesas',
      descricao: 'Visualizar e controlar mesas.',
      rota: '/mesas',
    },
  ];

  ngOnInit(): void {
    this.carregarIndicadores();
  }

  carregarIndicadores(): void {
    this.carregando = true;
    this.erro = '';

    forkJoin({
      clientes: this.pessoaService.listarPessoas(),
      produtos: this.produtoService.listar(),
      servicos: this.servicoService.listar(),
      pedidos: this.pedidoService.listar(),
      estoque: this.estoqueService.listar(),
    }).subscribe({
      next: (dados) => {
        const unidadesEstoque = dados.estoque.reduce(
          (total, produto) => total + produto.quantidade,
          0,
        );

        const valores = [
          dados.clientes.length,
          dados.produtos.length,
          dados.servicos.length,
          dados.pedidos.length,
          unidadesEstoque,
        ];

        this.indicadores = this.indicadores.map((indicador, indice) => ({
          ...indicador,
          valor: valores[indice].toString(),
        }));

        this.carregando = false;
        this.cdr.detectChanges();
      },

      error: (erro) => {
        console.error('Erro ao carregar indicadores:', erro);

        this.erro = 'Não foi possível carregar os indicadores.';

        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
