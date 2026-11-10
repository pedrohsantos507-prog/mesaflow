import { TestBed } from '@angular/core/testing';

import { AdminProduto } from './admin-produto';

describe('AdminProduto', () => {
  let service: AdminProduto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminProduto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
