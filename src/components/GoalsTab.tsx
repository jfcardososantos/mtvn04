import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  Plus, 
  Sparkles, 
  Bookmark, 
  Trash2, 
  Laptop, 
  Award, 
  Compass, 
  HelpCircle,
  Coins,
  ChevronDown,
  ChevronUp,
  ShieldAlert
} from 'lucide-react';
import { Goal } from '../types';

interface GoalsTabProps {
  goals: Goal[];
  balance: number;
  onAddGoal: (title: string, targetAmount: number, category: Goal['category'], deadline?: string) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateGoalProgress: (id: string, amount: number) => boolean; // returns true if success
}

export default function GoalsTab({
  goals,
  balance,
  onAddGoal,
  onDeleteGoal,
  onUpdateGoalProgress,
}: GoalsTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newCategory, setNewCategory] = useState<Goal['category']>('Emergência');
  const [newDeadline, setNewDeadline] = useState('');

  // Track which goal card has the "save/withdraw" drawer open
  const [activeGoalActionId, setActiveGoalActionId] = useState<string | null>(null);
  const [actionAmount, setActionAmount] = useState('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(newTarget.replace(',', '.'));
    if (!newTitle.trim()) {
      alert('Por favor, dê um título para sua meta.');
      return;
    }
    if (isNaN(target) || target <= 0) {
      alert('Insira um valor de objetivo válido maior que R$ 0,00.');
      return;
    }

    onAddGoal(newTitle.trim(), target, newCategory, newDeadline || undefined);
    
    // Reset form
    setNewTitle('');
    setNewTarget('');
    setNewCategory('Estudos');
    setNewDeadline('');
    setShowAddForm(false);
  };

  const handleProgressAction = (goalId: string, isSaving: boolean) => {
    const amount = parseFloat(actionAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      alert('Por favor, digite um valor maior que R$ 0,00.');
      return;
    }

    if (isSaving && amount > balance) {
      alert('Saldo Pé-de-Meia insuficiente para guardar esta quantia.');
      return;
    }

    const currentGoal = goals.find((g) => g.id === goalId);
    if (!currentGoal) return;

    if (!isSaving && amount > currentGoal.currentSaved) {
      alert('Você não pode resgatar mais do que o saldo atual guardado nesta meta.');
      return;
    }

    // Perform update
    const signedAmount = isSaving ? amount : -amount;
    const success = onUpdateGoalProgress(goalId, signedAmount);
    
    if (success) {
      setActionAmount('');
      setActiveGoalActionId(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Emergência': return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      case 'Estudos': return <Award className="w-5 h-5 text-emerald-500" />;
      case 'Tecnologia': return <Laptop className="w-5 h-5 text-blue-500" />;
      case 'Lazer': return <Compass className="w-5 h-5 text-purple-500" />;
      default: return <Bookmark className="w-5 h-5 text-amber-500" />;
    }
  };

  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'Emergência': return 'bg-rose-50';
      case 'Estudos': return 'bg-emerald-50';
      case 'Tecnologia': return 'bg-blue-50';
      case 'Lazer': return 'bg-purple-50';
      default: return 'bg-amber-50';
    }
  };

  const totalSavedAcrossGoals = goals.reduce((sum, g) => sum + g.currentSaved, 0);

  return (
    <div className="space-y-6" id="goals-tab-view">
      {/* Title */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Cofre de Metas</h1>
          <p className="text-slate-500 text-xs mt-0.5">Defina seus objetivos de emergência, estudos, tecnologia ou lazer e poupe.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
            showAddForm 
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-500/10'
          }`}
          id="btn-toggle-new-goal-form"
        >
          {showAddForm ? 'Cancelar' : (
            <>
              <Plus className="w-4 h-4 stroke-[3]" />
              Nova Meta
            </>
          )}
        </button>
      </div>

      {/* Summary Box */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-5 text-white shadow-md shadow-emerald-500/10" id="goals-summary-box">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">
              Total Economizado nas Metas
            </span>
            <h2 className="text-3xl font-extrabold mt-1">
              R$ {totalSavedAcrossGoals.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 text-xl">
            🎯
          </div>
        </div>
        <p className="text-[11px] text-emerald-100/90 mt-3 font-semibold leading-tight">
          Poupar ajuda você a comprar à vista, garantindo descontos e evitando dívidas de cartão de crédito!
        </p>
      </div>

      {/* Add New Goal Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreateGoal} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm" id="new-goal-form">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-50 pb-2">Criar Novo Objetivo</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Qual é o seu objetivo?</label>
                  <input
                    type="text"
                    placeholder="Ex: Novo Notebook, Celular, Viagem de Formatura"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="input-goal-title"
                    required
                  />
                </div>

                {/* Target amount */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Quanto você precisa poupar (R$)?</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Ex: 500,00"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="input-goal-target"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="input-goal-category"
                  >
                    <option value="Emergência">🚨 Reserva de Emergência</option>
                    <option value="Estudos">📚 Estudos / Educação</option>
                    <option value="Tecnologia">💻 Tecnologia / Gadgets</option>
                    <option value="Lazer">🎮 Lazer / Viagem / Diversão</option>
                    <option value="Outros">✨ Outros</option>
                  </select>
                </div>

                {/* Deadline */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Prazo Limite (Opcional)</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="input-goal-deadline"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
                  id="btn-submit-goal"
                >
                  Confirmar Meta
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals List */}
      <div className="space-y-4" id="goals-list-container">
        {goals.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center" id="empty-goals-box">
            <Target className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm font-semibold">Crie seu primeiro objetivo financeiro!</p>
            <p className="text-slate-400 text-xs mt-1 leading-normal max-w-xs mx-auto">
              Seja para comprar um livro, se inscrever em um curso ou planejar uma comemoração, guardar focado em uma meta facilita tudo!
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-colors cursor-pointer"
            >
              Começar Agora
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {goals.map((goal) => {
              const progressPct = Math.min(100, Math.round((goal.currentSaved / goal.targetAmount) * 100));
              const isDrawerOpen = activeGoalActionId === goal.id;
              const isGoalCompleted = goal.currentSaved >= goal.targetAmount;

              return (
                <div 
                  key={goal.id} 
                  className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs transition-all hover:border-slate-200"
                  id={`goal-card-${goal.id}`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-2xl ${getCategoryBg(goal.category)} shrink-0`}>
                        {getCategoryIcon(goal.category)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5 leading-tight">
                          {goal.title}
                          {isGoalCompleted && (
                            <span className="text-emerald-500 text-xs shrink-0 bg-emerald-50 px-1.5 py-0.5 rounded-full font-bold">
                              Concluída! 🎉
                            </span>
                          )}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5 mt-0.5">
                          Categoria: {goal.category}
                          {goal.deadline && (
                            <span>• Até: {new Date(goal.deadline + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Excluir meta "${goal.title}"? O dinheiro que já estava guardado voltará para o Saldo Pé-de-Meia.`)) {
                          onDeleteGoal(goal.id);
                        }
                      }}
                      className="p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-all cursor-pointer shrink-0"
                      title="Excluir meta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Stats */}
                  <div className="flex justify-between items-baseline text-xs mt-4">
                    <div className="font-bold text-slate-700">
                      R$ {goal.currentSaved.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      <span className="text-slate-400 font-normal"> de R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <span className="text-blue-600 font-black">{progressPct}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full rounded-full ${isGoalCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-blue-600'}`}
                    />
                  </div>

                  {/* Goal Card Actions Controls */}
                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Gerenciar Poupança
                    </span>
                    
                    <button
                      onClick={() => {
                        if (isDrawerOpen) {
                          setActiveGoalActionId(null);
                        } else {
                          setActiveGoalActionId(goal.id);
                        }
                        setActionAmount('');
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
                    >
                      {isDrawerOpen ? (
                        <>Fechar Painel <ChevronUp className="w-4 h-4" /></>
                      ) : (
                        <>Guardar ou Resgatar <ChevronDown className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>

                  {/* Action Expansion Drawer (inline to prevent prompt triggers) */}
                  <AnimatePresence>
                    {isDrawerOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-3 bg-slate-50 rounded-2xl p-4 border border-slate-100"
                      >
                        <p className="text-[11px] text-slate-500 mb-2.5 font-medium">
                          Insira um valor e escolha se quer transferir do seu Saldo Pé-de-Meia para esta meta ou resgatar de volta:
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          {/* Inline input */}
                          <div className="relative w-full flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                            <input
                              type="text"
                              inputMode="decimal"
                              placeholder="0,00"
                              value={actionAmount}
                              onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9.,]/g, '');
                                setActionAmount(val);
                              }}
                              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          {/* Quick Actions Grid */}
                          <div className="flex gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                            {/* Withdraw money (Resgatar) */}
                            {goal.currentSaved > 0 && (
                              <button
                                type="button"
                                onClick={() => handleProgressAction(goal.id, false)}
                                className="flex-1 sm:flex-initial px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                              >
                                Resgatar
                              </button>
                            )}

                            {/* Save money (Guardar) */}
                            {!isGoalCompleted && (
                              <button
                                type="button"
                                onClick={() => handleProgressAction(goal.id, true)}
                                className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                              >
                                Guardar (+ Poupar)
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Quick preset chips */}
                        <div className="flex gap-1.5 mt-2.5">
                          {['5', '10', '20', '50'].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setActionAmount(preset)}
                              className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 cursor-pointer"
                            >
                              + R$ {preset}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Helpful educational disclaimer */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-xs text-emerald-800 leading-relaxed flex gap-3 items-start">
        <div className="w-5 h-5 bg-emerald-200 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
          🌱
        </div>
        <div>
          <strong>Guardar para Metas rende mais saúde mental:</strong> Organizar o dinheiro em "potinhos" virtuais é uma técnica comprovada. Sabendo exatamente para onde vai seu esforço, fica muito mais fácil evitar as tentações das comprinhas impulsivas de todo dia!
        </div>
      </div>
    </div>
  );
}
