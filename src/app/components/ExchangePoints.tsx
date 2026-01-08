import { MapPin, Clock, Navigation } from 'lucide-react';

const exchangePoints = [
  {
    id: 1,
    name: 'Biblioteca Central',
    hours: 'Seg-Sex: 8h-22h | Sáb: 8h-14h',
    distance: '200m',
  },
  {
    id: 2,
    name: 'Centro Acadêmico',
    hours: 'Seg-Sex: 9h-18h',
    distance: '350m',
  },
  {
    id: 3,
    name: 'Cantina Universitária',
    hours: 'Seg-Sex: 7h-20h',
    distance: '500m',
  },
];

export function ExchangePoints() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-6 h-6 text-[#27AE60]" />
          <h2 className="text-2xl md:text-3xl font-bold text-[#2C3E50]">
            Pontos de Troca no Campus
          </h2>
        </div>

        <div className="max-w-2xl space-y-4">
          {exchangePoints.map((point) => (
            <div
              key={point.id}
              className="bg-white border-2 border-gray-200 rounded-lg hover:border-[#27AE60] transition-colors p-4 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {point.name}
                  </h3>
                  
                  <div className="flex items-start gap-2 text-gray-600 mb-2">
                    <Clock className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span className="text-sm">{point.hours}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[#27AE60]">
                    <Navigation className="w-4 h-4" />
                    <span className="text-sm font-semibold">{point.distance}</span>
                  </div>
                </div>

                <button className="bg-[#27AE60] hover:bg-[#229954] text-white px-4 py-2 rounded-lg transition-colors flex-shrink-0">
                  Ver no mapa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
