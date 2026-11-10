
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProdutoAdmin {
  iditem: number;
  codigoPreco: number;
  precoVenda: number;
  unidade: string;
  iditemNavigation: {
    iditem: number;
    idcategoria: number;
    item1: string;
    descricaoItem: string;
    preco: number;
    tipoItem: string;
    ativoProdutoServico: string;
  };
}

export interface ProdutoFormulario {
  idCategoria: number;
  item: string;
  descricaoItem: string;
  preco: number;
  tipoItem: string;
  ativoProdutoServico: string;
  codigoPreco: number;
  precoVenda: number;
  unidade: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminProdutoService {

  private http = inject(HttpClient);

  private url = '/api/ProdutoItem';

  listar(): Observable<ProdutoAdmin[]> {
    return this.http.get<ProdutoAdmin[]>(this.url);
  }

  cadastrar(
    produto: ProdutoFormulario
  ): Observable<ProdutoAdmin> {
    return this.http.post<ProdutoAdmin>(
      this.url,
      produto
    );
  }

  atualizar(
    id: number,
    produto: ProdutoFormulario
  ): Observable<void> {
    return this.http.put<void>(
      `${this.url}/${id}`,
      produto
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.url}/${id}`
    );
  }
}
