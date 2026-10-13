import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Receipt, 
  Target, 
  Lightbulb, 
  X
} from 'lucide-react';

import { Expense, ExpenseCategory, Challenge, Goal } from './types';
import HomeTab from './components/HomeTab';
import ExpensesTab from './components/ExpensesTab';
import GoalsTab from './components/GoalsTab';
import TipsTab from './components/TipsTab';
import AddExpenseModal from './components/AddExpenseModal';

// List of fun, educational student challenges
const AVAILABLE_CHALLENGES: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'Transporte Consciente 🚌',
    description: 'Use ônibus, metrô, caminhe ou vá de bicicleta em vez de pedir carro de aplicativo por 5 dias.',
    targetDays: 5,
    currentDays: 2, // pre-populated with 2 days done so they are close to completing!
    rewardValue: 20,
    completed: false,
    category: 'Transporte'
  },
  {
    id: 'challenge-2',
    title: 'Marmita Nota 10 🍱',
    description: 'Traga lanche feito em casa para a escola em vez de comprar na cantina por 3 dias letivos.',
    targetDays: 3,
    currentDays: 0,
    rewardValue: 35,
    completed: false,
    category: 'Alimentação'
  },
  {
    id: 'challenge-3',
    title: 'Entretenimento Grátis 🎮',
    description: 'Prefira jogos grátis, canais de streaming que já possui ou passeios em parques públicos em vez de gastar com ingressos ou microtransações por 2 fins de semana.',
    targetDays: 2,
    currentDays: 0,
    rewardValue: 25,
    completed: false,
    category: 'Jogos/Lazer'
  },
  {
    id: 'challenge-4',
    title: 'Dia do Gasto Zero 🛑',
    description: 'Consiga passar 1 dia letivo inteiro sem gastar nem um único centavo!',
    targetDays: 1,
    currentDays: 0,
    rewardValue: 15,
    completed: false,
    category: 'Outros'
  }
];

