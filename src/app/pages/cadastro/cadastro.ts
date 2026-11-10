
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Pessoa } from '../../models/pessoa.model';

// Validação para verificar se as senhas são iguais
function validarSenhas(
  formulario: AbstractControl
): ValidationErrors | null {

  const senha = formulario.get('senha')?.value;
  const confirmarSenha = formulario.get('confirmarSenha')?.value;

  if (senha !== confirmarSenha) {
    return { senhasDiferentes: true };
  }

  return null;
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  mensagem = signal('');
  carregando = signal(false);

  formulario = this.fb.nonNullable.group(
    {
      nome: ['', Validators.required],

      cpf: ['', [
        Validators.required,
        Validators.pattern(/^\d{11}$/)
      ]],

      dataNascimento: ['', Validators.required],

      sexo: ['', Validators.required],

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      telefone: ['', [
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]],

      cep: ['', [
        Validators.required,
        Validators.pattern(/^\d{8}$/)
      ]],

      numero: ['', Validators.required],

      complemento: [''],

      senha: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],

      confirmarSenha: ['', Validators.required]
    },
    {
      validators: validarSenhas
    }
  );

  cadastrar(): void {

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();

      this.mensagem.set(
        'Verifique os campos e confirme sua senha.'
      );

      return;
    }

    if (this.carregando()) {
      return;
    }

    const dados = this.formulario.getRawValue();

    const pessoa: Pessoa = {
      idPessoa: 0,
      nome: dados.nome,
      cpf: dados.cpf,
      dataNascimento: dados.dataNascimento,
      sexo: dados.sexo,
      email: dados.email,
      telefone: Number(dados.telefone),
      ativoPessoa: 'A',

      enderecos: [
        {
          idEndereco: 0,
          idPessoa: 0,
          cep: dados.cep,
          numero: dados.numero,
          complemento: dados.complemento
        }
      ]
    };

    const cadastro = {
      pessoa: pessoa,
      senha: dados.senha
    };

    this.carregando.set(true);
    this.mensagem.set('');

    this.http.post(
      '/api/CadastroCliente',
      cadastro
    ).subscribe({

      next: () => {
        this.carregando.set(false);

        this.mensagem.set(
          'Cadastro realizado com sucesso!'
        );

        this.formulario.reset();

        this.router.navigate(['/login']);
      },

      error: (erro: HttpErrorResponse) => {
        this.carregando.set(false);

        if (erro.status === 409) {
          this.mensagem.set(
            'CPF ou e-mail já cadastrado.'
          );
        } else if (erro.status === 400) {
          this.mensagem.set(
            'Dados inválidos. Verifique o formulário.'
          );
        } else if (erro.status === 0) {
          this.mensagem.set(
            'Não foi possível conectar ao servidor.'
          );
        } else {
          this.mensagem.set(
            'Não foi possível realizar o cadastro.'
          );
        }

        console.error('Erro no cadastro:', erro);
      }

    });
  }
}
