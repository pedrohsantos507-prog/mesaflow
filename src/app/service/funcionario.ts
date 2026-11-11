import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

import { Funcionario, FuncionarioCadastro } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  private http = inject(HttpClient);

  private apiUrl = '/api/Funcionario';

  // GET - Listar funcionários
  listar(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.apiUrl, {
      withCredentials: true,
    });
  }

  // GET - Buscar funcionário por ID
  buscarPorId(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  // POST - Cadastrar funcionário
  cadastrar(funcionario: FuncionarioCadastro): Observable<unknown> {
    return this.http.get<{ token: string }>('/api/security/csrf', { withCredentials: true }).pipe(
      switchMap((resposta) => {
        return this.http.post(this.apiUrl, funcionario, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': resposta.token,
          },
        });
      }),
    );
  }

  // PUT - Atualizar funcionário
  atualizar(id: number, funcionario: FuncionarioCadastro): Observable<unknown> {
    return this.http.get<{ token: string }>('/api/security/csrf', { withCredentials: true }).pipe(
      switchMap((resposta) => {
        return this.http.put(`${this.apiUrl}/${id}`, funcionario, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': resposta.token,
          },
        });
      }),
    );
  }

  // DELETE - Excluir funcionário
  excluir(id: number): Observable<unknown> {
    return this.http.get<{ token: string }>('/api/security/csrf', { withCredentials: true }).pipe(
      switchMap((resposta) => {
        return this.http.delete(`${this.apiUrl}/${id}`, {
          withCredentials: true,
          headers: {
            'X-XSRF-TOKEN': resposta.token,
          },
        });
      }),
    );
  }
}
