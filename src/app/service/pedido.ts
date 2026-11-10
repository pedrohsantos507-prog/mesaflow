
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

export interface ItemPedido {
  idItem: number;
  quantidade: number;
}

export interface FinalizarPedido {
  itens: ItemPedido[];
}

export interface PedidoResposta {
  mensagem: string;
  idAtendimento: number;
  status: string;
  total: number;
}

// Item retornado pelo backend
export interface ItemPedidoHistorico {
  idAtendimento: number;
  idItem: number;
  item: string;
  idFuncionario: number | null;
  nomeFuncionario: string;
  cargo: string;
  quantidade: number;
  valorUnitario: number;
}

// Pedido retornado pelo backend
export interface PedidoHistorico {
  idAtendimento: number;
  idPessoa: number;
  nomePessoa: string;
  dataAtendimento: string;
  statusAtendimento: string;
  itens: ItemPedidoHistorico[];
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private http = inject(HttpClient);

  finalizarPedido(
    pedido: FinalizarPedido
  ): Observable<PedidoResposta> {

    return this.http.get<{ token: string }>(
      '/api/security/csrf'
    ).pipe(
      switchMap(resposta => {
        const headers = new HttpHeaders({
          'X-XSRF-TOKEN': resposta.token
        });

        return this.http.post<PedidoResposta>(
          '/api/Atendimento/pedido',
          pedido,
          { headers }
        );
      })
    );
  }

  listarMeusPedidos(): Observable<PedidoHistorico[]> {
    return this.http.get<PedidoHistorico[]>(
      '/api/Atendimento/meus-pedidos'
    );
  }
}
