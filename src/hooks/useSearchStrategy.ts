import { useState, useMemo } from 'react';
import { Livro } from '../app/types';

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
    return books.filter(book => 
      book.livro?.autor?.toLowerCase().includes(term.toLowerCase())
    );
  }
}

class CourseSearchStrategy implements SearchStrategy {
  search(books: Livro[], term: string): Livro[] {
    return books.filter(book => 
      book.vendedor?.curso?.toLowerCase().includes(term.toLowerCase())
    );
  }
}

class AllSearchStrategy implements SearchStrategy {
  search(books: Livro[], term: string): Livro[] {
    return books.filter(book => {
      const termLower = term.toLowerCase();
      return (
        book.titulo.toLowerCase().includes(termLower) ||
        book.livro?.autor?.toLowerCase().includes(termLower) ||
        book.vendedor?.curso?.toLowerCase().includes(termLower) ||
        book.descricao?.toLowerCase().includes(termLower)
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
    searchTerm,
    setSearchTerm,
    setSearchType
  };
}