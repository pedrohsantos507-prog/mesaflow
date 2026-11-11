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
  clienteSelecionado: Pessoa | null = null;

  carregando = true;
  carregandoDetalhes = false;
  erro = '';
  erroDetalhes = '';

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

  verDetalhes(idPessoa: number): void {
    this.clienteSelecionado = null;
    this.carregandoDetalhes = true;
    this.erroDetalhes = '';

    this.pessoaService.buscarPorId(idPessoa).subscribe({
      next: (resposta: Pessoa | Pessoa[]) => {
        const cliente = Array.isArray(resposta)
          ? resposta.find((p) => p.idPessoa === idPessoa)
          : resposta;

        if (!cliente) {
          this.erroDetalhes = 'Cliente não encontrado.';
        } else {
          this.clienteSelecionado = cliente;
        }

        this.carregandoDetalhes = false;
        this.cdr.detectChanges();
      },

      error: (erro) => {
        this.erroDetalhes =
          erro.status === 404 ? 'Cliente não encontrado.' : 'Não foi possível consultar o cliente.';

        this.carregandoDetalhes = false;
        this.cdr.detectChanges();
      },
    });
  }

  fecharDetalhes(): void {
    this.clienteSelecionado = null;
    this.erroDetalhes = '';
  }
}
