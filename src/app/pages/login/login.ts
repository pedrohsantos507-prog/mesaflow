
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  mensagem = signal('');
  carregando = signal(false);

  formulario = this.fb.nonNullable.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    senha: ['', [
      Validators.required,
      Validators.minLength(6)
    ]]
  });

  entrar(): void {

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensagem.set('Preencha os campos corretamente.');
      return;
    }

    if (this.carregando()) {
      return;
    }

    const dados = this.formulario.getRawValue();

    this.carregando.set(true);
    this.mensagem.set('');

    this.authService.login(dados.email, dados.senha)
      .subscribe({

        next: (resposta) => {
          this.carregando.set(false);
          this.mensagem.set(resposta.mensagem);

          this.formulario.controls.senha.reset();

          if (resposta.perfil === 'Administrador') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },

        error: (erro: HttpErrorResponse) => {
          this.carregando.set(false);

          if (erro.status === 401) {
            this.mensagem.set('E-mail ou senha inválidos.');
          } else if (erro.status === 0) {
            this.mensagem.set(
              'Não foi possível conectar ao servidor.'
            );
          } else {
            this.mensagem.set(
              'Ocorreu um erro ao realizar o login.'
            );
          }
        }

      });
  }
}
