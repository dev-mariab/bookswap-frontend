import { X, Camera, Search, Upload, Trash2, CheckCircle, AlertCircle, MapPin, Clock } from 'lucide-react';
import { useState, useRef, ChangeEvent } from 'react';
import { BookObserverManager } from '../observers/BookObserver';

interface BookInfo {
  title: string;
  author: string;
  edition: string;
  isbn: string;
  course: string;
  coverUrl: string;
}

interface ListingData {
  bookInfo: BookInfo;
  condition: 'novo' | 'seminovo' | 'usado' | 'desgastado' | '';
  photos: string[];
  description: string;
  listingType: 'venda' | 'troca' | 'doacao' | '';
  price: string;
  negotiable: boolean;
  tradeFor: string;
  tradeConditions: string;
  acceptOtherProposals: boolean;
  firstComeFirstServed: boolean;
  locations: string[];
  availableHours: string;
}

const initialData: ListingData = {
  bookInfo: {
    title: '',
    author: '',
    edition: '',
    isbn: '',
    course: '',
    coverUrl: '',
  },
  condition: '',
  photos: [],
  description: '',
  listingType: '',
  price: '',
  negotiable: false,
  tradeFor: '',
  tradeConditions: '',
  acceptOtherProposals: false,
  firstComeFirstServed: false,
  locations: [],
  availableHours: '',
};

const courses = [
  'Administração',
  'Arquitetura',
  'Ciências Contábeis',
  'Direito',
  'Economia',
  'Engenharia Civil',
  'Engenharia da Computação',
  'Medicina',
  'Psicologia',
];

const availableLocations = [
  'Campus Central - Biblioteca',
  'Campus Norte - Cantina',
  'Campus Leste - Portaria 3',
  'Entrega combinada via chat',
];

const conditionOptions: { id: ListingData['condition']; label: string; color: string; description: string; icon: string }[] = [
  {
    id: 'novo',
    label: 'Novo',
    color: 'bg-green-100 border-green-500 text-green-700',
    description: 'Nunca usado',
    icon: '📗',
  },
  {
    id: 'seminovo',
    label: 'Seminovo',
    color: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    description: 'Pouco uso, sem marcas',
    icon: '📘',
  },
  {
    id: 'usado',
    label: 'Usado',
    color: 'bg-orange-100 border-orange-500 text-orange-700',
    description: 'Marcas normais de uso',
    icon: '📙',
  },
  {
    id: 'desgastado',
    label: 'Desgastado',
    color: 'bg-red-100 border-red-500 text-red-700',
    description: 'Muito uso, mas legível',
    icon: '📕',
  },
];

