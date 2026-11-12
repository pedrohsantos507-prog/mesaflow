import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin-guard';

import { Home } from './pages/home/home';
import { Produtos } from './pages/produtos/produtos';
import { Carrinho } from './pages/carrinho/carrinho';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Admin } from './pages/admin/admin';
import { Mesas } from './pages/mesas/mesas';
import { Detalhes } from './pages/detalhes/detalhes';
import { MeusPedidos } from './pages/meus-pedidos/meus-pedidos';
import { Cliente } from './pages/cliente/cliente';
import { AdminProdutos } from './pages/admin-produtos/admin-produtos';
import { AdminServicos } from './pages/admin-servicos/admin-servicos';
import { AdminCategorias } from './pages/admin-categorias/admin-categorias';
import { AdminPedidos } from './pages/admin-pedidos/admin-pedidos';
import { AdminEstoque } from './pages/admin-estoque/admin-estoque';
import { Funcionarios } from './pages/admin/funcionarios/funcionarios';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Rotas públicas
  { path: 'home', component: Home },
  { path: 'produtos', component: Produtos },
  { path: 'produtos/:id', component: Detalhes },
  { path: 'carrinho', component: Carrinho },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },

  // Rotas de clientes
  { path: 'meus-pedidos', component: MeusPedidos },

  // Rotas administrativas
  {
    path: 'admin',
    canActivate: [adminGuard],
    component: Admin,
  },
  {
    path: 'admin/clientes',
    canActivate: [adminGuard],
    component: Cliente,
  },
  {
    path: 'admin/produtos',
    canActivate: [adminGuard],
    component: AdminProdutos,
  },
  {
    path: 'admin/servicos',
    canActivate: [adminGuard],
    component: AdminServicos,
  },
  {
    path: 'admin/categorias',
    canActivate: [adminGuard],
    component: AdminCategorias,
  },
  {
    path: 'admin/pedidos',
    canActivate: [adminGuard],
    component: AdminPedidos,
  },
  {
    path: 'admin/estoque',
    canActivate: [adminGuard],
    component: AdminEstoque,
  },
  {
    path: 'funcionarios',
    canActivate: [adminGuard],
    component: Funcionarios,
  },
  {
    path: 'mesas',
    canActivate: [adminGuard],
    component: Mesas,
  },

  { path: '**', redirectTo: 'home' },
];
