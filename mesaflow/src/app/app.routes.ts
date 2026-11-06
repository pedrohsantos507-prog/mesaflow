import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Produtos } from './pages/produtos/produtos';
import { Carrinho } from './pages/carrinho/carrinho';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro'; 
import { Admin } from './pages/admin/admin';
import { Mesas } from './pages/mesas/mesas';


export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},

    { path: 'home', component: Home },
    { path: 'produtos', component: Produtos },
    { path: 'carrinho', component: Carrinho },
    { path: 'login', component: Login },
    { path: 'cadastro', component: Cadastro },
    { path: 'admin', component: Admin },
    { path: 'mesas', component: Mesas },

    { path: '**', redirectTo: 'home'}
];
