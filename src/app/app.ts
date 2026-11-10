
import {
  Component,
  ChangeDetectorRef,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import {
  Router,
  RouterLink,
  RouterOutlet,
  NavigationEnd
} from '@angular/router';

import { filter } from 'rxjs';

interface UsuarioLogado {
  idPessoa: string;
  nome: string;
  perfil: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  protected readonly title = signal('MesaFlow');

  usuario = signal<UsuarioLogado | null>(null);
  saindo = signal(false);

  ngOnInit(): void {
    this.verificarSessao();

    // Atualiza o menu quando o usuário navega,
    // inclusive depois de fazer login.
    this.router.events
      .pipe(filter(evento => evento instanceof NavigationEnd))
      .subscribe(() => {
        this.verificarSessao();
      });
  }

  verificarSessao(): void {
    this.http.get<UsuarioLogado>('/api/Auth/me').subscribe({
      next: usuario => {
        this.usuario.set(usuario);
        this.cdr.detectChanges();
      },
      error: () => {
        this.usuario.set(null);
        this.cdr.detectChanges();
      }
    });
  }

  sair(): void {
    if (this.saindo()) {
      return;
    }

    this.saindo.set(true);

    this.http.post('/api/Auth/logout', {}).subscribe({
      next: () => {
        this.usuario.set(null);
        this.saindo.set(false);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.saindo.set(false);
        alert('Não foi possível encerrar a sessão.');
        this.cdr.detectChanges();
      }
    });
  }
}
