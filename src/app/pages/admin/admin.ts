
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  styleUrl: './admin.css'
})
export class Admin {

  indicadores: IndicadorAdmin[] = [
    {
      titulo: 'Clientes',
      valor: '—',
      classe: 'clientes',
      descricao: 'Aguardando integração'
    },
    {
      titulo: 'Produtos',
      valor: '—',
      classe: 'produtos',
      descricao: 'Aguardando integração'
    },
    {
      titulo: 'Pedidos',
      valor: '—',
      classe: 'pedidos',
      descricao: 'Aguardando integração'
    },
    {
      titulo: 'Mesas',
      valor: '8',
      classe: 'mesas',
      descricao: 'Dados de demonstração'
    }
  ];

  recursos: RecursoAdmin[] = [
    {
      titulo: 'Clientes',
      descricao: 'Consultar e pesquisar clientes cadastrados.',
      rota: '/admin/clientes'
    },
    {
      titulo: 'Produtos',
      descricao: 'Cadastrar, editar e desativar produtos.',
      rota: '/admin/produtos'
    },
    {
      titulo: 'Serviços',
      descricao: 'Gerenciar os serviços oferecidos.',
      rota:'/admin/servicos',
    },
    {
      titulo: 'Categorias',
      descricao: 'Organizar produtos e serviços por categoria.',
      rota: '/admin/categorias'
    },
    {
      titulo: 'Pedidos',
      descricao: 'Consultar e atualizar pedidos.',
      rota: '/admin/pedidos'
    },
    {
      titulo: 'Estoque',
      descricao: 'Consultar estoque e registrar entradas.',
      rota: '/admin/estoque'
    },
    {
      titulo: 'Funcionários',
      descricao: 'Gerenciar funcionários cadastrados.',
      rota: '/funcionario'
    },
    {
      titulo: 'Mesas',
      descricao: 'Visualizar e controlar mesas.',
      rota: '/mesas'
    }
  ];
}
