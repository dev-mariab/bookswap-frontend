import { ArrowLeft, SlidersHorizontal, Search, Grid3x3, List, MapPin, Star, Eye, Heart, X, TrendingUp, AlertCircle, Bell } from 'lucide-react';
import { useState, ChangeEvent } from 'react';

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
  id: number;
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
}

const mockBooks: Book[] = [
  {
    id: 1,
    title: 'Cálculo - Volume 1',
    author: 'James Stewart',
    image: '',
    type: 'venda',
    price: 45,
    condition: 'Seminovo',
    sellerRating: 4.9,
    sellerName: 'Ana Silva',
    location: 'Campus Central',
    distance: '0.5 km',
    isBelowAverage: true,
    isTopSeller: true,
    views: 123,
    favorites: 8,
  },
  {
    id: 2,
    title: 'Cálculo Diferencial e Integral',
    author: 'Guidorizzi',
    image: '',
    type: 'troca',
    condition: 'Novo',
    sellerRating: 4.7,
    sellerName: 'Carlos Souza',
    location: 'Campus Norte',
    distance: '2.3 km',
    isHighDemand: true,
    isNew: true,
    views: 89,
    favorites: 15,
  },
  {
    id: 3,
    title: 'Cálculo Vol. 1 - Thomas',
    author: 'George Thomas',
    image: '',
    type: 'venda',
    price: 60,
    condition: 'Usado',
    sellerRating: 4.8,
    sellerName: 'Maria Santos',
    location: 'Campus Leste',
    distance: '4.1 km',
    views: 67,
    favorites: 5,
  },
  {
    id: 4,
    title: 'Cálculo A - Diva Flemming',
    author: 'Diva Flemming',
    image: '',
    type: 'doacao',
    condition: 'Seminovo',
    sellerRating: 5.0,
    sellerName: 'Pedro Costa',
    location: 'Campus Central',
    distance: '0.8 km',
    isTopSeller: true,
    views: 201,
    favorites: 23,
  },
];

const disciplinasOptions = [
  { name: 'Cálculo', count: 12 },
  { name: 'Física', count: 8 },
  { name: 'Álgebra', count: 5 },
  { name: 'Química', count: 3 },
  { name: 'Programação', count: 7 },
];

