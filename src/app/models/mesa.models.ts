export interface Mesa {
    id:number;
    numero:number;
    status: 'livre' | 'ocupada' | 'fechamento';
    total: number;
}