import { Livro } from '../types';

interface FeaturedBooksProps {
  livros: Livro[];
  onBookClick: (id: string | number) => void;
  totalLivros: number;
}

export function FeaturedBooks({ livros, onBookClick, totalLivros }: FeaturedBooksProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {livros.map((livro) => (
        <div 
          key={livro.id}
          onClick={() => onBookClick(livro.id)}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="aspect-video bg-gray-100 overflow-hidden">
            <img 
              src={livro.imagem || livro.livro?.capa || 'https://via.placeholder.com/300x200'} 
              alt={livro.titulo}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-bold text-gray-900 line-clamp-2 mb-1">{livro.titulo}</h3>
            <p className="text-sm text-gray-600 mb-2">{livro.autor || 'Autor desconhecido'}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">R$ {livro.preco.toFixed(2)}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{livro.tipo || 'venda'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}