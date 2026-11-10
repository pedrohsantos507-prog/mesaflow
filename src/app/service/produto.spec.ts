
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Produto } from '../models/produto.model';

interface ProdutoApi {
  iditem: number;
  precoVenda: number;

  iditemNavigation: {
    idcategoria: number;
    item1: string;
    descricaoItem: string;
    tipoItem: string;
    ativoProdutoServico: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private http = inject(HttpClient);

  private apiUrl = '/api/ProdutoItem';

  listarProdutos(): Observable<Produto[]> {

    return this.http.get<ProdutoApi[]>(this.apiUrl).pipe(
      map(produtos =>
        produtos
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
            tipo: 'P' as const,
            idCategoria: p.iditemNavigation.idcategoria
          }))
      )
    );
  }
}
