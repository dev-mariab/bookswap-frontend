import { BookOpen, Search, Gift } from 'lucide-react';
interface HeroSectionProps {
  onSellBook?: () => void;
  onSearchBook?: () => void;
  onDonateBook?: () => void;
}

export function HeroSection({ onSellBook, onSearchBook, onDonateBook }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-b from-[#2C3E50] to-[#34495e] text-white py-12 md:py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Troque livros didáticos com colegas da faculdade
        </h1>
        <p className="text-lg md:text-2xl mb-8 text-gray-200">
          Economize até 70% nos livros do seu curso
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-3xl mx-auto">
          <button 
            onClick={onSellBook}
            className="bg-[#27AE60] hover:bg-[#229954] text-white px-8 py-4 rounded-lg flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto"
          >
            <BookOpen className="w-6 h-6" />
            <span className="font-semibold">Vender Livro</span>
          </button>
          
          <button 
            onClick={onSearchBook}
            className="bg-[#3498db] hover:bg-[#2980b9] text-white px-8 py-4 rounded-lg flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto"
          >
            <Search className="w-6 h-6" />
            <span className="font-semibold">Buscar Livro</span>
          </button>
          
          <button 
            onClick={onDonateBook}
            className="bg-[#e67e22] hover:bg-[#d35400] text-white px-8 py-4 rounded-lg flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto"
          >
            <Gift className="w-6 h-6" />
            <span className="font-semibold">Doar Livro</span>
          </button>
        </div>
      </div>
    </section>
  );
}