import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturedBooks } from './components/FeaturedBooks';
import { CourseCategories } from './components/CourseCategories';
import { TopUsers } from './components/TopUsers';
import { ExchangePoints } from './components/ExchangePoints';
import { Footer } from './components/Footer';
import { BookDetails } from './components/BookDetails';
import { Chat } from './components/Chat';
import { useState } from 'react';

export default function App() {
  const [view, setView] = useState<'home' | 'details' | 'chat'>('home');

  // Você pode alternar entre as views para testar
  // Para ver a página de detalhes, mude para 'details'
  // Para ver o chat, mude para 'chat'
  
  if (view === 'chat') {
    return <Chat onBack={() => setView('details')} />;
  }
  
  if (view === 'details') {
    return <BookDetails onBack={() => setView('home')} onOpenChat={() => setView('chat')} />;
  }

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      <Header />
      <main>
        <HeroSection />
        <FeaturedBooks onBookClick={() => setView('details')} />
        <CourseCategories />
        <TopUsers />
        <ExchangePoints />
      </main>
      <Footer />
    </div>
  );
}