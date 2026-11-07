import { Endereco } from "./endereco.model";

export interface Pessoa {
    idPessoa: number;
    nome:string;
    cpf:string;
    dataNascimento:string;
    sexo:string;
    email:string;
    telefone:number;
    ativoPessoa:string;
    enderecos: Endereco[];
}