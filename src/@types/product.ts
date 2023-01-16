export interface Product {
  nome: string;
  termosParaBusca: string[];
  descricao: string;
  categoria: string;
  preco: number;
  peso: number;
  id?: string;
  slug?: string;
}
