import { Star } from 'lucide-react';

const featuredBooks = [
  {
    id: 1,
    title: 'Cálculo I - Stewart',
    course: 'Engenharia',
    price: 'R$ 80,00',
    rating: 5,
    seller: {
      name: 'João Silva',
      avatar: 'JS',
    },
  },
  {
    id: 2,
    title: 'Anatomia Humana - Netter',
    course: 'Medicina',
    price: 'TROCA',
    rating: 5,
    seller: {
      name: 'Maria Santos',
      avatar: 'MS',
    },
  },
  {
    id: 3,
    title: 'Direito Constitucional',
    course: 'Direito',
    price: 'DOAÇÃO',
    rating: 4,
    seller: {
      name: 'Pedro Souza',
      avatar: 'PS',
    },
  },
  {
    id: 4,
    title: 'Administração de Marketing',
    course: 'Administração',
    price: 'R$ 60,00',
    rating: 5,
    seller: {
      name: 'Ana Costa',
      avatar: 'AC',
    },
  },
];

export function FeaturedBooks({ onBookClick }: { onBookClick?: () => void }) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Star className="w-6 h-6 text-[#27AE60] fill-[#27AE60]" />
          <h2 className="text-2xl md:text-3xl font-bold text-[#2C3E50]">
            Livros em Destaque
          </h2>
        </div>

        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-4 min-w-min">
            {featuredBooks.map((book) => (
              <div
                key={book.id}
                onClick={onBookClick}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 flex gap-4 min-w-[320px] md:min-w-[380px] cursor-pointer hover:transform hover:scale-[1.02] transition-all"
              >
                {/* Imagem do livro */}
                <div className="w-24 h-32 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                  <span className="text-gray-400 text-xs text-center px-2">
                    Capa do Livro
                  </span>
                </div>

                {/* Informações do livro */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{book.course}</p>
                    
                    {/* Avaliação */}
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < book.rating
                              ? 'text-[#f39c12] fill-[#f39c12]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Preço e vendedor */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold ${
                        book.price === 'TROCA'
                          ? 'text-[#3498db]'
                          : book.price === 'DOAÇÃO'
                          ? 'text-[#e67e22]'
                          : 'text-[#27AE60]'
                      }`}
                    >
                      {book.price}
                    </span>
                    
                    {/* Vendedor */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#2C3E50] rounded-full flex items-center justify-center text-white text-xs">
                        {book.seller.avatar}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}