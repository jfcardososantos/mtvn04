import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Utensils, Bus, Gamepad, Wallet, Calendar } from 'lucide-react';
import { ExpenseCategory } from '../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (title: string, amount: number, category: ExpenseCategory, date: string) => void;
  initialCategory?: ExpenseCategory;
}

export default function AddExpenseModal({ isOpen, onClose, onAddExpense, initialCategory }: AddExpenseModalProps) {
  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(initialCategory || 'Alimentação');
  const [date, setDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  // Sync with initialCategory if passed
  React.useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr.replace(',', '.'));
    if (!title.trim()) {
      alert('Por favor, insira um título para o gasto.');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      alert('Por favor, insira um valor válido maior que R$ 0,00.');
      return;
    }

    onAddExpense(title.trim(), amount, category, date);
    // Reset form
    setTitle('');
    setAmountStr('');
    onClose();
  };

  const categoriesList: { value: ExpenseCategory; label: string; icon: React.ComponentType<any>; color: string; bg: string }[] = [
    { value: 'Alimentação', label: 'Alimentação', icon: Utensils, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { value: 'Transporte', label: 'Transporte', icon: Bus, color: 'text-blue-500', bg: 'bg-blue-50' },
    { value: 'Jogos/Lazer', label: 'Jogos/Lazer', icon: Gamepad, color: 'text-purple-500', bg: 'bg-purple-50' },
    { value: 'Outros', label: 'Outros', icon: Wallet, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            id="modal-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 overflow-hidden z-10 max-h-[92vh] flex flex-col"
            id="modal-container"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Registrar Novo Gasto</h3>
                <p className="text-xs text-slate-500">Mantenha seu saldo Pé-de-Meia organizado!</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors cursor-pointer"
                id="btn-close-modal"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Value Input (Large and Central) */}
              <div className="text-center py-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Valor do Gasto
                </label>
                <div className="relative inline-flex items-center justify-center">
                  <span className="text-2xl font-bold text-slate-400 mr-1.5">R$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={amountStr}
                    onChange={(e) => {
                      // Allow numbers and comma/dot
                      const val = e.target.value.replace(/[^0-9.,]/g, '');
                      setAmountStr(val);
                    }}
                    className="text-4xl font-extrabold text-slate-800 bg-transparent focus:outline-none w-48 text-center border-b-2 border-dashed border-slate-200 focus:border-orange-500 transition-colors pb-1"
                    id="input-expense-amount"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Title / Description */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">O que você comprou?</label>
                <input
                  type="text"
                  placeholder="Ex: Lanche na cantina, Passagem de ônibus..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  id="input-expense-title"
                  required
                />
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Selecione a Categoria</label>
                <div className="grid grid-cols-2 gap-2" id="category-selector-grid">
                  {categoriesList.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/40 text-blue-800'
                            : 'border-slate-100 hover:border-slate-200 bg-white text-slate-600'
                        }`}
                        id={`btn-cat-select-${cat.value.replace('/', '_')}`}
                      >
                        <div className={`p-2 rounded-lg ${cat.bg} ${cat.color} shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-sm leading-tight">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Data do Gasto</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="input-expense-date"
                    required
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 font-semibold rounded-xl transition-colors cursor-pointer"
                  id="btn-cancel-expense"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-md shadow-orange-500/20 cursor-pointer"
                  id="btn-submit-expense"
                >
                  Confirmar Gasto
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
