
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import {
  AdminCategoriaService,
  CategoriaAdmin,
  CategoriaFormulario
} from '../../service/admin-categoria';

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-categorias.html',
  styleUrl: './admin-categorias.css'
})
export class AdminCategorias implements OnInit {
  private service = inject(AdminCategoriaService);
  private cdr = inject(ChangeDetectorRef);

  categorias: CategoriaAdmin[] = [];
  pesquisa = '';
  erro = '';
  mensagem = '';
  carregando = false;
  salvando = false;
  excluindoId: number | null = null;

  mostrarFormulario = false;
  idEdicao: number | null = null;

  formulario: CategoriaFormulario = {
    nome: ''
  };

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';

    this.service.listar().subscribe({
      next: resposta => {
        this.categorias = resposta;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Erro ao consultar categorias.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  get categoriasFiltradas(): CategoriaAdmin[] {
    const termo = this.pesquisa.trim().toLowerCase();

    return this.categorias.filter(categoria =>
      categoria.nome.toLowerCase().includes(termo)
    );
  }

  novo(): void {
    this.idEdicao = null;
    this.formulario = { nome: '' };
    this.mostrarFormulario = true;
    this.erro = '';
    this.mensagem = '';
  }

  editar(categoria: CategoriaAdmin): void {
    this.idEdicao = categoria.idCategoria;
    this.formulario = { nome: categoria.nome };
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
    const nome = this.formulario.nome.trim();

    if (!nome) {
      this.erro = 'Informe o nome da categoria.';
      return;
    }

    if (this.salvando) {
      return;
    }

    this.salvando = true;
    this.erro = '';
    this.mensagem = '';

    const dados = { nome };

    const requisicao: Observable<unknown> =
      this.idEdicao === null
        ? this.service.cadastrar(dados)
        : this.service.atualizar(this.idEdicao, dados);

    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.mostrarFormulario = false;
        this.idEdicao = null;
        this.mensagem = 'Categoria salva com sucesso.';
        this.carregar();
      },
      error: erro => {
        this.salvando = false;
        this.erro =
          erro.error?.mensagem ||
          'Não foi possível salvar a categoria.';
        this.cdr.detectChanges();
      }
    });
  }

  excluir(categoria: CategoriaAdmin): void {
    if (this.excluindoId !== null) {
      return;
    }

    const confirmou = confirm(
      `Deseja excluir a categoria "${categoria.nome}"?`
    );

    if (!confirmou) {
      return;
    }

    this.excluindoId = categoria.idCategoria;
    this.erro = '';
    this.mensagem = '';

    this.service.excluir(categoria.idCategoria).subscribe({
      next: () => {
        this.excluindoId = null;
        this.mensagem = 'Categoria excluída com sucesso.';
        this.carregar();
      },
      error: erro => {
        this.excluindoId = null;
        this.erro =
          erro.error?.mensagem ||
          'Não foi possível excluir a categoria.';
        this.cdr.detectChanges();
      }
    });
  }
}
