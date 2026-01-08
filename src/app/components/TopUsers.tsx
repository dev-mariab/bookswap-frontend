import { Star, Award } from 'lucide-react';

const topUsers = [
  {
    id: 1,
    name: 'Carlos Oliveira',
    course: 'Engenharia Civil',
    rating: 5,
    transactions: 47,
    avatar: 'CO',
  },
  {
    id: 2,
    name: 'Juliana Pereira',
    course: 'Medicina',
    rating: 5,
    transactions: 38,
    avatar: 'JP',
  },
  {
    id: 3,
    name: 'Roberto Lima',
    course: 'Direito',
    rating: 4,
    transactions: 31,
    avatar: 'RL',
  },
];

export function TopUsers() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-6 h-6 text-[#27AE60]" />
          <h2 className="text-2xl md:text-3xl font-bold text-[#2C3E50]">
            Usuários com melhor reputação
          </h2>
        </div>

        <div className="max-w-2xl space-y-4">
          {topUsers.map((user, index) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 flex items-center gap-4 cursor-pointer hover:transform hover:scale-[1.02] transition-all"
            >
              {/* Posição */}
              <div className="flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0
                      ? 'bg-yellow-500'
                      : index === 1
                      ? 'bg-gray-400'
                      : 'bg-orange-600'
                  }`}
                >
                  {index + 1}
                </div>
              </div>

              {/* Avatar */}
              <div className="w-16 h-16 bg-[#2C3E50] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {user.avatar}
              </div>

              {/* Informações do usuário */}
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.course}</p>
                
                {/* Avaliação */}
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < user.rating
                          ? 'text-[#f39c12] fill-[#f39c12]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Número de transações */}
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold text-[#27AE60]">
                  {user.transactions}
                </div>
                <div className="text-xs text-gray-600">transações</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
