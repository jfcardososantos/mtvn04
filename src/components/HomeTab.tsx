import React from 'react';
import { motion } from 'motion/react';
import { 
  Utensils, 
  Bus, 
  Gamepad, 
  Wallet, 
  Plus, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight, 
  ChevronRight, 
  HelpCircle,
  Coins,
  Smile
} from 'lucide-react';
import { Expense, ExpenseCategory, Challenge } from '../types';

interface HomeTabProps {
  balance: number;
  totalLimit: number;
  expenses: Expense[];
  activeChallenge: Challenge;
  onOpenAddExpense: (preselectedCategory?: ExpenseCategory) => void;
  onCheckInChallenge: () => void;
  onClaimChallengeReward: () => void;
  onNavigateToTab: (tab: 'Início' | 'Gastos' | 'Metas' | 'Dicas') => void;
}

export default function HomeTab({
  balance,
  totalLimit,
  expenses,
  activeChallenge,
  onOpenAddExpense,
  onCheckInChallenge,
  onClaimChallengeReward,
  onNavigateToTab,
}: HomeTabProps) {
  
  // Calculate category totals
  const getCategoryTotal = (category: ExpenseCategory) => {
    return expenses
      .filter((exp) => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const foodTotal = getCategoryTotal('Alimentação');
  const transportTotal = getCategoryTotal('Transporte');
  const gamesTotal = getCategoryTotal('Jogos/Lazer');
  const othersTotal = getCategoryTotal('Outros');

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate percentage of remaining balance (for Pé de Meia progress bar)
  // Standard Pé-de-Meia is 200,00 total.
  const remainingPct = Math.max(0, Math.min(100, (balance / totalLimit) * 100));

  // Determine warning level of spending
  const spentPct = (totalSpent / totalLimit) * 100;
  let barColor = 'bg-sky-400';
  if (spentPct > 85) {
    barColor = 'bg-red-500';
  } else if (spentPct > 50) {
    barColor = 'bg-amber-400';
  }

  // Categories list to map
  const categories: { name: ExpenseCategory; icon: React.ComponentType<any>; color: string; bg: string; total: number }[] = [
    { name: 'Alimentação', icon: Utensils, color: 'text-emerald-500', bg: 'bg-emerald-50', total: foodTotal },
    { name: 'Transporte', icon: Bus, color: 'text-blue-500', bg: 'bg-blue-50', total: transportTotal },
    { name: 'Jogos/Lazer', icon: Gamepad, color: 'text-purple-500', bg: 'bg-purple-50', total: gamesTotal },
    { name: 'Outros', icon: Wallet, color: 'text-amber-500', bg: 'bg-amber-50', total: othersTotal },
  ];

  return (
    <div className="space-y-6" id="home-tab-view">
      {/* 1. Header */}
      <header className="py-2 flex items-center justify-between" id="home-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-lg shadow-xs">
            🎓
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Bolso <span className="text-blue-600">Estudante</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Finanças e Incentivo Escolar</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-xs border border-slate-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-600 text-xs">Pé-de-Meia</span>
        </div>
      </header>

      {/* 2. Prominent Blue Card: SALDO PÉ-DE-MEIA (Bento Theme) */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-200/50 overflow-hidden"
        id="card-saldo-pe-de-meia"
      >
        {/* Abstract background decoration */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-blue-100 text-xs font-medium uppercase tracking-widest">Saldo Pé-de-Meia</h2>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-light opacity-80">R$</span>
                <span className="text-5xl font-black tracking-tight">
                  {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-blue-100 flex items-center gap-1.5 border border-white/10">
              <Coins className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
              Ativo
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between mb-2 text-xs font-semibold">
              <span className="text-blue-100">Gasto: R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <span className="text-white">Total: R$ {totalLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${remainingPct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-orange-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Category Expenses Bento Block */}
      <section className="bg-white rounded-[2.5rem] p-7 shadow-xs border border-slate-100 flex flex-col" id="quick-categories-section">
        <h3 className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-5">Gastos por Categoria</h3>
        <div className="grid grid-cols-4 gap-2" id="categories-row">
          {categories.map((cat) => {
            const Icon = cat.icon;
            // Map categories to emojis for the bento visual style
            const emojiMap: Record<ExpenseCategory, string> = {
              'Alimentação': '🍎',
              'Transporte': '🚌',
              'Jogos/Lazer': '🎮',
              'Outros': '📦'
            };
            return (
              <motion.button
                key={cat.name}
                whileHover={{ scale: 1.05 }}
                onClick={() => onOpenAddExpense(cat.name)}
                className="flex flex-col items-center p-2 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer text-center"
                id={`btn-quick-cat-${cat.name.replace('/', '_')}`}
              >
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-xl shadow-xs mb-2">
                  {emojiMap[cat.name]}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate w-full">
                  {cat.name === 'Alimentação' ? 'Comida' : cat.name === 'Transporte' ? 'Transp.' : cat.name === 'Jogos/Lazer' ? 'Lazer' : 'Outros'}
                </span>
                <span className="text-xs font-bold text-slate-800 mt-0.5">
                  R$ {cat.total.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* 4. Orange Register button styled in Bento Grid look */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onOpenAddExpense()}
        className="w-full bg-orange-500 hover:bg-orange-600 transition-colors rounded-[2.5rem] shadow-lg shadow-orange-100 p-6 flex flex-col items-center justify-center gap-3 text-white cursor-pointer"
        id="btn-registrar-gasto-home"
      >
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </div>
        <span className="text-lg font-bold">Registrar Gasto</span>
      </motion.button>

      {/* 5. Desafio da Semana Bento Block (Slate-900 cosmic card) */}
      <section className="bg-slate-900 rounded-[2.5rem] p-7 text-white overflow-hidden relative shadow-md" id="desafio-semana-section">
        <div className="relative z-10 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-orange-500 text-[9px] font-black uppercase px-3 py-1 rounded-full text-white tracking-wider">
                Desafio da Semana
              </span>
              <span className="text-orange-400 text-xs font-bold flex items-center gap-1">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95h.001l-.001.05a1 1 0 01-.131.488l-1.923 3.428H15a1 1 0 01.916 1.401l-5.333 11a1 1 0 01-1.745-.884L10.15 13.5H5a1 1 0 01-.916-1.401l5.333-11a1 1 0 01.883-.552z" clipRule="evenodd" /></svg>
                Ativo
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
              Progresso: {activeChallenge.currentDays}/{activeChallenge.targetDays}d
            </span>
          </div>

          <div>
            <h4 className="text-xl font-bold text-white">{activeChallenge.title}</h4>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              {activeChallenge.description}
            </p>
          </div>

          {/* Progress bar in dark card */}
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-orange-400 h-full rounded-full transition-all duration-300" 
              style={{ width: `${(activeChallenge.currentDays / activeChallenge.targetDays) * 100}%` }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pt-2 border-t border-white/5">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center text-sm font-black">
                R$
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Recompensa</p>
                <p className="text-sm font-extrabold text-orange-400">R$ {activeChallenge.rewardValue},00 economizados</p>
              </div>
            </div>

            {/* Claim/Progress Action button inside challenge bento */}
            {!activeChallenge.completed ? (
              <button
                onClick={onCheckInChallenge}
                className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                id="btn-challenge-checkin"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Marcar Dia Concluído</span>
              </button>
            ) : (
              <button
                onClick={onClaimChallengeReward}
                className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer animate-pulse"
                id="btn-challenge-claim"
              >
                🎉 Resgatar (R$ {activeChallenge.rewardValue},00)
              </button>
            )}
          </div>
        </div>

        {/* Backdrop SVG illustration representation */}
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
          <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z" /></svg>
        </div>
      </section>

      {/* Quick Education Widget */}
      <div 
        onClick={() => onNavigateToTab('Dicas')}
        className="bg-sky-50 border border-sky-100 rounded-[1.5rem] p-4 flex items-center gap-4 cursor-pointer hover:bg-sky-100/80 transition-colors"
        id="widget-edu-quick"
      >
        <div className="w-10 h-10 bg-sky-200 text-sky-800 rounded-full flex items-center justify-center shrink-0">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sky-950 text-xs">Aprenda a render seu saldo!</h4>
          <p className="text-sky-800 text-[11px] leading-tight mt-0.5">
            Sabia que deixar o dinheiro parado pode desvalorizar? Veja como fazê-lo render na aba Dicas.
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-sky-400 shrink-0" />
      </div>
    </div>
  );
}