export function CreateListing({ onBack, onSuccess }: { onBack?: () => void; onSuccess?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<ListingData>(initialData);
  const [isSearchingISBN, setIsSearchingISBN] = useState(false);
  const [useManualSearch, setUseManualSearch] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 4;

  const handleISBNSearch = async () => {
    if (!data.bookInfo.isbn) {
      setErrors({ isbn: 'Digite um ISBN para buscar' });
      return;
    }
    
    setIsSearchingISBN(true);
    setErrors({});
    
    setTimeout(() => {
      setData({
        ...data,
        bookInfo: {
          ...data.bookInfo,
          title: 'Cálculo - Volume 1',
          author: 'James Stewart',
          edition: '8ª Edição',
          course: 'Engenharia Civil',
          coverUrl: '',
        },
      });
      setIsSearchingISBN(false);
      setCurrentStep(2);
    }, 1500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setData({
        ...data,
        photos: [...data.photos, ...newPhotos].slice(0, 6),
      });
    }
  };

  const removePhoto = (index: number) => {
    setData({
      ...data,
      photos: data.photos.filter((_, i) => i !== index),
    });
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!data.bookInfo.title) newErrors.title = 'Título é obrigatório';
      if (!data.bookInfo.author) newErrors.author = 'Autor é obrigatório';
      if (!data.bookInfo.course) newErrors.course = 'Curso é obrigatório';
    }

    if (currentStep === 2) {
      if (!data.condition) newErrors.condition = 'Selecione o estado do livro';
      if (data.photos.length === 0) newErrors.photos = 'Adicione pelo menos 1 foto';
    }

    if (currentStep === 3) {
      if (!data.listingType) newErrors.listingType = 'Selecione o tipo de anúncio';
      if (data.listingType === 'venda' && !data.price) newErrors.price = 'Defina um preço';
      if (data.listingType === 'troca' && !data.tradeFor) newErrors.tradeFor = 'Defina o que aceita em troca';
    }

    if (currentStep === 4) {
      if (data.locations.length === 0) newErrors.locations = 'Selecione pelo menos 1 local';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handlePublish();
      }
    }
  };

  const handlePublish = async () => {
  if (!validateStep()) return;
  
  setIsPublishing(true);
  
  try {
    const livroData = {
      titulo: data.bookInfo.title,
      autor: data.bookInfo.author,
      preco: data.listingType === 'venda' ? parseFloat(data.price) : 0,
      condicao: data.condition,
      descricao: data.description,
      curso: data.bookInfo.course,
      tipo: data.listingType,
      imagem: data.photos.length > 0 ? data.photos[0] : 'https://via.placeholder.com/150',
      vendedor: 'Usuário Atual', 
      avaliacao: 5.0, 
      localizacao: data.locations.length > 0 ? data.locations[0] : 'Campus Central'
    };
    
    console.log('Enviando dados:', livroData);

    const response = await fetch('http://localhost:3001/api/livros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(livroData),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Resposta do backend:', result);
      
      const bookSubject = BookObserverManager.getInstance();
      bookSubject.notify(result.data || livroData);
      
      setShowSuccess(true);
      
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
      
    } else {
      const errorData = await response.json();
      console.error('Erro do backend:', errorData);
      alert(`Erro ao publicar: ${errorData.error || 'Falha no servidor'}`);
    }
    
  } catch (error) {
    console.error('Erro de conexão:', error);
    alert('Erro de conexão com o servidor. Verifique se o backend está rodando.');
  } finally {
    setIsPublishing(false);
  }
};

  const handleLocationToggle = (location: string) => {
    if (data.locations.includes(location)) {
      setData({
        ...data,
        locations: data.locations.filter(l => l !== location),
      });
    } else {
      setData({
        ...data,
        locations: [...data.locations, location],
      });
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Anúncio Publicado!</h2>
          <p className="text-gray-600 mb-6">Seu livro já está disponível para outros estudantes.</p>
          <button
            onClick={onSuccess}
            className="w-full bg-[#27AE60] text-white py-3 rounded-lg font-semibold hover:bg-[#229954] transition-colors"
          >
            Ver meu anúncio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>
            <h1 className="text-xl font-bold text-gray-900">Vender Livro</h1>
            <div className="w-20"></div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#27AE60] transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
              Passo {currentStep} de {totalSteps}
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações do Livro</h2>
            
            {!useManualSearch ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Digite o ISBN ou código de barras
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={data.bookInfo.isbn}
                      onChange={(e) => setData({
                        ...data,
                        bookInfo: { ...data.bookInfo, isbn: e.target.value }
                      })}
                      placeholder="978-8522106592"
                      className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50] ${
                        errors.isbn ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      onClick={handleISBNSearch}
                      disabled={isSearchingISBN}
                      className="px-6 py-3 bg-[#2C3E50] text-white rounded-lg hover:bg-[#34495e] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                    >
                      {isSearchingISBN ? 'Buscando...' : 'Buscar'}
                    </button>
                  </div>
                  {errors.isbn && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.isbn}
                    </p>
                  )}
                </div>

                <button className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-semibold">
                  <Camera className="w-5 h-5" />
                  Usar Câmera para Escanear
                </button>

                <div className="text-center">
                  <button
                    onClick={() => setUseManualSearch(true)}
                    className="text-[#2C3E50] hover:underline font-medium"
                  >
                    Ou buscar manualmente
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Livro <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.bookInfo.title}
                    onChange={(e) => setData({
                      ...data,
                      bookInfo: { ...data.bookInfo, title: e.target.value }
                    })}
                    placeholder="Ex: Cálculo - Volume 1"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50] ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Autor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.bookInfo.author}
                    onChange={(e) => setData({
                      ...data,
                      bookInfo: { ...data.bookInfo, author: e.target.value }
                    })}
                    placeholder="Ex: James Stewart"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50] ${
                      errors.author ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.author && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.author}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edição
                  </label>
                  <input
                    type="text"
                    value={data.bookInfo.edition}
                    onChange={(e) => setData({
                      ...data,
                      bookInfo: { ...data.bookInfo, edition: e.target.value }
                    })}
                    placeholder="Ex: 8ª Edição"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISBN (opcional)
                  </label>
                  <input
                    type="text"
                    value={data.bookInfo.isbn}
                    onChange={(e) => setData({
                      ...data,
                      bookInfo: { ...data.bookInfo, isbn: e.target.value }
                    })}
                    placeholder="978-8522106592"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disciplina/Curso <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={data.bookInfo.course}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setData({
                      ...data,
                      bookInfo: { ...data.bookInfo, course: e.target.value }
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50] ${
                      errors.course ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione um curso</option>
                    {courses.map((course) => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                  {errors.course && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.course}
                    </p>
                  )}
                </div>

                <button className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-semibold">
                  <Search className="w-5 h-5" />
                  Buscar capa automaticamente
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Qual o estado do seu livro?</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {conditionOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setData({ ...data, condition: option.id })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    data.condition === option.id
                      ? option.color + ' border-2'
                      : 'bg-white border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-4xl mb-2">{option.icon}</div>
                  <div className="font-semibold mb-1">{option.label}</div>
                  <div className="text-xs opacity-80">{option.description}</div>
                </button>
              ))}
            </div>
            {errors.condition && (
              <p className="text-red-500 text-sm mb-4 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.condition}
              </p>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fotos do livro <span className="text-red-500">*</span>
              </label>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />

              {data.photos.length < 6 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#2C3E50] transition-colors flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <Upload className="w-8 h-8" />
                  <span className="font-medium">Arraste fotos aqui</span>
                  <span className="text-sm">ou clique para selecionar</span>
                </button>
              )}

              {errors.photos && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.photos}
                </p>
              )}

              {data.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {data.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {data.photos.length < 6 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-[#2C3E50] transition-colors flex items-center justify-center"
                    >
                      <Upload className="w-8 h-8 text-gray-400" />
                    </button>
                  )}
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                Mostre capa, contracapa e páginas internas (máximo 6 fotos)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adicione detalhes importantes
              </label>
              <textarea
                value={data.description}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setData({ ...data, description: e.target.value });
                  }
                }}
                placeholder="Ex: Marcações a lápis nas páginas 30-45, capa com pequeno desgaste..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50] resize-none"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {data.description.length}/500
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tipo de Anúncio</h2>
            
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => setData({ ...data, listingType: 'venda' })}
                className={`pb-3 px-4 font-medium transition-colors ${
                  data.listingType === 'venda'
                    ? 'text-[#2C3E50] border-b-2 border-[#2C3E50]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Venda
              </button>
              <button
                onClick={() => setData({ ...data, listingType: 'troca' })}
                className={`pb-3 px-4 font-medium transition-colors ${
                  data.listingType === 'troca'
                    ? 'text-[#2C3E50] border-b-2 border-[#2C3E50]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Troca
              </button>
              <button
                onClick={() => setData({ ...data, listingType: 'doacao' })}
                className={`pb-3 px-4 font-medium transition-colors ${
                  data.listingType === 'doacao'
                    ? 'text-[#2C3E50] border-b-2 border-[#2C3E50]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🎁 Doação
              </button>
            </div>

            {errors.listingType && (
              <p className="text-red-500 text-sm mb-4 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.listingType}
              </p>
            )}

            {data.listingType === 'venda' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                    <input
                      type="number"
                      value={data.price}
                      onChange={(e) => setData({ ...data, price: e.target.value })}
                      placeholder="0,00"
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50] ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.price}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">💡 Preço médio para este livro: R$ 50-70</p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.negotiable}
                    onChange={(e) => setData({ ...data, negotiable: e.target.checked })}
                    className="w-5 h-5 text-[#2C3E50] rounded focus:ring-2 focus:ring-[#2C3E50]"
                  />
                  <span className="text-gray-700">Preço negociável</span>
                </label>
              </div>
            )}

            {data.listingType === 'troca' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trocar por: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.tradeFor}
                    onChange={(e) => setData({ ...data, tradeFor: e.target.value })}
                    placeholder="Ex: Física Volume 2, Álgebra Linear"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50] ${
                      errors.tradeFor ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.tradeFor && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.tradeFor}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condições
                  </label>
                  <input
                    type="text"
                    value={data.tradeConditions}
                    onChange={(e) => setData({ ...data, tradeConditions: e.target.value })}
                    placeholder="Ex: Qualquer edição, Seminovo ou melhor"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.acceptOtherProposals}
                    onChange={(e) => setData({ ...data, acceptOtherProposals: e.target.checked })}
                    className="w-5 h-5 text-[#2C3E50] rounded focus:ring-2 focus:ring-[#2C3E50]"
                  />
                  <span className="text-gray-700">Aceito propostas diferentes</span>
                </label>
              </div>
            )}

            {data.listingType === 'doacao' && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium mb-2">🎁 Doe para outro estudante</p>
                  <p className="text-sm text-green-700">
                    Sua doação ajudará outro estudante a ter acesso ao material de estudo.
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.firstComeFirstServed}
                    onChange={(e) => setData({ ...data, firstComeFirstServed: e.target.checked })}
                    className="w-5 h-5 text-[#2C3E50] rounded focus:ring-2 focus:ring-[#2C3E50]"
                  />
                  <span className="text-gray-700">Primeiro a retirar leva</span>
                </label>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Onde você pode entregar?</h2>
            
            <div className="space-y-4 mb-6">
              {availableLocations.map((location) => (
                <label
                  key={location}
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#2C3E50] cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={data.locations.includes(location)}
                    onChange={() => handleLocationToggle(location)}
                    className="w-5 h-5 text-[#2C3E50] rounded focus:ring-2 focus:ring-[#2C3E50]"
                  />
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700">{location}</span>
                </label>
              ))}
            </div>

            {errors.locations && (
              <p className="text-red-500 text-sm mb-4 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.locations}
              </p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horários disponíveis
              </label>
              <input
                type="text"
                value={data.availableHours}
                onChange={(e) => setData({ ...data, availableHours: e.target.value })}
                placeholder="Ex: Seg a Sex, 14h às 18h"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
              />
              <div className="flex items-start gap-2 mt-2 text-sm text-gray-500">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Informe seus horários para facilitar o encontro</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Preview do Anúncio</h3>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {data.photos[0] && (
                  <img src={data.photos[0]} alt="Preview" className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 mb-2">{data.bookInfo.title || 'Título do livro'}</h4>
                  <p className="text-sm text-gray-600 mb-2">{data.bookInfo.author || 'Autor'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#27AE60] font-bold">
                      {data.listingType === 'venda' && `R$ ${data.price || '0,00'}`}
                      {data.listingType === 'troca' && 'TROCA'}
                      {data.listingType === 'doacao' && 'DOAÇÃO'}
                    </span>
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-semibold uppercase">
                      {data.condition || 'Condição'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Voltar
            </button>
          )}
          
          <button
            className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-semibold"
          >
            Salvar como rascunho
          </button>

          <button
            onClick={handleNext}
            disabled={isPublishing}
            className="flex-1 px-6 py-3 bg-[#27AE60] text-white rounded-lg hover:bg-[#229954] transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              'Publicando...'
            ) : currentStep === totalSteps ? (
              'Publicar Anúncio'
            ) : (
              'Próximo'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
