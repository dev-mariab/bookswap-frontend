import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturedBooks } from './components/FeaturedBooks';
import { CourseCategories } from './components/CourseCategories';
import { TopUsers } from './components/TopUsers';
import { ExchangePoints } from './components/ExchangePoints';
import { Footer } from './components/Footer';
import { BookDetails } from './components/BookDetails';
import { Chat } from './components/Chat';
import { useState, useEffect } from 'react';
import { Livro } from './types';
import { CreateListing } from './components/CreateListing';

export default function App() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [selectedBook, setSelectedBook] = useState<Livro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'home' | 'details' | 'chat' | 'criar-anuncio'>('home');

  useEffect(() => {
  fetch('http://localhost:3001/api/livros')  
    .then(response => {
      if (!response.ok) throw new Error('Erro ao conectar com o servidor');
      return response.json();
    })
    .then(data => {
      console.log('Dados recebidos de /api/livros:', data);
      
      if (data.data) {
        interface ApiLivro {
          id: string;
          titulo: string;
          autor?: string;
          preco?: number;
          condicao?: string;
          vendedor?: string;
          avaliacao?: number;
          imagem?: string;
        }

        const livrosTransformados = data.data.map((livro: ApiLivro) => ({
          id: livro.id,
          titulo: livro.titulo,
          descricao: `Livro "${livro.titulo}" por ${livro.autor}`,
          preco: livro.preco ?? 0,
          condicao: livro.condicao ?? '',
          tipo: 'livro_didatico',
          vendedor: {
            nome: livro.vendedor ?? 'Desconhecido',
            avaliacao: livro.avaliacao ?? 0,
            curso: 'Engenharia'
          },
          livro: {
            titulo: livro.titulo,
            autor: livro.autor,
            capa: livro.imagem
          },
          fotos: livro.imagem ? [livro.imagem] : []
        }));
        setLivros(livrosTransformados as unknown as Livro[]);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error('Erro:', err);
      setError('Não foi possível carregar os livros. Verifique se o backend está rodando.');
      setLoading(false);
    });
}, []);

  const handleBookClick = (bookId: string) => {
    const book = livros.find(l => l.id === bookId) || livros[0];
    setSelectedBook(book);
    setView('details');
  };

  const handleOpenChat = () => {
    setView('chat');
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
  return <CreateListing 
    onBack={() => setView('home')}
    onSuccess={() => {
      alert('Anúncio criado com sucesso!');
      setView('home');
      window.location.reload(); 
    }}
  />;
}

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      <Header />
      <main>
        <HeroSection 
  onSellBook={() => setView('criar-anuncio')}
  onSearchBook={() => {
    alert('Funcionalidade de busca em desenvolvimento!');
  }}
  onDonateBook={() => {
    alert('Funcionalidade de doação em desenvolvimento!');
  }}
/>
        
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">📚 Livros em Destaque</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando livros do banco de dados...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700 font-medium">{error}</p>
              <p className="text-sm text-red-600 mt-2">
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <FeaturedBooks 
              livros={livros} 
              onBookClick={handleBookClick} 
            />
          )}
        </section>

        <CourseCategories />
        <TopUsers />
        <ExchangePoints />
      </main>
      <Footer />
    </div>
  );
}