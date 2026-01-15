export interface Livro {
  id: string | number;
  titulo: string;
  descricao?: string;
  preco: number;
  condicao: string;
  tipo?: string;
  autor?: string;
  imagem?: string;
  curso?: string;
  avaliacao?: number;
  localizacao?: string;
  userId?: string;
  createdAt?: string;
  vendedor?: string | {
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