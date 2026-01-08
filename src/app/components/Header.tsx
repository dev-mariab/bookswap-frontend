import { Bell, User, Search, BookOpen } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-[#2C3E50] text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <BookOpen className="w-8 h-8" />
            <span className="text-xl font-bold hidden sm:block">BookSwap</span>
          </div>

          {/* Barra de busca */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar livro, autor ou disciplina..."
                className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#27AE60]"
              />
            </div>
          </div>

          {/* Ícones à direita */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button className="relative hover:bg-white/10 p-2 rounded-lg transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#27AE60] rounded-full"></span>
            </button>
            <button className="hover:bg-white/10 p-2 rounded-lg transition-colors">
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
