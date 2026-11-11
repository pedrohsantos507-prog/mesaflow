import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

export interface ItemPedidoAdmin {
  idAtendimento: number;
  idItem: number;
  item: string;
  idFuncionario: number | null;
  nomeFuncionario: string;
  cargo: string;
  quantidade: number;
  valorUnitario: number;
}

export interface PedidoAdmin {
  idAtendimento: number;
  idPessoa: number;
  nomePessoa: string;
  dataAtendimento: string;
  statusAtendimento: string;
  itens: ItemPedidoAdmin[];
}

interface RespostaCsrf {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminPedidoService {
  private http = inject(HttpClient);
  private apiUrl = '/api/Atendimento';

  // Lista todos os pedidos
  listar(): Observable<PedidoAdmin[]> {
    return this.http.get<PedidoAdmin[]>(this.apiUrl, { withCredentials: true });
  }

  // Busca um pedido pelo ID
  buscarPorId(id: number): Observable<PedidoAdmin> {
    return this.http.get<PedidoAdmin>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // Atualiza o status do pedido
  atualizarStatus(id: number, status: string): Observable<void> {
    return this.http.get<RespostaCsrf>('/api/security/csrf', { withCredentials: true }).pipe(
      switchMap((resposta) =>
        this.http.patch<void>(
          `${this.apiUrl}/${id}/status`,
          { statusAtendimento: status },
          {
            headers: {
              'X-XSRF-TOKEN': resposta.token,
            },
            withCredentials: true,
          },
        ),
      ),
    );
  }

  // Atribui um funcionário ao atendimento
  atribuirFuncionario(idAtendimento: number, idFuncionario: number): Observable<void> {
    return this.http.get<RespostaCsrf>('/api/security/csrf', { withCredentials: true }).pipe(
      switchMap((resposta) =>
        this.http.patch<void>(
          `${this.apiUrl}/${idAtendimento}/funcionario`,
          { idFuncionario },
          {
            headers: {
              'X-XSRF-TOKEN': resposta.token,
            },
            withCredentials: true,
          },
        ),
      ),
    );
  }
}
