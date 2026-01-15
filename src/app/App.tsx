/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { Search, ArrowLeft, SlidersHorizontal, MapPin, Star, Heart } from 'lucide-react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturedBooks } from './components/FeaturedBooks';
import { CourseCategories } from './components/CourseCategories';
import { TopUsers } from './components/TopUsers';
import { ExchangePoints } from './components/ExchangePoints';
import { Footer } from './components/Footer';
import { BookDetails } from './components/BookDetails';
import { Chat } from './components/Chat';
import { CreateListing } from './components/CreateListing';
import { BookFilters } from './components/BookFilters';
import { Livro } from './types';
import { BookObserverManager, BookListObserver } from './observers/BookObserver';
import { useSearchStrategy } from '../hooks/useSearchStrategy';

export default function App() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [selectedBook, setSelectedBook] = useState<Livro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'home' | 'details' | 'chat' | 'criar-anuncio' | 'busca'>('home');
  
  const [filters, setFilters] = useState({ 
    curso: '', 
    condicao: '', 
    tipo: '', 
    precoMin: '', 
    precoMax: '' 
  });

  const [searchTerm, setSearchTerm] = useState('');
  
  // Renomeamos para setHookSearchTerm para evitar conflito de nomes
  const { searchResults, searchStrategy, setSearchType, setSearchTerm: setHookSearchTerm } = useSearchStrategy(livros);

  useEffect(() => {
    const bookListObserver = new BookListObserver((newBook: any) => {
      const livroTransformado: Livro = {
        id: newBook.id || Date.now(),
        titulo: newBook.titulo || 'Novo Livro',
        descricao: newBook.descricao || '',
        preco: typeof newBook.preco === 'string' ? parseFloat(newBook.preco) : (newBook.preco || 0),
        condicao: newBook.condicao || 'novo',
        tipo: newBook.listingType || newBook.tipo || 'venda',
        autor: newBook.autor || 'Desconhecido',
        imagem: newBook.imagem || (newBook.photos && newBook.photos[0]) || 'https://via.placeholder.com/150',
        curso: newBook.curso || 'Geral',
        vendedor: {
          nome: newBook.vendedor || 'Usuário',
          avaliacao: 5.0,
          curso: newBook.curso
        },
        livro: {
          titulo: newBook.titulo,
          autor: newBook.autor,
          capa: newBook.imagem
        },
        fotos: newBook.imagem ? [newBook.imagem] : (newBook.photos || [])
      };
      
      setLivros(prev => [livroTransformado, ...prev]);
    });
    
    const bookSubject = BookObserverManager.getInstance();
    bookSubject.attach(bookListObserver);
    
    return () => {
      bookSubject.detach(bookListObserver);
    };
  }, []);

  const fetchLivros = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:3001/api/livros');
      
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        const livrosAdaptados: Livro[] = data.data.map((item: any) => ({
          id: item.id,
          titulo: item.titulo,
          descricao: item.descricao,
          preco: typeof item.preco === 'number' ? item.preco : parseFloat(item.preco || '0'),
          condicao: item.condicao,
          tipo: item.tipo,
          autor: item.autor,
          imagem: item.imagem,
          curso: item.curso,
          avaliacao: item.avaliacao,
          localizacao: item.localizacao, 
          vendedor: typeof item.vendedor === 'string' 
            ? { nome: item.vendedor, avaliacao: 5.0, curso: item.curso } 
            : item.vendedor || { nome: 'Anônimo', avaliacao: 0 },
          livro: {
            titulo: item.titulo,
            autor: item.autor,
            capa: item.imagem
          },
          fotos: item.imagem ? [item.imagem] : []
        }));
        
        setLivros(livrosAdaptados);
      }
    } catch (err: any) {
      setError('Erro ao carregar dados.');
      setLivros(getMockLivros());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLivros();
  }, [fetchLivros]);

  const livrosFiltrados = livros.filter(livro => {
    if (filters.curso && livro.curso !== filters.curso && (livro.vendedor as any)?.curso !== filters.curso) return false;
    if (filters.condicao && livro.condicao !== filters.condicao) return false;
    if (filters.tipo && livro.tipo !== filters.tipo) return false;
    if (filters.precoMin && livro.preco < parseFloat(filters.precoMin)) return false;
    if (filters.precoMax && livro.preco > parseFloat(filters.precoMax)) return false;
    
    if (searchTerm && view === 'home') {
      const term = searchTerm.toLowerCase();
      return (
        livro.titulo?.toLowerCase().includes(term) ||
        livro.autor?.toLowerCase().includes(term) ||
        false
      );
    }
    return true;
  });

  const handleBookClick = (bookId: string | number) => {
    const book = livros.find(l => String(l.id) === String(bookId));
    if (book) {
      setSelectedBook(book);
      setView('details');
    }
  };

  const handleOpenChat = () => {
    if (selectedBook) setView('chat');
  };

  // CORREÇÃO: Atualiza tanto o visual (searchTerm) quanto a lógica (Hook)
  const handleStrategySearch = (term: string) => {
    setSearchTerm(term); // Atualiza o input visualmente
    setHookSearchTerm(term); // Atualiza a lógica de busca do Strategy
  };

  const handleSearchTypeChange = (type: 'titulo' | 'autor' | 'curso' | 'tudo') => {
    setSearchType(type);
  };

  const resetFilters = () => {
    setFilters({
      curso: '',
      condicao: '',
      tipo: '',
      precoMin: '',
      precoMax: ''
    });
    setSearchTerm(''); // Limpa visualmente também
  };

  if (view === 'chat' && selectedBook) {
    return <Chat onBack={() => setView('details')} book={selectedBook} />;
  }
  
  if (view === 'details' && selectedBook) {
    return (
      <BookDetails 
        book={selectedBook} 
        onBack={() => setView('home')} 
        onOpenChat={handleOpenChat} 
      />
    );
  }

  if (view === 'criar-anuncio') {
    return (
      <CreateListing 
        onBack={() => setView('home')}
        onSuccess={(newBook?: any) => {
          if (newBook) {
            const bookSubject = BookObserverManager.getInstance();
            bookSubject.notify(newBook);
          }
          fetchLivros();
          setView('home');
        }}
      />
    );
  }

  if (view === 'busca') {
    return (
      <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
        <Header 
          onSearch={(t) => {
             setSearchTerm(t);
             setHookSearchTerm(t);
          }} 
          onSellClick={() => setView('criar-anuncio')} 
        />
        
        <div className="container mx-auto px-4 py-8">
          <button 
            onClick={() => {
              setView('home');
              setSearchTerm('');
            }}
            className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Voltar para Home
          </button>

          <h1 className="text-3xl font-bold mb-6">Busca Avançada</h1>
          
          <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-blue-600" />
              Configurar Estratégia
            </h3>
            
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Digite o termo para pesquisar..."
                  value={searchTerm}
                  onChange={(e) => handleStrategySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => handleSearchTypeChange('titulo')}
                  className={`px-4 py-3 rounded-lg font-medium transition-all text-sm flex flex-col items-center justify-center gap-2 border ${
                    searchStrategy.constructor.name === 'TitleSearchStrategy' 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">📚</span>
                  Por Título
                </button>
                <button
                  onClick={() => handleSearchTypeChange('autor')}
                  className={`px-4 py-3 rounded-lg font-medium transition-all text-sm flex flex-col items-center justify-center gap-2 border ${
                    searchStrategy.constructor.name === 'AuthorSearchStrategy' 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">✍️</span>
                  Por Autor
                </button>
                <button
                  onClick={() => handleSearchTypeChange('curso')}
                  className={`px-4 py-3 rounded-lg font-medium transition-all text-sm flex flex-col items-center justify-center gap-2 border ${
                    searchStrategy.constructor.name === 'CourseSearchStrategy' 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">🎓</span>
                  Por Curso
                </button>
                <button
                  onClick={() => handleSearchTypeChange('tudo')}
                  className={`px-4 py-3 rounded-lg font-medium transition-all text-sm flex flex-col items-center justify-center gap-2 border ${
                    searchStrategy.constructor.name === 'AllSearchStrategy' 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">🔍</span>
                  Em Tudo
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">Resultados Encontrados</h2>
              <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                {searchResults.length} livros
              </span>
            </div>
            
            <div className="p-6">
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((book) => (
                    <div 
                      key={book.id} 
                      onClick={() => handleBookClick(book.id)}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group"
                    >
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        <img 
                          src={book.imagem || book.livro?.capa || 'https://via.placeholder.com/150'} 
                          alt={book.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                        </div>
                        {book.tipo && (
                          <div className="absolute top-2 left-2">
                            <span className={`text-xs px-2 py-1 rounded font-bold text-white uppercase ${
                              book.tipo === 'venda' ? 'bg-blue-500' : 
                              book.tipo === 'troca' ? 'bg-purple-500' : 'bg-green-500'
                            }`}>
                              {book.tipo}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 line-clamp-1 mb-1" title={book.titulo}>
                          {book.titulo}
                        </h4>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                          {book.autor || book.livro?.autor || 'Autor desconhecido'}
                        </p>
                        
                        <div className="flex items-center gap-2 mb-3 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{book.localizacao || 'Campus Central'}</span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <span className="text-lg font-bold text-green-600">
                            {typeof book.preco === 'number' ? `R$ ${book.preco.toFixed(2)}` : 'R$ 0.00'}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-yellow-600 font-medium">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            {typeof book.vendedor === 'object' ? book.vendedor.avaliacao : '5.0'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">Nenhum livro encontrado</h3>
                  <p className="text-gray-500 mb-6">Tente mudar o termo ou selecione outra estratégia.</p>
                  <button 
                    onClick={() => setSearchType('tudo')}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Tentar buscar em todos os campos
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
      <Header 
        onSearch={(term) => {
          setSearchTerm(term);
        }} 
        onSellClick={() => setView('criar-anuncio')}
      />
      
      <main>
        <HeroSection 
          onSellBook={() => setView('criar-anuncio')}
          onSearchBook={() => setView('busca')}
          onDonateBook={() => {
            setFilters({...filters, tipo: 'doacao'});
            document.getElementById('featured-books')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        
        <section id="featured-books" className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Livros em Destaque</h2>
            
            <div className="flex gap-2">
              <button
                onClick={() => fetchLivros()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Atualizar
              </button>
              
              <button
                onClick={() => setView('busca')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Busca Avançada
              </button>
            </div>
          </div>
          
          <BookFilters 
            filters={filters}
            onFilterChange={(newFilters: any) => setFilters(newFilters)}
            onReset={resetFilters}
            cursosDisponiveis={['Engenharia', 'Direito', 'Medicina', 'Computação']}
          />
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando livros...</p>
            </div>
          ) : error && livros.length === 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700 font-medium">{error}</p>
              <button 
                onClick={() => fetchLivros()}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <FeaturedBooks 
              livros={livrosFiltrados}
              onBookClick={(id: string | number) => handleBookClick(id)} 
              totalLivros={livros.length}
            />
          )}
        </section>

        <CourseCategories onSelectCategory={(cat) => setFilters({...filters, curso: cat})} />
        <TopUsers onUserClick={(id) => console.log('Usuário clicado:', id)} />
        <ExchangePoints />
      </main>
      
      <Footer />
      
      <button
        onClick={() => setView('criar-anuncio')}
        className="fixed bottom-6 right-6 bg-[#27AE60] text-white p-4 rounded-full shadow-lg hover:bg-[#219150] hover:shadow-xl transition-all z-50 transform hover:scale-110 group"
        title="Vender Livro"
      >
        <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap top-1/2 -translate-y-1/2">
          Anunciar agora
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

function getMockLivros(): Livro[] {
  return [
    {
      id: '1',
      titulo: 'Cálculo Vol. 1',
      autor: 'James Stewart',
      preco: 45.50,
      condicao: 'quase_novo',
      tipo: 'venda',
      imagem: 'https://m.media-amazon.com/images/I/81C5El+-h2L._AC_UF1000,1000_QL80_.jpg',
      vendedor: { nome: 'Maria Silva', avaliacao: 4.8, curso: 'Engenharia Civil' },
      curso: 'Engenharia'
    },
    {
      id: '2',
      titulo: 'Física I',
      autor: 'Halliday',
      preco: 60.00,
      condicao: 'bom',
      tipo: 'troca',
      imagem: 'https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg',
      vendedor: { nome: 'João Santos', avaliacao: 4.5, curso: 'Física' },
      curso: 'Física'
    },
    {
      id: '3',
      titulo: 'Química Geral',
      autor: 'John C. Kotz',
      preco: 55.00,
      condicao: 'novo',
      tipo: 'doacao',
      imagem: 'https://m.media-amazon.com/images/I/81C5El+-h2L._AC_UF1000,1000_QL80_.jpg',
      vendedor: { nome: 'Ana Oliveira', avaliacao: 4.9, curso: 'Química' },
      curso: 'Química'
    }
  ];
}