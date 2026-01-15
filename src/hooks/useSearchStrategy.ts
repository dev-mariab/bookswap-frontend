import { useState, useMemo } from 'react';
import { Livro } from '../app/types'; // Caminho corrigido conforme sua imagem

interface SearchStrategy {
  search(books: Livro[], term: string): Livro[];
}

class TitleSearchStrategy implements SearchStrategy {
  search(books: Livro[], term: string): Livro[] {
    return books.filter(book => 
      book.titulo.toLowerCase().includes(term.toLowerCase())
    );
  }
}

class AuthorSearchStrategy implements SearchStrategy {
  search(books: Livro[], term: string): Livro[] {
    return books.filter(book => {
      const autor = book.autor || book.livro?.autor || '';
      return autor.toLowerCase().includes(term.toLowerCase());
    });
  }
}

class CourseSearchStrategy implements SearchStrategy {
  search(books: Livro[], term: string): Livro[] {
    return books.filter(book => {
      const cursoVendedor = typeof book.vendedor === 'object' ? book.vendedor.curso : '';
      const curso = book.curso || cursoVendedor || '';
      return curso.toLowerCase().includes(term.toLowerCase());
    });
  }
}

class AllSearchStrategy implements SearchStrategy {
  search(books: Livro[], term: string): Livro[] {
    return books.filter(book => {
      const termLower = term.toLowerCase();
      
      const autor = book.autor || book.livro?.autor || '';
      const cursoVendedor = typeof book.vendedor === 'object' ? book.vendedor.curso : '';
      const curso = book.curso || cursoVendedor || '';
      const descricao = book.descricao || '';

      return (
        book.titulo.toLowerCase().includes(termLower) ||
        autor.toLowerCase().includes(termLower) ||
        curso.toLowerCase().includes(termLower) ||
        descricao.toLowerCase().includes(termLower)
      );
    });
  }
}

export function useSearchStrategy(books: Livro[]) {
  const [searchType, setSearchType] = useState<'titulo' | 'autor' | 'curso' | 'tudo'>('tudo');
  const [searchTerm, setSearchTerm] = useState('');

  const searchStrategy = useMemo(() => {
    switch (searchType) {
      case 'titulo': return new TitleSearchStrategy();
      case 'autor': return new AuthorSearchStrategy();
      case 'curso': return new CourseSearchStrategy();
      case 'tudo': return new AllSearchStrategy();
      default: return new AllSearchStrategy();
    }
  }, [searchType]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return books;
    return searchStrategy.search(books, searchTerm);
  }, [books, searchTerm, searchStrategy]);

  return {
    searchResults,
    searchStrategy,
    searchType,
    setSearchType,
    executeSearch: setSearchTerm,
    setSearchTerm
  };
}