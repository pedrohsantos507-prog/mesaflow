import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pessoa } from '../models/pessoa.model';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5000/api/PessoaEndereco';

  listarPessoas(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>('/api/PessoaEndereco');
  }

  cadastrar(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.apiUrl, pessoa);
  }

  buscarPorId(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}/${id}`);
  }

  atualizar(id: number, pessoa: Pessoa): Observable<void> {
    return this.http.put<void>(`/api/PessoaEndereco/${id}`, pessoa, { withCredentials: true });
  }
}
