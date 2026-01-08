import { ArrowLeft, Heart, Share2, Star, ChevronDown, MessageCircle, RefreshCw, DollarSign, MapPin, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const bookData = {
  title: 'Cálculo - Volume 1',
  author: 'James Stewart',
  rating: 4,
  totalReviews: 12,
  price: 45.00,
  originalPrice: 120.00,
  condition: 'SEMINOVO',
  images: 3,
  details: {
    edition: '7ª edição (2013)',
    isbn: '978-8522112586',
    publisher: 'Cengage Learning',
    pages: 680,
    conditionNotes: 'Seminovo (poucas marcas de lápis)',
    subject: 'Cálculo Diferencial e Integral',
  },
  seller: {
    name: 'Maria Santos',
    avatar: 'MS',
    rating: 4.9,
    course: 'Engenharia Civil - 3º ano',
    transactions: 28,
    verified: true,
  },
  status: 'available', // 'available', 'sold', 'reserved'
};

const pickupLocations = [
  { name: 'Campus Central - Biblioteca', hours: '10-18h' },
  { name: 'Campus Norte - Cantina', hours: '12-14h' },
  { name: 'Entrega combinada via chat', hours: 'Flexível' },
];

const similarBooks = [
  { id: 1, title: 'Cálculo II - Stewart', course: 'Engenharia', price: 'R$ 50,00', rating: 5 },
  { id: 2, title: 'Álgebra Linear', course: 'Matemática', price: 'TROCA', rating: 4 },
  { id: 3, title: 'Física I - Halliday', course: 'Engenharia', price: 'R$ 60,00', rating: 5 },
];

export function BookDetails({ onBack, onOpenChat }: { onBack?: () => void; onOpenChat?: () => void }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    info: true,
    seller: false,
    pickup: false,
    faq: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const savings = Math.round(((bookData.originalPrice - bookData.price) / bookData.originalPrice) * 100);

  const conditionColors = {
    NOVO: 'bg-[#27AE60] text-white',
    SEMINOVO: 'bg-yellow-500 text-white',
    USADO: 'bg-orange-500 text-white',
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif] pb-32 md:pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            
            <h1 className="text-lg font-semibold text-gray-900">Detalhes do Livro</h1>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Heart
                  className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
                />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Status Overlay (se vendido ou reservado) */}
      {bookData.status === 'sold' && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-white px-8 py-4 rounded-lg shadow-xl">
            <p className="text-2xl font-bold text-gray-700">VENDIDO</p>
          </div>
        </div>
      )}

      {/* Container principal */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Imagem do livro com badge de estado */}
        <div className="bg-white rounded-lg shadow-md mb-6 relative overflow-hidden">
          <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="w-48 h-64 bg-gray-200 mx-auto rounded flex items-center justify-center shadow-lg">
                <span className="text-gray-400">Capa do Livro</span>
              </div>
            </div>

            {/* Badge de estado */}
            <div className={`absolute bottom-4 right-4 px-4 py-2 rounded-lg font-bold shadow-lg ${conditionColors[bookData.condition as keyof typeof conditionColors]}`}>
              {bookData.condition}
            </div>

            {/* Badge de reservado */}
            {bookData.status === 'reserved' && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                RESERVADO
              </div>
            )}
          </div>

          {/* Carrossel de fotos (dots) */}
          <div className="flex justify-center gap-2 py-4">
            {[...Array(bookData.images)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentImage === i ? 'bg-[#2C3E50] w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Informações principais */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{bookData.title}</h1>
          <h2 className="text-xl text-gray-600 mb-4">{bookData.author}</h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < bookData.rating
                      ? 'text-[#f39c12] fill-[#f39c12]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">({bookData.totalReviews} avaliações)</span>
          </div>

          {/* Preço */}
          <div className="mb-2">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-4xl font-bold text-[#27AE60]">
                R$ {bookData.price.toFixed(2)}
              </span>
              <span className="text-lg text-gray-500 line-through">
                R$ {bookData.originalPrice.toFixed(2)} novo
              </span>
            </div>
            <p className="text-[#27AE60] font-semibold">
              Você economiza {savings}%
            </p>
          </div>
        </div>

        {/* Accordion de detalhes */}
        <div className="space-y-3 mb-6">
          {/* Informações do Livro */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection('info')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">📖 Informações do Livro</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  expandedSections.info ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.info && (
              <div className="px-6 pb-4 space-y-2 text-gray-700">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium">Edição:</span>
                  <span>{bookData.details.edition}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium">ISBN:</span>
                  <span>{bookData.details.isbn}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium">Editora:</span>
                  <span>{bookData.details.publisher}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium">Páginas:</span>
                  <span>{bookData.details.pages}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium">Estado:</span>
                  <span>{bookData.details.conditionNotes}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Disciplina:</span>
                  <span>{bookData.details.subject}</span>
                </div>
              </div>
            )}
          </div>

          {/* Sobre o Vendedor */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection('seller')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">👤 Sobre o Vendedor</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  expandedSections.seller ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.seller && (
              <div className="px-6 pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#2C3E50] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {bookData.seller.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{bookData.seller.name}</h3>
                      {bookData.seller.verified && (
                        <CheckCircle className="w-5 h-5 text-[#27AE60]" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{bookData.seller.course}</p>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-[#f39c12] fill-[#f39c12]"
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">({bookData.seller.rating})</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">{bookData.seller.transactions}</span> transações concluídas
                    </p>
                    {bookData.seller.verified && (
                      <span className="inline-block mt-2 bg-[#27AE60] text-white text-xs px-3 py-1 rounded-full">
                        Membro verificado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Retirada/Entrega */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection('pickup')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">📍 Retirada/Entrega</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  expandedSections.pickup ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.pickup && (
              <div className="px-6 pb-4">
                <div className="space-y-3 mb-4">
                  {pickupLocations.map((location, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-[#27AE60] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{location.name}</p>
                        <p className="text-sm text-gray-600">{location.hours}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Mapa simplificado */}
                <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Mapa dos pontos de retirada</span>
                </div>
              </div>
            )}
          </div>

          {/* Perguntas Frequentes */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection('faq')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">💬 Perguntas Frequentes</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  expandedSections.faq ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.faq && (
              <div className="px-6 pb-4 space-y-4">
                <div>
                  <p className="font-medium text-gray-900 mb-1">Posso negociar o preço?</p>
                  <p className="text-gray-600">Sim, via chat</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Tem garantia?</p>
                  <p className="text-gray-600">Ver estado nas fotos</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Livros Similares */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">
            Outros anúncios que podem interessar
          </h2>
          <div className="space-y-3">
            {similarBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 flex gap-4 cursor-pointer hover:transform hover:scale-[1.01] transition-all"
              >
                <div className="w-20 h-28 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                  <span className="text-gray-400 text-xs text-center px-2">Capa</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{book.course}</p>
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < book.rating
                            ? 'text-[#f39c12] fill-[#f39c12]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-[#27AE60]">{book.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botões de ação fixos (sticky no mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg md:relative md:border-0 md:shadow-none">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={onOpenChat}
              className="flex-1 bg-[#3498db] hover:bg-[#2980b9] text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              Iniciar Conversa
            </button>
            <button className="flex-1 bg-[#27AE60] hover:bg-[#229954] text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-md">
              <RefreshCw className="w-5 h-5" />
              Propor Troca
            </button>
            <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-md">
              <DollarSign className="w-5 h-5" />
              Ofertar Valor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}