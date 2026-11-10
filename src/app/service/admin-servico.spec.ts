import { TestBed } from '@angular/core/testing';

import { AdminServico } from './admin-servico';

describe('AdminServico', () => {
  let service: AdminServico;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminServico);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
