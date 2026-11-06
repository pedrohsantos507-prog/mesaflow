import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Produtos } from './pages/produtos/produtos';
import { Carrinho } from './pages/carrinho/carrinho';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro'; 
import { Admin } from './pages/admin/admin';
import { Component } from '@angular/core';
import { Mesas } from './pages/mesas/mesas';


export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},

    { path: 'home', Component: Home },
    { path: 'produtos', Component: Produtos },
    { path: 'carrinho', Component: Carrinho },
    { path: 'login', Component: Login },
    { path: 'cadastro', Component: Cadastro },
    { path: 'admin', Component: Admin },

    { path: '**', redirectTo: 'home'}
];
