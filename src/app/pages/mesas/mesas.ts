
import { Component, computed, signal } from '@angular/core';

type StatusMesa = 'Livre' | 'Ocupada' | 'Reservada';

interface Mesa {
  id: number;
  numero: number;
  capacidade: number;
  status: StatusMesa;
}

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [],
  templateUrl: './mesas.html',
  styleUrl: './mesas.css'
})
export class Mesas {

  mesas = signal<Mesa[]>([
    { id: 1, numero: 1, capacidade: 4, status: 'Livre' },
    { id: 2, numero: 2, capacidade: 2, status: 'Ocupada' },
    { id: 3, numero: 3, capacidade: 4, status: 'Livre' },
    { id: 4, numero: 4, capacidade: 6, status: 'Reservada' },
    { id: 5, numero: 5, capacidade: 2, status: 'Ocupada' },
    { id: 6, numero: 6, capacidade: 4, status: 'Livre' },
    { id: 7, numero: 7, capacidade: 6, status: 'Livre' },
    { id: 8, numero: 8, capacidade: 4, status: 'Reservada' }
  ]);

  totalMesas = computed(() => this.mesas().length);

  mesasLivres = computed(() =>
    this.mesas().filter(m => m.status === 'Livre').length
  );

  mesasOcupadas = computed(() =>
    this.mesas().filter(m => m.status === 'Ocupada').length
  );

  mesasReservadas = computed(() =>
    this.mesas().filter(m => m.status === 'Reservada').length
  );

  alterarStatus(id: number): void {
    this.mesas.update(mesas =>
      mesas.map(mesa => {
        if (mesa.id !== id) {
          return mesa;
        }

        const proximoStatus: StatusMesa =
          mesa.status === 'Livre'
            ? 'Ocupada'
            : mesa.status === 'Ocupada'
              ? 'Reservada'
              : 'Livre';

        return { ...mesa, status: proximoStatus };
      })
    );
  }
}
