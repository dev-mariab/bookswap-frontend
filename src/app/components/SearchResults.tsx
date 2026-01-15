import { ArrowLeft, SlidersHorizontal, Search, Grid3x3, List, MapPin, Star, Eye, Heart, X, TrendingUp, AlertCircle, Bell } from 'lucide-react';
import { useState, useEffect, ChangeEvent } from 'react';

type ViewMode = 'grid' | 'list';
type ListingType = 'venda' | 'troca' | 'doacao';
type SortOption = 'relevantes' | 'preco-menor' | 'preco-maior' | 'avaliacao' | 'recentes';

interface Filters {
  tipos: ListingType[];
  precoMin: number;
  precoMax: number;
  estados: string[];
  locais: string[];
  disciplinas: string[];
  ordenacao: SortOption;
}

interface Book {
  id: number | string;
  title: string;
  author: string;
  image: string;
  type: ListingType;
  price?: number;
  condition: string;
  sellerRating: number;
  sellerName: string;
  location: string;
  distance: string;
  isHighDemand?: boolean;
  isBelowAverage?: boolean;
  isTopSeller?: boolean;
  isNew?: boolean;
  views: number;
  favorites: number;
  course?: string;
}

const disciplinasOptions = [
  { name: 'Engenharia', count: 12 },
  { name: 'Medicina', count: 8 },
  { name: 'Direito', count: 5 },
  { name: 'Administração', count: 3 },
  { name: 'Computação', count: 7 },
];

