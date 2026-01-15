import { Livro } from '../types';

interface BookDetailsProps {
  book: Livro | null;
  onBack: () => void;
  onOpenChat: () => void;
}

export function BookDetails({ book, onBack, onOpenChat }: BookDetailsProps) {
  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <button 
          onClick={onBack}
          className="mb-6 text-blue-600 hover:text-blue-800"
        >
          ← Voltar para lista
        </button>
        <div className="text-center py-12">
          <p className="text-gray-500">Livro não encontrado</p>
        </div>
      </div>
    );
  }

  const vendedorNome = typeof book.vendedor === 'object' ? book.vendedor.nome : book.vendedor || 'Vendedor';
  const vendedorCurso = typeof book.vendedor === 'object' ? book.vendedor.curso : book.curso || 'Universitário';
  const vendedorAvaliacao = typeof book.vendedor === 'object' ? book.vendedor.avaliacao : book.avaliacao || 5.0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            ← Voltar para lista
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img 
                src={(book as any).imagem || book.livro?.capa || book.fotos?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'} 
                alt={book.titulo}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {book.fotos && book.fotos.length > 1 && (
              <div className="flex gap-2 mt-4">
                {book.fotos.map((foto: string, index: number) => (
                  <img 
                    key={index}
                    src={foto}
                    alt={`${book.titulo} - ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {book.titulo}
              </h1>
              
              <p className="text-gray-600 mb-4">
                por {book.autor || book.livro?.autor || 'Autor desconhecido'}
              </p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  R$ {book.preco?.toFixed(2) || '0.00'}
                </span>
                {book.tipo !== 'venda' && (
                  <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {book.tipo === 'doacao' ? '🆓 Doação' : '🔄 Troca'}
                  </span>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Estado do livro:</h3>
                <span className={`px-4 py-2 rounded-full font-medium ${
                  book.condicao === 'novo' ? 'bg-green-100 text-green-800' :
                  book.condicao === 'quase_novo' ? 'bg-blue-100 text-blue-800' :
                  book.condicao === 'bom' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {book.condicao}
                </span>
              </div>
              
              {book.descricao && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Descrição:</h3>
                  <p className="text-gray-600">{book.descricao}</p>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Sobre o vendedor:</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {vendedorNome.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{vendedorNome}</p>
                    <p className="text-gray-600 text-sm">
                      {vendedorCurso} • ⭐ {typeof vendedorAvaliacao === 'number' ? vendedorAvaliacao.toFixed(1) : '5.0'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={onOpenChat}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Conversar com vendedor
                </button>
                <button 
                  onClick={() => alert('Livro adicionado aos favoritos!')}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Favoritar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}