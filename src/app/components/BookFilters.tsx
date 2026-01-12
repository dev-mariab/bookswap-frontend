import { Filter, X } from 'lucide-react';

interface BookFiltersProps {
  filters: {
    curso: string;
    condicao: string;
    tipo: string;
    precoMin: string;
    precoMax: string;
  };
  onFilterChange: (filters: unknown) => void;
  onReset: () => void;
  cursosDisponiveis: string[];
}

export function BookFilters({ filters, onFilterChange, onReset, cursosDisponiveis }: BookFiltersProps) {
  const condicoes = [
    { value: '', label: 'Todas' },
    { value: 'novo', label: 'Novo' },
    { value: 'seminovo', label: 'Seminovo' },
    { value: 'usado', label: 'Usado' },
    { value: 'desgastado', label: 'Desgastado' }
  ];

  const tipos = [
    { value: '', label: 'Todos' },
    { value: 'venda', label: 'Venda' },
    { value: 'troca', label: 'Troca' },
    { value: 'doacao', label: 'Doação' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filtrar Livros</h3>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Limpar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Curso/Disciplina
          </label>
          <select
            value={filters.curso}
            onChange={(e) => onFilterChange({ ...filters, curso: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos os cursos</option>
            {cursosDisponiveis.map((curso) => (
              <option key={curso} value={curso}>{curso}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condição
          </label>
          <select
            value={filters.condicao}
            onChange={(e) => onFilterChange({ ...filters, condicao: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {condicoes.map((cond) => (
              <option key={cond.value} value={cond.value}>{cond.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            value={filters.tipo}
            onChange={(e) => onFilterChange({ ...filters, tipo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {tipos.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Faixa de Preço
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.precoMin}
              onChange={(e) => onFilterChange({ ...filters, precoMin: e.target.value })}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.precoMax}
              onChange={(e) => onFilterChange({ ...filters, precoMax: e.target.value })}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Aplicando {Object.values(filters).filter(f => f !== '').length} filtro(s)
          </span>
          <button
            onClick={() => onFilterChange(filters)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}