import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';

import { PessoaService } from '../../service/pessoa';
import { Pessoa } from '../../models/pessoa.model';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css',
})
export class Cliente implements OnInit {
  private pessoaService = inject(PessoaService);
  private cdr = inject(ChangeDetectorRef);

  pessoas: Pessoa[] = [];
  carregando = true;
  erro = '';

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.carregando = true;
    this.erro = '';

    this.pessoaService.listarPessoas().subscribe({
      next: (resposta: Pessoa[]) => {
        this.pessoas = resposta;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Não foi possível carregar os clientes.';
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
