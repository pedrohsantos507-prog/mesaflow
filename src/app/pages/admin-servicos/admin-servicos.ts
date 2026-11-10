
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs';

import {
  AdminServicoService,
  ServicoAdmin,
  ServicoFormulario
} from '../../service/admin-servico';

@Component({
  selector: 'app-admin-servicos',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './admin-servicos.html',
  styleUrl: './admin-servicos.css'
})
export class AdminServicos implements OnInit {
  private service = inject(AdminServicoService);
  private cdr = inject(ChangeDetectorRef);

  servicos: ServicoAdmin[] = [];
  pesquisa = '';
  erro = '';
  mensagem = '';
  carregando = false;
  salvando = false;

  mostrarFormulario = false;
  idEdicao: number | null = null;

  formulario: ServicoFormulario = this.novoFormulario();

  ngOnInit(): void {
    this.carregar();
  }

  novoFormulario(): ServicoFormulario {
    return {
      idCategoria: 1,
      nome: '',
      descricaoItem: '',
      preco: 0,
      ativoProdutoServico: 'A'
    };
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';

    this.service.listar().subscribe({
      next: resposta => {
        this.servicos = resposta;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Erro ao consultar serviços.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  get servicosFiltrados(): ServicoAdmin[] {
    const termo = this.pesquisa.trim().toLowerCase();

    return this.servicos.filter(servico =>
      servico.nome.toLowerCase().includes(termo)
    );
  }

  novo(): void {
    this.idEdicao = null;
    this.formulario = this.novoFormulario();
    this.mostrarFormulario = true;
    this.erro = '';
    this.mensagem = '';
  }

  editar(servico: ServicoAdmin): void {
    this.idEdicao = servico.idItem;

    this.formulario = {
      idCategoria: servico.idCategoria,
      nome: servico.nome,
      descricaoItem: servico.descricaoItem,
      preco: servico.preco,
      ativoProdutoServico: servico.ativoProdutoServico
    };

    this.mostrarFormulario = true;
    this.erro = '';
    this.mensagem = '';
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.idEdicao = null;
    this.erro = '';
  }

  salvar(): void {
    if (!this.formulario.nome.trim()) {
      this.erro = 'Informe o nome do serviço.';
      return;
    }

    if (this.formulario.preco < 0) {
      this.erro = 'O preço não pode ser negativo.';
      return;
    }

    this.salvando = true;
    this.erro = '';
    this.mensagem = '';

    const requisicao: Observable<unknown> =
      this.idEdicao === null
        ? this.service.cadastrar(this.formulario)
        : this.service.atualizar(this.idEdicao, this.formulario);

    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.mostrarFormulario = false;
        this.mensagem = 'Serviço salvo com sucesso.';
        this.carregar();
      },
      error: erro => {
        this.salvando = false;
        this.erro =
          erro.error?.mensagem ||
          'Não foi possível salvar o serviço.';
        this.cdr.detectChanges();
      }
    });
  }

  desativar(servico: ServicoAdmin): void {
    if (!confirm('Deseja desativar este serviço?')) {
      return;
    }

    const dados: ServicoFormulario = {
      idCategoria: servico.idCategoria,
      nome: servico.nome,
      descricaoItem: servico.descricaoItem,
      preco: servico.preco,
      ativoProdutoServico: 'N'
    };

    this.service.atualizar(servico.idItem, dados).subscribe({
      next: () => {
        this.mensagem = 'Serviço desativado.';
        this.carregar();
      },
      error: () => {
        this.erro = 'Erro ao desativar serviço.';
        this.cdr.detectChanges();
      }
    });
  }
}
