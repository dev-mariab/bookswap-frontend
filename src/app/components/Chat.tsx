import { ArrowLeft, MoreVertical, Send, Paperclip, Smile, Shield, Check, CheckCheck, AlertCircle, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  sender: 'user' | 'other' | 'system';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read' | 'error';
  type?: 'text' | 'offer' | 'meeting' | 'accepted' | 'safety';
  offerAmount?: number;
  meetingDetails?: {
    date: string;
    time: string;
    location: string;
  };
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: 'other',
    text: 'Olá! Tenho interesse no livro de Cálculo',
    timestamp: 'Ontem, 14:30',
    status: 'read',
  },
  {
    id: 2,
    sender: 'user',
    text: 'Olá Ana! Sim, ainda está disponível',
    timestamp: 'Ontem, 14:32',
    status: 'read',
  },
  {
    id: 3,
    sender: 'other',
    text: 'Poderia fazer por R$ 40?',
    timestamp: 'Hoje, 10:15',
    status: 'read',
  },
  {
    id: 4,
    sender: 'system',
    text: 'Ana fez uma oferta de R$ 40,00',
    timestamp: 'Hoje, 10:15',
    type: 'offer',
    offerAmount: 40,
  },
  {
    id: 5,
    sender: 'user',
    text: 'Aceito R$ 45, é o mínimo',
    timestamp: 'Hoje, 10:20',
    status: 'read',
  },
  {
    id: 6,
    sender: 'other',
    text: 'Combinado!',
    timestamp: 'Hoje, 10:22',
    status: 'read',
  },
  {
    id: 7,
    sender: 'system',
    text: 'Vocês combinaram R$ 45,00',
    timestamp: 'Hoje, 10:22',
    type: 'accepted',
  },
  {
    id: 8,
    sender: 'system',
    text: 'Encontre-se em locais públicos do campus',
    timestamp: 'Hoje, 10:22',
    type: 'safety',
  },
];

export function Chat({ onBack }: { onBack?: () => void }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMeetingProposal, setShowMeetingProposal] = useState(true);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (inputText.trim() || attachedImage) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'user',
        text: inputText,
        timestamp: 'Agora',
        status: 'sent',
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      setAttachedImage(null);

      // Simular status de entrega
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
        ));
      }, 1000);

      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'read' as const } : msg
        ));
      }, 2000);

      // Simular indicador de digitação
      setTimeout(() => {
        setIsTyping(true);
      }, 3000);

      setTimeout(() => {
        setIsTyping(false);
      }, 5000);
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMakeOffer = () => {
    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: 'Gostaria de fazer uma oferta de R$ 42,00',
      timestamp: 'Agora',
      status: 'sent',
    };
    setMessages([...messages, newMessage]);
  };

  const handleSuggestMeeting = () => {
    setShowMeetingProposal(true);
  };

  const renderStatusIcon = (status?: 'sent' | 'delivered' | 'read' | 'error') => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-[#27AE60]" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-['Inter',sans-serif]">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="w-10 h-10 bg-[#2C3E50] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            AS
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 truncate">Ana Silva</h2>
            <p className="text-xs text-gray-600 truncate">⭐ 4.9 • 15 transações • Online há 2min</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-700" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-48 z-50">
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700">
                Ver perfil
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50 text-yellow-600">
                Denunciar
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600">
                Bloquear
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Contexto da conversa */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
          <div className="w-16 h-20 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
            <span className="text-xs text-gray-400">Capa</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600 mb-1">Negociando:</p>
            <h3 className="font-bold text-gray-900 truncate">Cálculo Vol. 1</h3>
            <p className="text-sm text-[#27AE60] font-semibold">Preço: R$ 45,00</p>
            <p className="text-xs text-gray-600">Estado: Seminovo</p>
          </div>
          <button className="px-3 py-1.5 bg-[#2C3E50] text-white text-xs rounded-lg hover:bg-[#34495e] transition-colors flex-shrink-0">
            Ver anúncio
          </button>
        </div>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => {
          if (message.type === 'offer') {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-sm text-center">
                  <p className="text-sm text-gray-700 mb-2">💰 {message.text}</p>
                  <div className="flex gap-2 justify-center">
                    <button className="px-3 py-1 bg-[#27AE60] text-white text-xs rounded hover:bg-[#229954] transition-colors">
                      Aceitar
                    </button>
                    <button className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors">
                      Recusar
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{message.timestamp}</p>
                </div>
              </div>
            );
          }

          if (message.type === 'accepted') {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-w-sm text-center">
                  <p className="text-sm font-semibold text-green-700 mb-2">✅ {message.text}</p>
                  <button className="px-4 py-2 bg-[#27AE60] text-white text-sm rounded-lg hover:bg-[#229954] transition-colors">
                    📅 Combinar encontro
                  </button>
                  <p className="text-xs text-gray-500 mt-2">{message.timestamp}</p>
                </div>
              </div>
            );
          }

          if (message.type === 'safety') {
            return (
              <div key={message.id} className="flex justify-center">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-sm flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-900 font-medium">Lembrete de segurança</p>
                    <p className="text-xs text-blue-700">{message.text}</p>
                  </div>
                </div>
              </div>
            );
          }

          if (message.sender === 'user') {
            return (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[70%]">
                  <div className="bg-[#2C3E50] text-white rounded-lg rounded-tr-sm px-4 py-2">
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                    {renderStatusIcon(message.status)}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={message.id} className="flex justify-start">
              <div className="max-w-[70%]">
                <div className="bg-gray-200 text-gray-900 rounded-lg rounded-tl-sm px-4 py-2">
                  <p className="text-sm">{message.text}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">{message.timestamp}</span>
              </div>
            </div>
          );
        })}

        {/* Proposta de encontro */}
        {showMeetingProposal && (
          <div className="flex justify-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-sm relative">
              <button
                onClick={() => setShowMeetingProposal(false)}
                className="absolute top-2 right-2 p-1 hover:bg-yellow-100 rounded"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
              <p className="text-sm font-semibold text-gray-900 mb-2">Sugerir encontro</p>
              <p className="text-sm text-gray-700 mb-3">⏰ Amanhã, 15h na Biblioteca Central?</p>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-[#27AE60] text-white text-sm rounded-lg hover:bg-[#229954] transition-colors">
                  ✅ Aceitar
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors">
                  🔄 Sugerir outro
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Indicador de digitação */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preview de imagem anexada */}
      {attachedImage && (
        <div className="px-4 py-2 bg-white border-t border-gray-200">
          <div className="relative inline-block">
            <img src={attachedImage} alt="Preview" className="w-20 h-20 object-cover rounded" />
            <button
              onClick={() => setAttachedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Barra de ações rápidas */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={handleMakeOffer}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors whitespace-nowrap flex items-center gap-1"
          >
            💰 Fazer oferta
          </button>
          <button
            onClick={handleSuggestMeeting}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors whitespace-nowrap flex items-center gap-1"
          >
            📅 Sugerir encontro
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors whitespace-nowrap flex items-center gap-1">
            ⭐ Avaliar usuário
          </button>
        </div>
      </div>

      {/* Input área */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-end gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <button
            onClick={handleFileAttach}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
            <Smile className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua mensagem..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!inputText.trim() && !attachedImage}
            className="p-2 bg-[#2C3E50] text-white rounded-lg hover:bg-[#34495e] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
