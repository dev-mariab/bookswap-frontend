import React, { useState } from 'react';
import { Livro } from '../types';

interface FeaturedBooksProps {
  livros: Livro[];
  onBookClick: (bookId: string) => void;
  totalLivros?: number;
}

export function FeaturedBooks({ livros, onBookClick }: FeaturedBooksProps) {
  const [sortBy, setSortBy] = useState<string>('default');

  if (!livros || livros.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">Nenhum livro disponível no momento.</p>
        <p className="text-gray-400 text-sm mt-2">Seja o primeiro a anunciar um livro!</p>
      </div>
    );
  }

  const sortedLivros = [...livros].sort((a, b) => {
    switch(sortBy) {
      case 'price-low':
        return a.preco - b.preco;
      case 'price-high':
        return b.preco - a.preco;
      case 'rating':
        return (b.vendedor?.avaliacao || 0) - (a.vendedor?.avaliacao || 0);
      case 'condition':
        const order: Record<string, number> = { novo: 0, quase_novo: 1, bom: 2, aceitavel: 3, ruim: 4 };
        return (order[a.condicao] ?? 99) - (order[b.condicao] ?? 99);
      default:
        return 0;
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Mostrando <span className="font-bold">{sortedLivros.length}</span> livros disponíveis
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-by" className="text-gray-600 text-sm">Ordenar por:</label>
          <select 
            id="sort-by"
            className="border rounded-md px-3 py-1 text-sm"
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
          >
            <option value="default">Relevância</option>
            <option value="price-low">Preço: menor primeiro</option>
            <option value="price-high">Preço: maior primeiro</option>
            <option value="rating">Melhor avaliação</option>
            <option value="condition">Melhor estado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedLivros.slice(0, 6).map((livro) => (
          <div key={livro.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img 
              src={livro.livro?.capa || livro.fotos?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'} 
              alt={livro.titulo}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-bold text-gray-900">{livro.titulo}</h4>
              <p className="text-sm text-gray-600">{livro.livro?.autor || 'Autor não especificado'}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-green-600 font-bold">
                  R$ {livro.preco.toFixed(2)}
                </span>
                <button 
                  onClick={() => onBookClick(livro.id)}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
