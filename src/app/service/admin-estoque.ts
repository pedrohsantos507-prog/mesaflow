import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

export interface ProdutoEstoque {
  idItem: number;
  nome: string;
  quantidade: number;
  precoVenda: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminEstoqueService {
  private http = inject(HttpClient);
  private apiUrl = '/api/Estoque';

  listar(): Observable<ProdutoEstoque[]> {
    return this.http.get<ProdutoEstoque[]>(this.apiUrl);
  }

  registrarEntrada(entrada: NovaEntradaProduto): Observable<unknown> {
    return this.http.get<{ token: string }>('/api/security/csrf').pipe(
      switchMap((resposta) =>
        this.http.post('/api/EntradaProduto', entrada, {
          headers: {
            'X-XSRF-TOKEN': resposta.token,
          },
        }),
      ),
    );
  }
}
export interface NovaEntradaProduto {
  idItem: number;
  dataEntradaProduto: string;
  quantidadeEntrada: number;
  unidade: string;
  valorUnitarioEntrada: number;
}
