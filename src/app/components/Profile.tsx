import { ArrowLeft, CheckCircle, Edit2, Eye, MessageCircle, Star, Settings, Award, Bell, Shield, Lock, CreditCard, HelpCircle, LogOut, Heart } from 'lucide-react';
import { useState } from 'react';

type TabType = 'anuncios' | 'conversas' | 'avaliacoes' | 'configuracoes';
type FilterType = 'ativos' | 'vendidos' | 'favoritos';

const userData = {
  name: 'Maria Santos',
  avatar: 'MS',
  verified: true,
  course: 'Engenharia Civil - 4º ano - USP',
  coverImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  stats: {
    transactions: 28,
    rating: 4.9,
    responseRate: 95,
  },
  about: 'Sou estudante de Engenharia e adoro trocar livros. Sempre cuido bem dos meus materiais!',
  tags: ['Confiável', 'Responde Rápido', 'Boa Negociação'],
};

const myBooks = [
  { id: 1, title: 'Cálculo I - Stewart', price: 'R$ 80,00', status: 'ativo', condition: 'SEMINOVO', views: 45, interested: 8 },
  { id: 2, title: 'Física Básica - Halliday', price: 'R$ 60,00', status: 'ativo', condition: 'USADO', views: 32, interested: 5 },
  { id: 3, title: 'Álgebra Linear', price: 'TROCA', status: 'ativo', condition: 'NOVO', views: 28, interested: 12 },
  { id: 4, title: 'Resistência dos Materiais', price: 'R$ 45,00', status: 'vendido', condition: 'SEMINOVO', views: 67, interested: 15 },
];

const reviews = [
  {
    id: 1,
    reviewer: 'João Silva',
    avatar: 'JS',
    rating: 5,
    date: 'Há 2 dias',
    comment: 'Ótima vendedora, livro em perfeito estado!',
    bookTitle: 'Cálculo I - Stewart',
  },
  {
    id: 2,
    reviewer: 'Ana Costa',
    avatar: 'AC',
    rating: 5,
    date: 'Há 1 semana',
    comment: 'Muito atenciosa e pontual na entrega. Recomendo!',
    bookTitle: 'Física Básica',
  },
  {
    id: 3,
    reviewer: 'Pedro Souza',
    avatar: 'PS',
    rating: 4,
    date: 'Há 2 semanas',
    comment: 'Boa comunicação, livro conforme descrito.',
    bookTitle: 'Álgebra Linear',
  },
];

const achievements = [
  { id: 1, icon: '', title: 'Vendedor do Mês', description: 'Maior número de vendas em Março' },
  { id: 2, icon: '', title: '10 Trocas Concluídas', description: 'Completou 10 trocas com sucesso' },
  { id: 3, icon: '', title: 'Resposta Rápida', description: 'Responde em menos de 1h' },
  { id: 4, icon: '', title: '5 Avaliações 5-estrelas', description: 'Recebeu 5 avaliações perfeitas' },
  { id: 5, icon: '', title: 'Top 3 Reputação', description: 'Entre os 3 melhores do mês' },
  { id: 6, icon: '', title: 'Membro Verificado', description: 'Perfil verificado pela plataforma' },
];

const wishlist = [
  { id: 1, title: 'Cálculo II - Stewart', condition: 'Seminovo ou melhor', available: false },
  { id: 2, title: 'Termodinâmica - Çengel', condition: 'Qualquer estado', available: true },
  { id: 3, title: 'Mecânica dos Fluidos', condition: 'Novo ou seminovo', available: false },
];

const conversations = [
  { id: 1, user: 'João Silva', avatar: 'JS', lastMessage: 'Pode ser amanhã às 15h?', time: '10:30', unread: 2 },
  { id: 2, user: 'Ana Costa', avatar: 'AC', lastMessage: 'Obrigada pela troca!', time: 'Ontem', unread: 0 },
  { id: 3, user: 'Pedro Souza', avatar: 'PS', lastMessage: 'Ainda tem o livro?', time: '2 dias', unread: 1 },
];

