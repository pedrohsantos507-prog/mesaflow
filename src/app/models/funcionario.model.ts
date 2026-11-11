export interface EnderecoFuncionario {
    idEndereco: number;
    idPessoa: number;
    cep: string;
    numero: string;
    complemento: string;
}

export interface PessoaFuncionario {
    idPessoa: number;
    nome: string;
    cpf: string;
    dataNascimento: string;
    sexo:string;
    email:string;
    telefone: number;
    ativoPessoa:string;
    enderecos:EnderecoFuncionario[];
}

export interface Funcionario {
    idPessoa: number;
    cargo:string;
    dataAdmissao:string;
    pessoa:PessoaFuncionario;
}

export interface FuncionarioCadastro {
  idPessoa: number;
  cargo: string;
  dataAdmissao: string;
  pessoa: PessoaFuncionario;
}