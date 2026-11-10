
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoriaAdmin {
  idCategoria: number;
  nome: string;
}

export interface CategoriaFormulario {
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminCategoriaService {
  private http = inject(HttpClient);
  private apiUrl = '/api/Categorium';

  listar(): Observable<CategoriaAdmin[]> {
    return this.http.get<CategoriaAdmin[]>(this.apiUrl);
  }

  cadastrar(dados: CategoriaFormulario): Observable<CategoriaAdmin> {
    return this.http.post<CategoriaAdmin>(this.apiUrl, {
      idCategoria: 0,
      nome: dados.nome
    });
  }

  atualizar(id: number, dados: CategoriaFormulario): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, {
      idCategoria: id,
      nome: dados.nome
    });
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