export function SearchResults({ onBack, onBookClick }: { onBack?: () => void; onBookClick?: (id: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);
  const [filters, setFilters] = useState<Filters>({
    tipos: [],
    precoMin: 0,
    precoMax: 500,
    estados: [],
    locais: [],
    disciplinas: [],
    ordenacao: 'relevantes',
  });

  // Busca dados do Backend
  useEffect(() => {
    fetch('http://localhost:3001/api/livros')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const mappedBooks: Book[] = data.data.map((item: any) => ({
            id: item.id,
            title: item.titulo,
            author: item.autor || item.livro?.autor || 'Desconhecido',
            image: item.imagem || item.livro?.capa || item.fotos?.[0] || 'https://via.placeholder.com/150',
            type: (item.tipo?.toLowerCase() as ListingType) || 'venda',
            price: typeof item.preco === 'number' ? item.preco : parseFloat(item.preco || '0'),
            condition: item.condicao || 'Bom',
            sellerRating: 5.0,
            sellerName: typeof item.vendedor === 'object' ? item.vendedor.nome : item.vendedor || 'Usuário',
            location: item.localizacao || 'Campus Central',
            distance: '1.2 km',
            course: item.curso,
            views: Math.floor(Math.random() * 100),
            favorites: Math.floor(Math.random() * 20),
            isNew: true, // Adiciona tag visualmente
            isTopSeller: Math.random() > 0.8 // Simula tag visualmente
          }));
          setBooks(mappedBooks);
        }
      })
      .catch(err => console.error('Erro ao buscar livros:', err));
  }, []);

  // Lógica de Filtro
  const allFilteredBooks = books.filter(book => {
    if (searchQuery && !book.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.tipos.length > 0 && !filters.tipos.includes(book.type)) return false;
    if (book.price !== undefined && (book.price < filters.precoMin || book.price > filters.precoMax)) return false;
    if (filters.estados.length > 0 && !filters.estados.includes(book.condition)) return false;
    if (filters.disciplinas.length > 0 && book.course && !filters.disciplinas.includes(book.course)) return false;
    return true;
  }).sort((a, b) => {
    if (filters.ordenacao === 'preco-menor') return (a.price || 0) - (b.price || 0);
    if (filters.ordenacao === 'preco-maior') return (b.price || 0) - (a.price || 0);
    return 0;
  });

  // Lógica de Paginação
  const resultsPerPage = 12;
  const totalResults = allFilteredBooks.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  
  const currentBooks = allFilteredBooks.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const activeFiltersCount = 
    filters.tipos.length + 
    filters.estados.length + 
    filters.locais.length + 
    filters.disciplinas.length +
    (filters.precoMin > 0 || filters.precoMax < 500 ? 1 : 0);

  const toggleFilter = (category: keyof Filters, value: any) => {
    setFilters(prev => {
      const current = prev[category] as any[];
      if (Array.isArray(current)) {
        return {
          ...prev,
          [category]: current.includes(value) 
            ? current.filter(item => item !== value)
            : [...current, value]
        };
      }
      return prev;
    });
  };

  const clearFilters = () => {
    setFilters({
      tipos: [],
      precoMin: 0,
      precoMax: 500,
      estados: [],
      locais: [],
      disciplinas: [],
      ordenacao: 'relevantes',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar livros..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5 text-gray-700" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#27AE60] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-sm text-gray-900 font-semibold">
                {totalResults} resultados encontrados
              </p>
            </div>
            <button className="text-sm text-[#2C3E50] hover:underline font-medium flex items-center gap-1">
              <Bell className="w-4 h-4" />
              Salvar esta busca
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside className={`w-64 flex-shrink-0 hidden lg:block ${showFilters ? '' : 'lg:hidden'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Filtros</h3>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-sm text-red-600 hover:underline">
                    Limpar
                  </button>
                )}
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Tipo</h4>
                <div className="space-y-2">
                  {['venda', 'troca', 'doacao'].map((tipo) => (
                    <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.tipos.includes(tipo as ListingType)}
                        onChange={() => toggleFilter('tipos', tipo)}
                        className="w-4 h-4 text-[#2C3E50] rounded focus:ring-2 focus:ring-[#2C3E50]"
                      />
                      <span className="text-gray-700 capitalize">{tipo}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Preço</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.precoMax}
                    onChange={(e) => setFilters({ ...filters, precoMax: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-600 mb-1 block">Mínimo</label>
                      <input
                        type="number"
                        value={filters.precoMin}
                        onChange={(e) => setFilters({ ...filters, precoMin: Number(e.target.value) })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-600 mb-1 block">Máximo</label>
                      <input
                        type="number"
                        value={filters.precoMax}
                        onChange={(e) => setFilters({ ...filters, precoMax: Number(e.target.value) })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Estado do Livro</h4>
                <div className="space-y-2">
                  {['novo', 'seminovo', 'usado', 'desgastado'].map((estado) => (
                    <label key={estado} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.estados.includes(estado)}
                        onChange={() => toggleFilter('estados', estado)}
                        className="w-4 h-4 text-[#2C3E50] rounded focus:ring-2 focus:ring-[#2C3E50]"
                      />
                      <span className="text-gray-700 capitalize">{estado}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Ordenar por</h4>
                <select
                  value={filters.ordenacao}
                  onChange={(e) => setFilters({ ...filters, ordenacao: e.target.value as SortOption })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                >
                  <option value="relevantes">Mais relevantes</option>
                  <option value="preco-menor">Preço: menor primeiro</option>
                  <option value="preco-maior">Preço: maior primeiro</option>
                  <option value="avaliacao">Avaliação do vendedor</option>
                </select>
              </div>
            </div>
          </aside>

          {showFilters && (
            <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setShowFilters(false)}>
              <div
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Filtros</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  {/* Conteúdo Mobile dos Filtros aqui (omitido para brevidade, usa a mesma lógica do desktop) */}
                  <div className="flex gap-3 mt-6">
                    <button onClick={clearFilters} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50">Limpar</button>
                    <button onClick={() => setShowFilters(false)} className="flex-1 px-4 py-3 bg-[#27AE60] text-white rounded-lg font-semibold hover:bg-[#229954]">Aplicar</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Página {currentPage} de {totalPages || 1}
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-[#2C3E50] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-[#2C3E50] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {currentBooks.length > 0 ? (
              <>
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'space-y-4'
                }>
                  {currentBooks.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => onBookClick && onBookClick(String(book.id))}
                      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <div className={`relative bg-gray-200 flex items-center justify-center ${
                        viewMode === 'list' ? 'w-32 h-32' : 'h-48'
                      }`}>
                        <img 
                          src={book.image} 
                          alt={book.title} 
                          className="w-full h-full object-cover"
                        />
                        
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {book.isHighDemand && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> Alta
                            </span>
                          )}
                          {book.isNew && (
                            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded font-semibold">
                              Novo
                            </span>
                          )}
                        </div>

                        <div className="absolute top-2 right-2">
                          <button className="bg-white/90 p-1.5 rounded-full hover:bg-white transition-colors">
                            <Heart className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="flex items-start gap-2 mb-2">
                          <h3 className={`font-semibold text-gray-900 flex-1 ${
                            viewMode === 'list' ? 'text-base' : 'text-sm line-clamp-2'
                          }`}>
                            {book.title}
                          </h3>
                          <span className={`flex-shrink-0 text-xs px-2 py-1 rounded font-semibold ${
                            book.type === 'venda' ? 'bg-blue-100 text-blue-700' :
                            book.type === 'troca' ? 'bg-purple-100 text-purple-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {book.type.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 mb-2">{book.author}</p>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#27AE60] font-bold">
                            {book.type === 'venda' && book.price ? `R$ ${book.price.toFixed(2)}` : 
                             book.type === 'troca' ? 'TROCA' : 'GRÁTIS'}
                          </span>
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold capitalize">
                            {book.condition}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-[#f39c12] fill-[#f39c12]" />
                            <span className="text-xs font-semibold">{book.sellerRating}</span>
                          </div>
                          <span className="text-xs text-gray-600 truncate">{book.sellerName}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[100px]">{book.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    ← Anterior
                  </button>
                  
                  <span className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    Próximo →
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum livro encontrado</h3>
                <p className="text-gray-600 mb-6">Tente ajustar seus filtros de busca.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}