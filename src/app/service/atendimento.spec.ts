import { TestBed } from '@angular/core/testing';

import { AtendimentoService } from './atendimento';

describe('Atendimento', () => {
  let service: AtendimentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtendimentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
