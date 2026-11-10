
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  forkJoin,
  map,
  catchError,
  of
} from 'rxjs';

import { Produto } from '../models/produto.model';

// Estrutura dos itens retornados pela API de produtos
interface ItemApi {
  iditem: number;
  idcategoria: number;
  item1: string;
  descricaoItem: string;
  preco: number;
  tipoItem: string;
  ativoProdutoServico: string;
}

// Estrutura dos produtos retornados pelo backend
interface ProdutoApi {
  iditem: number;
  precoVenda: number;
  iditemNavigation: ItemApi;
}

// Estrutura retornada pelo ServicoController
interface ServicoApi {
  idItem: number;
  idCategoria: number;
  nome: string;
  descricaoItem: string;
  preco: number;
  ativoProdutoServico: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private http = inject(HttpClient);

  private apiUrlProdutos = '/api/ProdutoItem';
  private apiUrlServicos = '/api/Servico';

  listarProdutos(): Observable<Produto[]> {

    // Busca os produtos cadastrados no MySQL
    const produtos$ = this.http.get<ProdutoApi[]>(
      this.apiUrlProdutos
    );

    // Busca os serviços cadastrados no MySQL
    const servicos$ = this.http.get<ServicoApi[]>(
      this.apiUrlServicos
    ).pipe(
      catchError(erro => {
        console.error(
          'Erro ao carregar serviços:',
          erro
        );

        return of([] as ServicoApi[]);
      })
    );

    // Aguarda as duas consultas terminarem
    return forkJoin([produtos$, servicos$]).pipe(
      map(([produtos, servicos]) => {

        // Filtra somente produtos ativos
        const listaProdutos: Produto[] = produtos
          .filter(p =>
            p.iditemNavigation?.tipoItem === 'P' &&
            p.iditemNavigation?.ativoProdutoServico === 'A'
          )
          .map(p => ({
            id: p.iditem,
            nome: p.iditemNavigation.item1,
            descricao: p.iditemNavigation.descricaoItem,
            preco: p.precoVenda,
            imagem: '',
            tipo: 'P',
            idCategoria: p.iditemNavigation.idcategoria
          }));

        // Filtra somente serviços ativos
        const listaServicos: Produto[] = servicos
          .filter(s =>
            s.ativoProdutoServico === 'A'
          )
          .map(s => ({
            id: s.idItem,
            nome: s.nome,
            descricao: s.descricaoItem,
            preco: s.preco,
            imagem: '',
            tipo: 'S',
            idCategoria: s.idCategoria
          }));

        // Junta produtos e serviços em uma única lista
        return [
          ...listaProdutos,
          ...listaServicos
        ];
      })
    );
  }
}
