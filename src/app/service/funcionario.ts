import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Funcionario } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  private http = inject(HttpClient);

  private apiUrl = '/api/Funcionario';

  listar(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.apiUrl,{
      withCredentials: true
    });
  }

  buscarPorId(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(
     `${this.apiUrl}/${id}`,
     {withCredentials:true }
    );
  }
}