export function Profile({ onBack, isOwnProfile = true }: { onBack?: () => void; isOwnProfile?: boolean }) {
  const [activeTab, setActiveTab] = useState<TabType>('anuncios');
  const [filter, setFilter] = useState<FilterType>('ativos');
  const [isFollowing, setIsFollowing] = useState(false);

  const filteredBooks = myBooks.filter(book => {
    if (filter === 'ativos') return book.status === 'ativo';
    if (filter === 'vendidos') return book.status === 'vendido';
    return false;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'anuncios':
        return (
          <div>
            {/* Filtros */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              <button
                onClick={() => setFilter('ativos')}
                className={`pb-2 px-1 font-medium transition-colors ${
                  filter === 'ativos'
                    ? 'text-[#2C3E50] border-b-2 border-[#2C3E50]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ativos ({myBooks.filter(b => b.status === 'ativo').length})
              </button>
              <button
                onClick={() => setFilter('vendidos')}
                className={`pb-2 px-1 font-medium transition-colors ${
                  filter === 'vendidos'
                    ? 'text-[#2C3E50] border-b-2 border-[#2C3E50]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Vendidos ({myBooks.filter(b => b.status === 'vendido').length})
              </button>
              <button
                onClick={() => setFilter('favoritos')}
                className={`pb-2 px-1 font-medium transition-colors ${
                  filter === 'favoritos'
                    ? 'text-[#2C3E50] border-b-2 border-[#2C3E50]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Favoritos
              </button>
            </div>

            {/* Grid de livros */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                  >
                    {/* Imagem do livro */}
                    <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Capa</span>
                      
                      {/* Badge de estado */}
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded font-semibold">
                        {book.condition}
                      </div>
                      
                      {/* Badge de vendido */}
                      {book.status === 'vendido' && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">VENDIDO</span>
                        </div>
                      )}
                    </div>

                    {/* Informações */}
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 h-10">
                        {book.title}
                      </h3>
                      <p className="text-[#27AE60] font-bold mb-2">{book.price}</p>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{book.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{book.interested}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum livro encontrado</h3>
                <p className="text-gray-500">Você ainda não tem livros nesta categoria.</p>
              </div>
            )}
          </div>
        );

      case 'conversas':
        return (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 flex items-center gap-4 cursor-pointer"
              >
                <div className="w-12 h-12 bg-[#2C3E50] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{conv.user}</h3>
                  <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-500 mb-1">{conv.time}</p>
                  {conv.unread > 0 && (
                    <div className="bg-[#27AE60] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center ml-auto">
                      {conv.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 'avaliacoes':
        return (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#2C3E50] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{review.reviewer}</h4>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-[#f39c12] fill-[#f39c12]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                    {review.bookTitle && (
                      <p className="text-xs text-gray-500">Sobre: {review.bookTitle}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'configuracoes':
        return (
          <div className="space-y-6">
            {/* Conta */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Conta</h3>
              </div>
              <div className="divide-y divide-gray-200">
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Edit2 className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Editar perfil</span>
                  </div>
                </button>
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Notificações</span>
                  </div>
                </button>
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Privacidade</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Segurança */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Segurança</h3>
              </div>
              <div className="divide-y divide-gray-200">
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Alterar senha</span>
                  </div>
                </button>
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Sessões ativas</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Pagamentos */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Pagamentos</h3>
              </div>
              <div className="divide-y divide-gray-200">
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Métodos de pagamento</span>
                  </div>
                </button>
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Histórico de transações</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Ajuda */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Ajuda</h3>
              </div>
              <div className="divide-y divide-gray-200">
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Central de ajuda</span>
                  </div>
                </button>
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Termos de uso</span>
                  </div>
                </button>
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-50 transition-colors text-red-600">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5" />
                    <span>Sair da conta</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
      {/* Header com foto de capa */}
      <div className="bg-white shadow-sm">
        {/* Cover image */}
        <div
          className="h-32 md:h-48 relative"
          style={{ background: userData.coverImage }}
        >
          <button
            onClick={onBack}
            className="absolute top-4 left-4 p-2 bg-black/30 hover:bg-black/50 rounded-lg transition-colors backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          {!isOwnProfile && (
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`absolute top-4 right-4 px-4 py-2 rounded-lg font-semibold transition-colors ${
                isFollowing
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-[#27AE60] text-white hover:bg-[#229954]'
              }`}
            >
              {isFollowing ? 'Seguindo' : 'Seguir'}
            </button>
          )}

          {isOwnProfile && (
            <button className="absolute top-4 right-4 px-4 py-2 bg-white/90 hover:bg-white rounded-lg font-semibold transition-colors backdrop-blur-sm flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              Editar Perfil
            </button>
          )}
        </div>

        {/* Profile info */}
        <div className="container mx-auto px-4 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-[#2C3E50] rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                {userData.avatar}
              </div>
              {isOwnProfile && (
                <button className="absolute bottom-2 right-2 bg-[#27AE60] text-white p-2 rounded-full hover:bg-[#229954] transition-colors shadow-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Name and info */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{userData.name}</h1>
              {userData.verified && (
                <CheckCircle className="w-6 h-6 text-[#27AE60]" />
              )}
            </div>
            {userData.verified && (
              <span className="inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full mb-2">
                ✓ Membro Verificado
              </span>
            )}
            <p className="text-gray-600">{userData.course}</p>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-4 mb-6 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-[#2C3E50] mb-1">
                {userData.stats.transactions}
              </div>
              <div className="text-sm text-gray-600">Transações</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-[#2C3E50] mb-1">
                {userData.stats.rating}
              </div>
              <div className="flex justify-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 text-[#f39c12] fill-[#f39c12]"
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">Avaliação</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-[#2C3E50] mb-1">
                {userData.stats.responseRate}%
              </div>
              <div className="text-sm text-gray-600">Taxa de resposta</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 md:gap-4 border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('anuncios')}
              className={`pb-3 px-2 md:px-4 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'anuncios'
                  ? 'text-[#2C3E50] border-b-2 border-[#2C3E50]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Meus Anúncios
            </button>
            <button
              onClick={() => setActiveTab('conversas')}
              className={`pb-3 px-2 md:px-4 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'conversas'
                  ? 'text-[#2C3E50] border-b-2 border-[#2C3E50]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Conversas
            </button>
            <button
              onClick={() => setActiveTab('avaliacoes')}
              className={`pb-3 px-2 md:px-4 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'avaliacoes'
                  ? 'text-[#2C3E50] border-b-2 border-[#2C3E50]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Avaliações
            </button>
            <button
              onClick={() => setActiveTab('configuracoes')}
              className={`pb-3 px-2 md:px-4 font-medium whitespace-nowrap transition-colors ${
                activeTab === 'configuracoes'
                  ? 'text-[#2C3E50] border-b-2 border-[#2C3E50]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ⚙️ Configurações
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            {renderTabContent()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sobre mim */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#2C3E50]" />
                Sobre mim
              </h3>
              <p className="text-gray-700 text-sm mb-4">{userData.about}</p>
              <div className="flex flex-wrap gap-2">
                {userData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Conquistas */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#2C3E50]" />
                Conquistas
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex flex-col items-center text-center p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                    title={achievement.description}
                  >
                    <div className="text-3xl mb-1">{achievement.icon}</div>
                    <p className="text-xs text-gray-600 line-clamp-2 group-hover:text-gray-900">
                      {achievement.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Livros desejados */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#2C3E50]" />
                Livros Desejados
              </h3>
              <div className="space-y-3">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-sm text-gray-900 flex-1">
                        {item.title}
                      </h4>
                      {item.available && (
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded flex-shrink-0">
                          Disponível
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{item.condition}</p>
                    <button className="w-full bg-[#2C3E50] hover:bg-[#34495e] text-white text-xs py-2 rounded transition-colors">
                      <Bell className="w-3 h-3 inline mr-1" />
                      Notificar quando aparecer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
