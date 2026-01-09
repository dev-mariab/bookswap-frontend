export interface Livro {
  id: string;
  titulo: string;
  descricao?: string;
  preco: number;
  condicao: string;
  tipo?: string;
  vendedor?: {
    nome: string;
    avaliacao: number;
    curso?: string;
  };
  livro?: {
    titulo?: string;
    autor?: string;
    capa?: string;
  };
  fotos?: string[];
}
