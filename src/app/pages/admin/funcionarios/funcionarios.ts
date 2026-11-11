
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FuncionarioService } from '../../../service/funcionario';
import { Funcionario } from '../../../models/funcionario.model';

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.css'
})
export class Funcionarios implements OnInit {

  private funcionarioService = inject(FuncionarioService);

  funcionarios = signal<Funcionario[]>([]);
  carregando = signal(false);
  erro = signal('');

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  carregarFuncionarios(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.funcionarioService.listar().subscribe({
      next: (dados) => {
        this.funcionarios.set(dados);
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error('Erro ao carregar funcionários:', erro);

        this.erro.set('Não foi possível carregar os funcionários.');
        this.carregando.set(false);
      }
    });
  }
}
