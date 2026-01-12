import React, { useState } from 'react';
import { Livro } from '../types';
import { Star } from 'lucide-react';

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
          <div 
            key={livro.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
            onClick={() => onBookClick(livro.id)}
          >
            <div className="h-56 overflow-hidden">
              <img
                src={livro.livro?.capa || livro.fotos?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'}
                alt={livro.titulo}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                {livro.titulo}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3">
                {livro.livro?.autor || 'Autor não especificado'}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-blue-600">
                    R$ {livro.preco.toFixed(2)}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">
                    {livro.tipo === 'doacao' ? ' (Doação)' : livro.tipo === 'troca' ? ' (Troca)' : ''}
                  </span>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  livro.condicao === 'novo' ? 'bg-green-100 text-green-800' :
                  livro.condicao === 'quase_novo' ? 'bg-blue-100 text-blue-800' :
                  livro.condicao === 'bom' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {livro.condicao}
                </span>
              </div>
              
              {livro.vendedor && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">
                        {livro.vendedor.nome ? livro.vendedor.nome.charAt(0) : 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {livro.vendedor.nome}
                      </p>
                      <p className="text-xs text-gray-500">
                        {livro.vendedor.curso || 'Estudante'}
                      </p>
                    </div>
                  </div>
                  
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{(livro.vendedor.avaliacao ?? 0).toFixed(1)}</span>
                    </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}