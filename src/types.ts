export type ExpenseCategory = 'Alimentação' | 'Transporte' | 'Jogos/Lazer' | 'Outros';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO date string YYYY-MM-DD
  description?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetDays: number;
  currentDays: number;
  rewardValue: number; // e.g. 20 (R$ 20 economizados)
  completed: boolean;
  category: ExpenseCategory;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentSaved: number;
  category: 'Estudos' | 'Tecnologia' | 'Lazer' | 'Emergência' | 'Outros';
  deadline?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Tip {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  readTime: string;
  badge: 'Economia' | 'Investimentos' | 'Pé-de-Meia' | 'Dicas Práticas';
}
