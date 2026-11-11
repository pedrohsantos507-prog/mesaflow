
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResposta {
  mensagem: string;
  nome: string;
  perfil: string;
}

export interface UsuarioAutenticado {
  idPessoa: string;
  nome: string;
  perfil: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl = '/api/Auth';

  login(email: string, senha: string): Observable<LoginResposta> {
    return this.http.post<LoginResposta>(
      `${this.apiUrl}/login`,
      { email, senha },
      { withCredentials: true }
    );
  }

  meuPerfil(): Observable<UsuarioAutenticado> {
    return this.http.get<UsuarioAutenticado>(
      `${this.apiUrl}/me`,
      { withCredentials: true }
    );
  }

  logout(): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(
      `${this.apiUrl}/logout`,
      {},
      { withCredentials: true }
    );
  }
}
