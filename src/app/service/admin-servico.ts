
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ServicoAdmin {
  idItem: number;
  idCategoria: number;
  nome: string;
  descricaoItem: string;
  preco: number;
  ativoProdutoServico: string;
}

export type ServicoFormulario = Omit<ServicoAdmin, 'idItem'>;

@Injectable({
  providedIn: 'root'
})
export class AdminServicoService {
  private http = inject(HttpClient);

  private apiUrl = '/api/Servico';

  listar(): Observable<ServicoAdmin[]> {
    return this.http.get<ServicoAdmin[]>(this.apiUrl);
  }

  cadastrar(servico: ServicoFormulario): Observable<ServicoAdmin> {
    return this.http.post<ServicoAdmin>(this.apiUrl, {
      idItem: 0,
      ...servico
    });
  }

  atualizar(id: number, servico: ServicoFormulario): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, {
      idItem: id,
      ...servico
    });
  }
}
