
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '../service/auth';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.meuPerfil().pipe(
    map(usuario => {
      if (usuario.perfil === 'Admin') {
        return true;
      }

      return router.createUrlTree(['/home']);
    }),

    catchError(() => {
      return of(router.createUrlTree(['/login']));
    })
  );
};
