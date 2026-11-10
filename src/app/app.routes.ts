import { Routes } from '@angular/router';

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

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: Home },
  { path: 'produtos', component: Produtos },
  { path: 'produtos/:id', component: Detalhes },
  { path: 'carrinho', component: Carrinho },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'admin', component: Admin },
  { path: 'mesas', component: Mesas },
  { path: 'meus-pedidos', component: MeusPedidos },
  { path: 'admin/clientes', component: Cliente },
  { path: 'admin/produtos', component: AdminProdutos },
  { path: 'admin/servicos', component: AdminServicos },
  {path: 'admin/categorias',component: AdminCategorias,},
  {path: 'admin/pedidos',component: AdminPedidos},
  {path: 'admin/estoque', component: AdminEstoque},
  { path: '**', redirectTo: 'home' },
];
