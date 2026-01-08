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

interface Livro {
  id: string;
  titulo: string;
  descricao: string;
  preco: number;
  condicao: string;
  tipo: string;
  vendedor: {
    nome: string;
    avaliacao: number;
    curso: string;
  };
  livro: {
    titulo: string;
    autor: string;
    capa: string;
  };
  fotos: string[];
}

export default function App() {
  const [view, setView] = useState<'home' | 'details' | 'chat'>('home');
  const [livros, setLivros] = useState<Livro[]>([]);
  const [selectedBook, setSelectedBook] = useState<Livro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/anuncios')
      .then(response => {
        if (!response.ok) throw new Error('Erro ao conectar com o servidor');
        return response.json();
      })
      .then(data => {
        console.log('Dados recebidos:', data);
        if (data.data) {
          setLivros(data.data);
        } else if (Array.isArray(data)) {
          setLivros(data);
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
    return <Chat onBack={() => setView('details')} book={selectedBook} />;
  }
  
  if (view === 'details') {
    return (
      <BookDetails 
        book={selectedBook} 
        onBack={() => setView('home')} 
        onOpenChat={handleOpenChat} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      <Header />
      <main>
        <HeroSection />
        
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