export function SearchResults({ onBack }: { onBack?: () => void }) {
  const [searchQuery, setSearchQuery] = useState('Cálculo diferencial e integral');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    tipos: [],
    precoMin: 0,
    precoMax: 200,
    estados: [],
    locais: [],
    disciplinas: [],
    ordenacao: 'relevantes',
  });

  const totalResults = 12;
  const resultsPerPage = 12;
  const vendasCount = 4;
  const trocasCount = 5;
  const doacoesCount = 3;

  const filteredBooks = mockBooks; 

  type ArrayKeys = { [K in keyof Filters]: Filters[K] extends unknown[] ? K : never }[keyof Filters];

  const toggleFilter = <K extends ArrayKeys>(category: K, value: Filters[K] extends (infer U)[] ? U : never) => {
    const currentArray = filters[category] as unknown as Array<Filters[K] extends (infer U)[] ? U : never>;
    if (currentArray.includes(value)) {
      setFilters({
        ...filters,
        [category]: currentArray.filter(item => item !== value) as Filters[K],
      });
    } else {
      setFilters({
        ...filters,
        [category]: ([...currentArray, value] as unknown) as Filters[K],
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      tipos: [],
      precoMin: 0,
      precoMax: 200,
      estados: [],
      locais: [],
      disciplinas: [],
      ordenacao: 'relevantes',
    });
  };

  const activeFiltersCount = 
    filters.tipos.length + 
    filters.estados.length + 
    filters.locais.length + 
    filters.disciplinas.length +
    (filters.precoMin > 0 || filters.precoMax < 200 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
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
                {totalResults} resultados para "{searchQuery}"
              </p>
              <p className="text-xs text-gray-600">
                {vendasCount} vendas • {trocasCount} trocas • {doacoesCount} doações
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
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Limpar
                  </button>
                )}
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Tipo</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.tipos.includes('venda')}
                      onChange={() => toggleFilter('tipos', 'venda')}
                      className="w-4 h-4 text-[#2C3E50] rounded focus:ring-2 focus:ring-[#2C3E50]"
                    />
                    <span className="text-gray-700">Venda</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.tipos.includes('troca')}
                      onChange={() => toggleFilter('tipos', 'troca')}
                      className="w-4 h-4 text-[#2C3E50] rounded focus:ring-2 focus:ring-[#2C3E50]"
                    />
                    <span className="text-gray-700">Troca</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.tipos.includes('doacao')}
                      onChange={() => toggleFilter('tipos', 'doacao')}
                      className="w-4 h-4 text-[#2C3E50] rounded focus:ring-2 focus:ring-[#2C3E50]"
                    />
                    <span className="text-gray-700">Doação</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Preço</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="200"
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
                  {['Novo', 'Seminovo', 'Usado', 'Desgastado'].map((estado) => (
                    <label key={estado} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.estados.includes(estado)}
                        onChange={() => toggleFilter('estados', estado)}
                        className="w-4 h-4 text-[#2C3E50] rounded focus:ring-2 focus:ring-[#2C3E50]"
                      />
                      <span className="text-gray-700">{estado}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Localização</h4>
                <div className="space-y-2">
                  {['Campus Central', 'Campus Norte', 'Campus Leste', 'Entregas combinadas'].map((local) => (
                    <label key={local} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.locais.includes(local)}
                        onChange={() => toggleFilter('locais', local)}
                        className="w-4 h-4 text-[#2C3E50] rounded focus:ring-2 focus:ring-[#2C3E50]"
                      />
                      <span className="text-gray-700 text-sm">{local}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="text-xs text-gray-600 mb-1 block">Raio: 5km</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    defaultValue="5"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Disciplina</h4>
                <div className="space-y-2">
                  {disciplinasOptions.map((disc) => (
                    <label key={disc.name} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.disciplinas.includes(disc.name)}
                          onChange={() => toggleFilter('disciplinas', disc.name)}
                          className="w-4 h-4 text-[#2C3E50] rounded focus:ring-2 focus:ring-[#2C3E50]"
                        />
                        <span className="text-gray-700 text-sm">{disc.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">({disc.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Ordenar por</h4>
                <select
                  value={filters.ordenacao}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilters({ ...filters, ordenacao: e.target.value as SortOption })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                >
                  <option value="relevantes">Mais relevantes</option>
                  <option value="preco-menor">Preço: menor primeiro</option>
                  <option value="preco-maior">Preço: maior primeiro</option>
                  <option value="avaliacao">Avaliação do vendedor</option>
                  <option value="recentes">Mais recentes</option>
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
                  <div className="space-y-6">
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={clearFilters}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Limpar
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="flex-1 px-4 py-3 bg-[#27AE60] text-white rounded-lg font-semibold hover:bg-[#229954]"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Mostrando {((currentPage - 1) * resultsPerPage) + 1}-{Math.min(currentPage * resultsPerPage, totalResults)} de {totalResults} resultados
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

            {filteredBooks.length > 0 ? (
              <>
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'space-y-4'
                }>
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <div className={`relative bg-gray-200 flex items-center justify-center ${
                        viewMode === 'list' ? 'w-32 h-32' : 'h-48'
                      }`}>
                        <span className="text-gray-400 text-xs">Capa</span>
                        
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {book.isHighDemand && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Alta demanda
                            </span>
                          )}
                          {book.isBelowAverage && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold">
                              Preço abaixo da média
                            </span>
                          )}
                          {book.isTopSeller && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-semibold">
                              Vendedor top
                            </span>
                          )}
                          {book.isNew && (
                            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded font-semibold">
                              Novo anúncio
                            </span>
                          )}
                        </div>

                        <button className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full hover:bg-white transition-colors">
                          <Heart className="w-4 h-4 text-gray-600" />
                        </button>
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
                            {book.type === 'venda' ? 'VENDA' : book.type === 'troca' ? 'TROCA' : 'DOAÇÃO'}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 mb-2">{book.author}</p>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#27AE60] font-bold">
                            {book.type === 'venda' && book.price ? `R$ ${book.price.toFixed(2)}` : 
                             book.type === 'troca' ? 'TROCA' : 'GRÁTIS'}
                          </span>
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold">
                            {book.condition}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-[#f39c12] fill-[#f39c12]" />
                            <span className="text-xs font-semibold">{book.sellerRating}</span>
                          </div>
                          <span className="text-xs text-gray-600">{book.sellerName}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{book.location}</span>
                          </div>
                          <span>{book.distance}</span>
                        </div>

                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{book.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            <span>{book.favorites}</span>
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
                  
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-semibold ${
                          currentPage === page
                            ? 'bg-[#2C3E50] text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={currentPage === 4}
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
                <p className="text-gray-600 mb-6">Não encontramos resultados para sua busca.</p>
                
                <div className="space-y-3 max-w-md mx-auto">
                  <div className="bg-gray-50 rounded-lg p-4 text-left">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-gray-600" />
                      Sugestões:
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-7">
                      <li>• Tente outros termos de busca</li>
                      <li>• Remova alguns filtros</li>
                      <li>• Verifique a ortografia</li>
                    </ul>
                  </div>

                  <button className="w-full px-4 py-3 bg-[#27AE60] text-white rounded-lg font-semibold hover:bg-[#229954] transition-colors flex items-center justify-center gap-2">
                    <Bell className="w-5 h-5" />
                    Criar alerta para esta busca
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
