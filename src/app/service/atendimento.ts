
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Atendimento } from '../models/atendimento.model';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5000/api/Atendimento';

  finalizarPedido(atendimento: Atendimento): Observable<unknown> {
    return this.http.post<unknown>(
      this.apiUrl,
      atendimento
    );
  }

}
