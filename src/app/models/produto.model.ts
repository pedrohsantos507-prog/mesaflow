export interface Produto {
    id:number;
    nome:string;
    descricao:string;
    preco:number;
    imagem:string;
    tipo: 'P' | 'S';
    idCategoria:number;
}