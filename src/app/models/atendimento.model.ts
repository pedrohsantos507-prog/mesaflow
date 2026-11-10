
export interface AtendimentoItem {
  idItem: number;
  idFuncionario: number;
  quantidade: number;
  valorUnitario: number;
}

export interface Atendimento {
  idPessoa: number;
  dataAtendimento: string;
  statusAtendimento: string;
  itens: AtendimentoItem[];
}
