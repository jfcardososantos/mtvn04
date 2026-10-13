import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Trash2, 
  Filter, 
  Utensils, 
  Bus, 
  Gamepad, 
  Wallet, 
  Calendar,
  Sparkles,
  ArrowDownCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Expense, ExpenseCategory } from '../types';

interface ExpensesTabProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onClearAllExpenses: () => void;
  onOpenAddExpense: (preselectedCategory?: ExpenseCategory) => void;
}

export default function ExpensesTab({
  expenses,
  onDeleteExpense,
  onClearAllExpenses,
  onOpenAddExpense,
}: ExpensesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'Todos' | ExpenseCategory>('Todos');

  // Filter logic
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'Todos' || exp.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Calculate totals
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getCategoryTotal = (category: ExpenseCategory) => {
    return expenses
      .filter((exp) => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const categoriesData: { name: ExpenseCategory; icon: React.ComponentType<any>; color: string; barColor: string; bg: string; total: number }[] = [
    { name: 'Alimentação', icon: Utensils, color: 'text-emerald-500', barColor: 'bg-emerald-500', bg: 'bg-emerald-50', total: getCategoryTotal('Alimentação') },
    { name: 'Transporte', icon: Bus, color: 'text-blue-500', barColor: 'bg-blue-500', bg: 'bg-blue-50', total: getCategoryTotal('Transporte') },
    { name: 'Jogos/Lazer', icon: Gamepad, color: 'text-purple-500', barColor: 'bg-purple-500', bg: 'bg-purple-50', total: getCategoryTotal('Jogos/Lazer') },
    { name: 'Outros', icon: Wallet, color: 'text-amber-500', barColor: 'bg-amber-500', bg: 'bg-amber-50', total: getCategoryTotal('Outros') },
  ];

  // Max category total for scaling the chart
  const maxCategoryTotal = Math.max(...categoriesData.map((c) => c.total), 1);

  const getCategoryIcon = (category: ExpenseCategory) => {
    switch (category) {
      case 'Alimentação': return <Utensils className="w-4 h-4 text-emerald-500" />;
      case 'Transporte': return <Bus className="w-4 h-4 text-blue-500" />;
      case 'Jogos/Lazer': return <Gamepad className="w-4 h-4 text-purple-500" />;
      case 'Outros': return <Wallet className="w-4 h-4 text-amber-500" />;
    }
  };

  const getCategoryBadgeClass = (category: ExpenseCategory) => {
    switch (category) {
      case 'Alimentação': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Transporte': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Jogos/Lazer': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Outros': return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      alert('Não há gastos registrados para exportar.');
      return;
    }
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Título,Valor (R$),Categoria,Data\n';
    expenses.forEach((e) => {
      csvContent += `"${e.title.replace(/"/g, '""')}",${e.amount},"${e.category}",${e.date}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'bolso_estudante_gastos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" id="expenses-tab-view">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Controle de Gastos</h1>
        <p className="text-slate-500 text-xs mt-0.5">Veja para onde vai seu saldo e gerencie seus limites.</p>
      </div>

      {/* 1. Category Chart / Distribution Breakdown */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs" id="distribution-chart-card">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Distribuição de Gastos</h2>
        
        {totalSpent === 0 ? (
          <div className="text-center py-6">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-xs">Nenhum gasto registrado ainda.</p>
            <button
              onClick={() => onOpenAddExpense()}
              className="text-blue-600 font-bold text-xs hover:underline mt-1 cursor-pointer"
            >
              Registrar primeiro gasto
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {categoriesData.map((cat) => {
              const Icon = cat.icon;
              const pctOfMax = (cat.total / maxCategoryTotal) * 100;
              const pctOfTotal = totalSpent > 0 ? (cat.total / totalSpent) * 100 : 0;
              
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <span className={`p-1 rounded-md ${cat.bg} ${cat.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      {cat.name}
                    </div>
                    <div className="text-slate-600 font-semibold">
                      <span className="text-slate-400 font-normal mr-1.5">
                        ({Math.round(pctOfTotal)}%)
                      </span>
                      R$ {cat.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pctOfMax}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={`h-full ${cat.barColor} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
            
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <span className="font-semibold">Total de Gastos:</span>
              <span className="text-slate-900 font-extrabold text-sm">
                R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Controls & Search */}
      <div className="space-y-3" id="filters-controls-section">
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar gastos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              id="input-search-expenses"
            />
          </div>

          {/* Export Report Action */}
          <button
            onClick={handleExportCSV}
            title="Exportar como Planilha (CSV)"
            className="p-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            id="btn-export-csv"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="text-xs font-bold hidden sm:inline">Exportar</span>
          </button>
        </div>

        {/* Filter categories tags scroll row */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none" id="categories-filter-row">
          {(['Todos', 'Alimentação', 'Transporte', 'Jogos/Lazer', 'Outros'] as const).map((filter) => {
            const isSelected = selectedFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-white border-slate-100 hover:border-slate-200 text-slate-500 hover:text-slate-700'
                }`}
                id={`filter-tag-${filter.replace('/', '_')}`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expenses History List */}
      <div className="space-y-2.5" id="expenses-list-container">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Histórico de Lançamentos</h3>
          {expenses.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Tem certeza de que deseja apagar todo o histórico de gastos?')) {
                  onClearAllExpenses();
                }
              }}
              className="text-red-500 hover:text-red-600 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              id="btn-clear-history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar tudo
            </button>
          )}
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center" id="empty-expenses-box">
            <ArrowDownCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-xs font-medium">Nenhum lançamento encontrado.</p>
            <p className="text-slate-400 text-[10px] mt-0.5">
              {searchQuery || selectedFilter !== 'Todos'
                ? 'Tente alterar os filtros de busca.'
                : 'Seus gastos registrados aparecerão listados aqui.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {filteredExpenses.map((exp) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-xs hover:border-slate-200 transition-all"
                  id={`expense-row-${exp.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      {getCategoryIcon(exp.category)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{exp.title}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-wider ${getCategoryBadgeClass(exp.category)}`}>
                          {exp.category}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(exp.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-slate-800 text-sm">
                      - R$ {exp.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={() => onDeleteExpense(exp.id)}
                      className="p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                      title="Apagar gasto"
                      id={`btn-delete-expense-${exp.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Helpful financial disclaimer */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-500 leading-relaxed">
        <strong>💡 Dica de Economia:</strong> Para gastos com transporte e alimentação, tente planejar com antecedência. Evite comer fora com frequência ou usar aplicativos de corrida em distâncias curtas. O "Desafio da Semana" ajuda você a se manter focado!
      </div>
    </div>
  );
}
