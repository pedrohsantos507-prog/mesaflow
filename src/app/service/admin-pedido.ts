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

  listar(): Observable<PedidoAdmin[]> {
    return this.http.get<PedidoAdmin[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<PedidoAdmin> {
    return this.http.get<PedidoAdmin>(`${this.apiUrl}/${id}`);
  }

  atualizarStatus(id: number, status: string): Observable<void> {
    return this.http.get<RespostaCsrf>('/api/security/csrf').pipe(
      switchMap((resposta) =>
        this.http.patch<void>(
          `${this.apiUrl}/${id}/status`,
          { statusAtendimento: status },
          {
            headers: {
              'X-XSRF-TOKEN': resposta.token,
            },
          },
        ),
      ),
    );
  }
}
