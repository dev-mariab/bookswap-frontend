/* eslint-disable @typescript-eslint/no-explicit-any */
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturedBooks } from './components/FeaturedBooks';
import { CourseCategories } from './components/CourseCategories';
import { TopUsers } from './components/TopUsers';
import { ExchangePoints } from './components/ExchangePoints';
import { Footer } from './components/Footer';
import { BookDetails } from './components/BookDetails';
import { Chat } from './components/Chat';
import { useState, useEffect, useCallback } from 'react';
import { Livro } from './types';
import { CreateListing } from './components/CreateListing';
import { BookFilters } from './components/BookFilters';

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
  
  const { searchResults, searchStrategy, setSearchType } = useSearchStrategy(livros);

  useEffect(() => {
    console.log('Configurando Observer Pattern...');
    
    const bookListObserver = new BookListObserver((newBook: any) => {
      console.log('Observer: Recebendo novo livro via Observer Pattern:', newBook);
      
      const livroTransformado: Livro = {
        id: newBook.id?.toString() || Date.now().toString(),
        titulo: newBook.titulo || 'Novo Livro',
        descricao: newBook.descricao || `Livro "${newBook.titulo}"`,
        preco: newBook.preco || 0,
        condicao: newBook.condicao || 'novo',
        tipo: newBook.tipo || 'livro_didatico',
        vendedor: {
          nome: newBook.vendedor || 'Novo Usuário',
          avaliacao: newBook.avaliacao || 5.0,
          curso: newBook.curso || 'Engenharia'
        },
        livro: {
          titulo: newBook.titulo || 'Novo Livro',
          autor: newBook.autor || 'Autor Desconhecido',
          capa: newBook.imagem || 'https://via.placeholder.com/150'
        },
        fotos: newBook.imagem ? [newBook.imagem] : []
      };
      
      setLivros(prev => [livroTransformado, ...prev]);
      
      console.log('Novo livro adicionado via Observer Pattern!');
    });
    
    const bookSubject = BookObserverManager.getInstance();
    bookSubject.attach(bookListObserver);
    
    console.log('Observer Pattern configurado');
    
    return () => {
      bookSubject.detach(bookListObserver);
    };
  }, []);

  const fetchLivros = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Buscando livros do backend...');
      
      const response = await fetch('http://localhost:3001/api/livros');
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Dados recebidos do backend:', data);
      
      if (data.success && data.data) {
        const livrosTransformados = data.data.map((livro: any) => ({
          id: livro.id?.toString() || Date.now().toString(),
          titulo: livro.titulo || 'Sem Título',
          descricao: livro.descricao || `Livro "${livro.titulo}" por ${livro.autor}`,
          preco: livro.preco || 0,
          condicao: livro.condicao || 'novo',
          tipo: livro.tipo || 'venda',
          vendedor: {
            nome: livro.vendedor || 'Anônimo',
            avaliacao: livro.avaliacao || 5.0,
            curso: livro.curso || 'Engenharia'
          },
          livro: {
            titulo: livro.titulo || 'Sem Título',
            autor: livro.autor || 'Autor Desconhecido',
            capa: livro.imagem || 'https://via.placeholder.com/150'
          },
          fotos: livro.imagem ? [livro.imagem] : [],
          curso: livro.curso,
          createdAt: livro.createdAt
        }));
        
        setLivros(livrosTransformados);
        console.log(`${livrosTransformados.length} livros carregados`);
      } else {
        throw new Error(data.error || 'Formato de dados inválido');
      }
    } catch (err: any) {
      console.error('Erro ao carregar livros:', err);
      setError(err.message || 'Não foi possível carregar os livros. Verifique se o backend está rodando.');
      
      setLivros(getMockLivros());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLivros();
  }, [fetchLivros]);

  const livrosFiltrados = livros.filter(livro => {
    if (filters.curso && livro.vendedor?.curso !== filters.curso) {
      return false;
    }
    
    if (filters.condicao && livro.condicao !== filters.condicao) {
      return false;
    }
    
    if (filters.tipo && livro.tipo !== filters.tipo) {
      return false;
    }
    
    if (filters.precoMin && livro.preco < parseFloat(filters.precoMin)) {
      return false;
    }
    
    if (filters.precoMax && livro.preco > parseFloat(filters.precoMax)) {
      return false;
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchTitulo = livro.titulo?.toLowerCase().includes(term);
      const matchAutor = livro.livro?.autor?.toLowerCase().includes(term);
      const matchCurso = livro.vendedor?.curso?.toLowerCase().includes(term);
      const matchDescricao = livro.descricao?.toLowerCase().includes(term);
      
      if (!matchTitulo && !matchAutor && !matchCurso && !matchDescricao) {
        return false;
      }
    }
    
    return true;
  });

  const cursosDisponiveis = Array.from(
    new Set(livros.map(l => l.vendedor?.curso).filter((c): c is string => typeof c === 'string'))
  );

  const resetFilters = () => {
    setFilters({
      curso: '',
      condicao: '',
      tipo: '',
      precoMin: '',
      precoMax: ''
    });
    setSearchTerm('');
  };

  const handleBookClick = (bookId: string) => {
    const book = livros.find(l => l.id === bookId);
    if (book) {
      setSelectedBook(book);
      setView('details');
    }
  };

  const handleOpenChat = () => {
    if (selectedBook) {
      setView('chat');
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log(`Buscando por: "${term}" usando ${searchStrategy.constructor.name}`);
  };

  const handleSearchTypeChange = (type: 'titulo' | 'autor' | 'curso' | 'tudo') => {
    setSearchType(type);
    console.log(`Mudando estratégia de busca para: ${type}`);
  };

  if (view === 'chat') {
    if (!selectedBook) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-700">Nenhum livro selecionado para o chat.</p>
            <button
              onClick={() => setView('home')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Voltar para lista
            </button>
          </div>
        </div>
      );
    }

    return <Chat onBack={() => setView('details')} book={selectedBook} />;
  }
  
  if (view === 'details') {
    if (!selectedBook) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-700">Nenhum livro selecionado.</p>
            <button
              onClick={() => setView('home')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Voltar
            </button>
          </div>
        </div>
      );
    }

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
          console.log('Livro criado com sucesso, notificando observers...');
          
          if (newBook) {
            const bookSubject = BookObserverManager.getInstance();
            bookSubject.notify(newBook);
          }
          
          setTimeout(() => {
            setView('home');
          }, 100);
        }}
      />
    );
  }

  if (view === 'busca') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleSearch} />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Busca Avançada</h1>
          
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Configurar Busca</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Digite sua busca..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <button
                  onClick={() => handleSearchTypeChange('titulo')}
                  className={`px-4 py-2 rounded-lg ${searchStrategy.constructor.name === 'TitleSearchStrategy' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  Buscar por Título
                </button>
                <button
                  onClick={() => handleSearchTypeChange('autor')}
                  className={`px-4 py-2 rounded-lg ${searchStrategy.constructor.name === 'AuthorSearchStrategy' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  Buscar por Autor
                </button>
                <button
                  onClick={() => handleSearchTypeChange('curso')}
                  className={`px-4 py-2 rounded-lg ${searchStrategy.constructor.name === 'CourseSearchStrategy' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  Buscar por Curso
                </button>
                <button
                  onClick={() => handleSearchTypeChange('tudo')}
                  className={`px-4 py-2 rounded-lg ${searchStrategy.constructor.name === 'AllSearchStrategy' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  Buscar em Tudo
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">
              Resultados da Busca ({searchResults.length} livros)
            </h2>
            <p className="text-gray-600 mb-4">
              Estratégia: <span className="font-semibold">{searchStrategy.constructor.name}</span>
            </p>
            
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((livro) => (
                  <div key={livro.id} className="cursor-pointer" onClick={() => handleBookClick(livro.id)}>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      {livro.livro?.capa && (
                        <img 
                          src={livro.livro.capa} 
                          alt={livro.titulo}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900">{livro.titulo}</h4>
                        <p className="text-sm text-gray-600">{livro.livro?.autor}</p>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-green-600 font-bold">
                            R$ {livro.preco.toFixed(2)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookClick(livro.id);
                            }}
                            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                          >
                            Ver Detalhes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum livro encontrado com os critérios de busca.</p>
                <button
                  onClick={() => setView('home')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Voltar para Home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      <Header onSearch={handleSearch} />
      
      <main>
        <HeroSection 
          onSellBook={() => setView('criar-anuncio')}
          onSearchBook={() => setView('busca')}
          onDonateBook={() => {
            alert('Funcionalidade de doação em desenvolvimento!');
          }}
        />
        
        <section className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Livros em Destaque</h2>
            
            <div className="flex gap-2">
              <button
                onClick={() => fetchLivros()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                title="Atualizar lista"
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
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar livros por título, autor ou curso..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  X
                </button>
              )}
            </div>
          </div>
          
          <BookFilters 
            filters={filters}
            onFilterChange={(newFilters: any) => setFilters(newFilters)}
            onReset={resetFilters}
            cursosDisponiveis={cursosDisponiveis}
          />
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando livros do banco de dados...</p>
              <p className="text-sm text-gray-500 mt-2">
                Usando Repository Pattern no backend para acesso aos dados
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700 font-medium">{error}</p>
              <p className="text-sm text-red-600 mt-2">
                Tentando carregar dados mockados...
              </p>
              <div className="mt-4 space-x-2">
                <button 
                  onClick={() => fetchLivros()}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  Tentar novamente
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Recarregar página
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center text-sm text-gray-600">
                <div>
                  <span className="font-semibold">{livrosFiltrados.length}</span> de{' '}
                  <span className="font-semibold">{livros.length}</span> livros
                  {searchTerm && (
                    <span className="ml-2">
                      • Buscando: "<span className="font-semibold">{searchTerm}</span>"
                    </span>
                  )}
                </div>
                
                {Object.values(filters).some(f => f !== '') && (
                  <button
                    onClick={resetFilters}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Limpar todos os filtros
                  </button>
                )}
              </div>
              
              <FeaturedBooks 
                livros={livrosFiltrados}
                onBookClick={handleBookClick} 
                totalLivros={livros.length}
              />
              
              {livrosFiltrados.length === 0 && livros.length > 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg mt-6">
                  <p className="text-gray-500 mb-2">Nenhum livro encontrado com os filtros aplicados.</p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <CourseCategories />
        <TopUsers />
        <ExchangePoints />
      </main>
      
      <Footer />
      
      <button
        onClick={() => setView('criar-anuncio')}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 hover:shadow-xl transition-all z-50"
        title="Criar novo anúncio"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

function getMockLivros(): Livro[] {
  console.log('Usando dados mockados como fallback');
  
  return [
    {
      id: '1',
      titulo: 'Cálculo Vol. 1',
      descricao: 'Livro de cálculo diferencial e integral',
      preco: 45.50,
      condicao: 'quase_novo',
      tipo: 'venda',
      vendedor: {
        nome: 'Maria Silva',
        avaliacao: 4.8,
        curso: 'Engenharia Civil'
      },
      livro: {
        titulo: 'Cálculo Vol. 1',
        autor: 'James Stewart',
        capa: 'https://m.media-amazon.com/images/I/81C5El+-h2L._AC_UF1000,1000_QL80_.jpg'
      },
      fotos: ['https://m.media-amazon.com/images/I/81C5El+-h2L._AC_UF1000,1000_QL80_.jpg']
    },
    {
      id: '2',
      titulo: 'Física para Universitários',
      descricao: 'Livro completo de física universitária',
      preco: 68.90,
      condicao: 'bom',
      tipo: 'troca',
      vendedor: {
        nome: 'João Santos',
        avaliacao: 4.5,
        curso: 'Física'
      },
      livro: {
        titulo: 'Física para Universitários',
        autor: 'David Halliday',
        capa: 'https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg'
      },
      fotos: ['https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg']
    },
    {
      id: '3',
      titulo: 'Química Geral',
      descricao: 'Livro de química geral para cursos universitários',
      preco: 55.00,
      condicao: 'novo',
      tipo: 'doacao',
      vendedor: {
        nome: 'Ana Oliveira',
        avaliacao: 4.9,
        curso: 'Química'
      },
      livro: {
        titulo: 'Química Geral',
        autor: 'John C. Kotz',
        capa: 'https://m.media-amazon.com/images/I/81C5El+-h2L._AC_UF1000,1000_QL80_.jpg'
      },
      fotos: ['https://m.media-amazon.com/images/I/81C5El+-h2L._AC_UF1000,1000_QL80_.jpg']
    }
  ];
}