// Initial preloaded saving goals
const DEFAULT_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Inscrição do Vestibular / Enem 📝',
    targetAmount: 85,
    currentSaved: 30,
    category: 'Estudos',
    deadline: '2026-10-31'
  },
  {
    id: 'goal-2',
    title: 'Reserva de Emergência 🚨',
    targetAmount: 150,
    currentSaved: 60,
    category: 'Emergência'
  }
];

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'Início' | 'Gastos' | 'Metas' | 'Dicas'>('Início');

  // Core Financial State
  const [balance, setBalance] = useState<number>(200); // Standard Pé-de-Meia Monthly is R$ 200,00
  const [totalLimit, setTotalLimit] = useState<number>(200);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [activeChallenge, setActiveChallenge] = useState<Challenge>(AVAILABLE_CHALLENGES[0]);
  const [challengeIndex, setChallengeIndex] = useState<number>(0);

  // UI state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState<ExpenseCategory | undefined>(undefined);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Load state from LocalStorage on mount
  useEffect(() => {
    const savedBalance = localStorage.getItem('bolso_balance');
    const savedLimit = localStorage.getItem('bolso_limit');
    const savedExpenses = localStorage.getItem('bolso_expenses');
    const savedGoals = localStorage.getItem('bolso_goals');
    const savedChallenge = localStorage.getItem('bolso_active_challenge');
    const savedChallengeIndex = localStorage.getItem('bolso_challenge_idx');

    if (savedBalance !== null) setBalance(parseFloat(savedBalance));
    if (savedLimit !== null) setTotalLimit(parseFloat(savedLimit));
    if (savedExpenses !== null) setExpenses(JSON.parse(savedExpenses));
    if (savedGoals !== null) {
      try {
        const parsed: Goal[] = JSON.parse(savedGoals);
        const migrated = parsed.map((g) => {
          if (g.title.toLowerCase().includes('fone') || g.id === 'goal-2') {
            return {
              ...g,
              title: 'Reserva de Emergência 🚨',
              category: 'Emergência' as const,
            };
          }
          return g;
        });
        setGoals(migrated);
      } catch {
        setGoals(DEFAULT_GOALS);
      }
    }
    if (savedChallenge !== null) setActiveChallenge(JSON.parse(savedChallenge));
    if (savedChallengeIndex !== null) setChallengeIndex(parseInt(savedChallengeIndex));
  }, []);

  // Save to LocalStorage when states change
  useEffect(() => {
    localStorage.setItem('bolso_balance', balance.toString());
    localStorage.setItem('bolso_limit', totalLimit.toString());
    localStorage.setItem('bolso_expenses', JSON.stringify(expenses));
    localStorage.setItem('bolso_goals', JSON.stringify(goals));
    localStorage.setItem('bolso_active_challenge', JSON.stringify(activeChallenge));
    localStorage.setItem('bolso_challenge_idx', challengeIndex.toString());
  }, [balance, totalLimit, expenses, goals, activeChallenge, challengeIndex]);

  // Show Toast Utility
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Add Expense Handler
  const handleAddExpense = (title: string, amount: number, category: ExpenseCategory, date: string) => {
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      title,
      amount,
      category,
      date
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setBalance((prev) => prev - amount);
    showToast(`Gasto "${title}" de R$ ${amount.toFixed(2)} registrado!`, 'success');
  };

  // Delete Expense Handler
  const handleDeleteExpense = (id: string) => {
    const expToDelete = expenses.find((e) => e.id === id);
    if (!expToDelete) return;

    setExpenses((prev) => prev.filter((e) => e.id !== id));
    setBalance((prev) => prev + expToDelete.amount);
    showToast(`Gasto "${expToDelete.title}" apagado! Saldo restaurado em R$ ${expToDelete.amount.toFixed(2)}.`, 'info');
  };

  // Clear All Expenses Handler
  const handleClearAllExpenses = () => {
    // Add all spent amounts back to balance
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    setExpenses([]);
    setBalance((prev) => prev + totalSpent);
    showToast('Histórico de gastos limpo! Todo o saldo foi restaurado.', 'info');
  };

  // Add Goal Handler
  const handleAddGoal = (title: string, targetAmount: number, category: Goal['category'], deadline?: string) => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title,
      targetAmount,
      currentSaved: 0,
      category,
      deadline
    };

    setGoals((prev) => [...prev, newGoal]);
    showToast(`Nova meta "${title}" criada com sucesso! 🎯`, 'success');
  };

  // Delete Goal Handler
  const handleDeleteGoal = (id: string) => {
    const goalToDelete = goals.find((g) => g.id === id);
    if (!goalToDelete) return;

    setGoals((prev) => prev.filter((g) => g.id !== id));
    // Refund saved progress back to Pé-de-Meia balance
    if (goalToDelete.currentSaved > 0) {
      setBalance((prev) => prev + goalToDelete.currentSaved);
      showToast(`Meta "${goalToDelete.title}" excluída. R$ ${goalToDelete.currentSaved.toFixed(2)} retornaram ao saldo!`, 'info');
    } else {
      showToast(`Meta "${goalToDelete.title}" removida.`, 'info');
    }
  };

  // Update Goal Progress (Save/Withdraw money inside goals)
  const handleUpdateGoalProgress = (id: string, amount: number) => {
    // amount is positive for saving, negative for withdrawing
    let success = false;

    setGoals((prev) => prev.map((goal) => {
      if (goal.id === id) {
        const newSaved = Math.max(0, goal.currentSaved + amount);
        
        // Check bounds
        if (amount > 0 && balance < amount) {
          return goal; // insufficient balance
        }

        setBalance((prevBal) => prevBal - amount);
        success = true;

        if (newSaved >= goal.targetAmount && goal.currentSaved < goal.targetAmount) {
          // Trigger delayed celebration/toast
          setTimeout(() => {
            showToast(`🎉 Incrível! Você alcançou o objetivo de "${goal.title}"!`, 'success');
          }, 300);
        } else {
          showToast(
            amount > 0 
              ? `R$ ${amount.toFixed(2)} guardados na meta "${goal.title}"! 💰`
              : `R$ ${Math.abs(amount).toFixed(2)} resgatados da meta "${goal.title}"!`
            , 'success'
          );
        }

        return { ...goal, currentSaved: newSaved };
      }
      return goal;
    }));

    return success;
  };

  // Challenge Progress Handler (Mark day completed)
  const handleCheckInChallenge = () => {
    if (activeChallenge.completed) return;

    const nextDays = activeChallenge.currentDays + 1;
    const isCompleted = nextDays >= activeChallenge.targetDays;

    const updated = {
      ...activeChallenge,
      currentDays: nextDays,
      completed: isCompleted
    };

    setActiveChallenge(updated);

    if (isCompleted) {
      showToast(`🌟 Sensacional! Desafio "${activeChallenge.title}" Concluído! Clique em Resgatar Recompensa.`, 'success');
    } else {
      showToast(`Dia marcado! Progresso no desafio: ${nextDays}/${activeChallenge.targetDays} dias.`, 'success');
    }
  };

  // Claim Challenge Reward Handler
  const handleClaimChallengeReward = () => {
    if (!activeChallenge.completed) return;

    const reward = activeChallenge.rewardValue;
    setBalance((prev) => prev + reward);
    setTotalLimit((prev) => prev + reward); // Add reward to total monthly allowance

    showToast(`🏆 Recompensa resgatada! R$ ${reward},00 adicionados ao seu saldo Pé-de-Meia.`, 'success');

    // Cycle to next challenge
    const nextIdx = (challengeIndex + 1) % AVAILABLE_CHALLENGES.length;
    setChallengeIndex(nextIdx);
    setActiveChallenge({
      ...AVAILABLE_CHALLENGES[nextIdx],
      currentDays: 0,
      completed: false
    });
  };

  // Open add expense modal with optional category preselected
  const handleOpenAddExpense = (category?: ExpenseCategory) => {
    setPreselectedCategory(category);
    setIsAddModalOpen(true);
  };

  // Reset entire application to defaults for sandbox playing
  const handleResetApp = () => {
    if (confirm('Deseja resetar o aplicativo para os dados padrão? Isso apagará seu progresso local.')) {
      setBalance(200);
      setTotalLimit(200);
      setExpenses([]);
      setGoals(DEFAULT_GOALS);
      setChallengeIndex(0);
      setActiveChallenge(AVAILABLE_CHALLENGES[0]);
      setActiveTab('Início');
      localStorage.clear();
      showToast('Aplicativo resetado com sucesso!', 'info');
    }
  };

  // Navigation Items list
  const navItems = [
    { label: 'Início' as const, icon: Home },
    { label: 'Gastos' as const, icon: Receipt },
    { label: 'Metas' as const, icon: Target },
    { label: 'Dicas' as const, icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start w-full" id="app-viewport">
      <div className="w-full max-w-lg min-h-screen flex flex-col bg-slate-50 relative" id="app-container">
        
        {/* Dynamic Toast Alerts Container */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4"
              id="app-toast-alert"
            >
              <div className={`p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-white text-xs font-bold ${
                toast.type === 'success' ? 'bg-slate-900 border border-slate-800' : 'bg-blue-600 border border-blue-500'
              }`}>
                <span className="flex-1">{toast.message}</span>
                <button 
                  onClick={() => setToast(null)}
                  className="p-1 hover:bg-white/10 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Tab View Canvas */}
        <main className="flex-1 w-full p-4 sm:p-5 pb-28 overflow-y-auto" id="main-content-scroll">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'Início' && (
                <HomeTab
                  balance={balance}
                  totalLimit={totalLimit}
                  expenses={expenses}
                  activeChallenge={activeChallenge}
                  onOpenAddExpense={handleOpenAddExpense}
                  onCheckInChallenge={handleCheckInChallenge}
                  onClaimChallengeReward={handleClaimChallengeReward}
                  onNavigateToTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'Gastos' && (
                <ExpensesTab
                  expenses={expenses}
                  onDeleteExpense={handleDeleteExpense}
                  onClearAllExpenses={handleClearAllExpenses}
                  onOpenAddExpense={handleOpenAddExpense}
                />
              )}

              {activeTab === 'Metas' && (
                <GoalsTab
                  goals={goals}
                  balance={balance}
                  onAddGoal={handleAddGoal}
                  onDeleteGoal={handleDeleteGoal}
                  onUpdateGoalProgress={handleUpdateGoalProgress}
                />
              )}

              {activeTab === 'Dicas' && (
                <TipsTab onResetApp={handleResetApp} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 inset-x-0 z-40 flex justify-center bg-transparent pointer-events-none" id="bottom-nav-bar-container">
          <div className="w-full max-w-lg bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-around py-3 px-3 shadow-lg pointer-events-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.label)}
                  className="flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer relative"
                  id={`btn-nav-tab-${item.label}`}
                >
                  {/* Active indicator dot/pill backdrop */}
                  {isSelected && (
                    <motion.div
                      layoutId="active-tab-indicator"
                      className="absolute inset-0 bg-blue-50/75 rounded-2xl -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  
                  <Icon className={`w-5.5 h-5.5 transition-transform ${isSelected ? 'text-blue-600 scale-110 stroke-[2.5]' : 'text-slate-400 stroke-[1.8] hover:text-slate-600'}`} />
                  <span className={`text-[10px] font-bold mt-1 tracking-wide ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Registrar Gasto Slideup overlay modal */}
        <AddExpenseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddExpense={handleAddExpense}
          initialCategory={preselectedCategory}
        />

      </div>
    </div>
  );
}
