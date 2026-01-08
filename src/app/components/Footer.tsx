import { Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#2C3E50] text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6 text-sm md:text-base">
          <a href="#" className="hover:text-[#27AE60] transition-colors">
            Sobre
          </a>
          <span className="text-gray-400">•</span>
          <a href="#" className="hover:text-[#27AE60] transition-colors">
            Ajuda
          </a>
          <span className="text-gray-400">•</span>
          <a href="#" className="hover:text-[#27AE60] transition-colors">
            Termos
          </a>
          <span className="text-gray-400">•</span>
          <a href="#" className="hover:text-[#27AE60] transition-colors">
            Contato
          </a>
        </div>

        {/* Redes sociais */}
        <div className="flex justify-center gap-4 mb-6">
          <a
            href="#"
            className="bg-white/10 hover:bg-[#27AE60] p-3 rounded-full transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="bg-white/10 hover:bg-[#27AE60] p-3 rounded-full transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-300 text-sm">
          BookSwap Academy © 2024
        </div>
      </div>
    </footer>
  );
}
