import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Award, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Flame,
  ThumbsUp,
  Bookmark
} from 'lucide-react';
import { INITIAL_TIPS, QUIZ_QUESTIONS } from '../data/tips';
import { Tip } from '../types';

interface TipsTabProps {
  onResetApp?: () => void;
}

export default function TipsTab({ onResetApp }: TipsTabProps = {}) {
  const [activeSubTab, setActiveSubTab] = useState<'Dicas' | 'Quiz'>('Dicas');
  
  // Tips state
  const [expandedTipId, setExpandedTipId] = useState<string | null>(null);

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([]); // holds true/false for each question answered
  const [quizFinished, setQuizFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const toggleTip = (id: string) => {
    if (expandedTipId === id) {
      setExpandedTipId(null);
    } else {
      setExpandedTipId(id);
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setQuizAnswers([]);
    setQuizFinished(false);
    setCorrectCount(0);
  };

  const handleAnswerOptionClick = (index: number) => {
    if (selectedOptionIndex !== null) return; // Answer already selected
    setSelectedOptionIndex(index);
    
    const isCorrect = index === QUIZ_QUESTIONS[currentQuestionIndex].correctIndex;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }
    
    setQuizAnswers((prev) => [...prev, isCorrect]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
    } else {
      setQuizFinished(true);
    }
  };

  const getBadgeColor = (badge: Tip['badge']) => {
    switch (badge) {
      case 'Pé-de-Meia': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Economia': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Investimentos': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  const getRank = (score: number) => {
    if (score === 4) return { title: 'Mestre da Poupança 🏆', text: 'Excelente! Você domina todos os conceitos financeiros básicos e sabe como cuidar do seu saldo.' };
    if (score === 3) return { title: 'Poupador Consciente 🌟', text: 'Muito bom! Você está no caminho certo para gerenciar suas finanças com bastante autonomia.' };
    if (score === 2) return { title: 'Iniciante Financeiro 🌱', text: 'Bom esforço! Você já tem boas noções, mas ler as nossas dicas vai te ajudar a tomar decisões ainda melhores.' };
    return { title: 'Estudante Curioso 📚', text: 'Continue aprendendo! Leia as dicas do Bolso Estudante para entender melhor como poupar e investir.' };
  };

  return (
    <div className="space-y-6" id="tips-tab-view">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 font-sans">Educação Financeira</h1>
        <p className="text-slate-500 text-xs mt-0.5">Aprenda de forma rápida e divertida a fazer seu dinheiro render.</p>
      </div>

      {/* Sub tabs selector */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl" id="sub-tabs-container">
        <button
          onClick={() => setActiveSubTab('Dicas')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'Dicas' 
              ? 'bg-white text-blue-600 shadow-xs' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
          id="btn-sub-tab-dicas"
        >
          <BookOpen className="w-4 h-4" />
          Guias Rápidos
        </button>
        <button
          onClick={() => setActiveSubTab('Quiz')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'Quiz' 
              ? 'bg-white text-blue-600 shadow-xs' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
          id="btn-sub-tab-quiz"
        >
          <HelpCircle className="w-4 h-4" />
          Quiz Bolso Estudante
        </button>
      </div>

      {/* Sub Tab: DICAS / GUIDES */}
      {activeSubTab === 'Dicas' && (
        <div className="space-y-4" id="dicas-articles-list">
          {INITIAL_TIPS.map((tip) => {
            const isExpanded = expandedTipId === tip.id;
            return (
              <div 
                key={tip.id} 
                className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs hover:border-slate-200 transition-all"
                id={`tip-card-${tip.id}`}
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleTip(tip.id)}
                  className="w-full text-left p-5 flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wider ${getBadgeColor(tip.badge)}`}>
                        {tip.badge}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tip.readTime}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-base leading-snug">
                      {tip.title}
                    </h3>
                    {!isExpanded && (
                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                        {tip.shortDescription}
                      </p>
                    )}
                  </div>

                  <div className={`p-1.5 rounded-full bg-slate-50 text-slate-400 shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-180 bg-blue-50 text-blue-500' : ''}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {/* Animated content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-50 bg-slate-50/50"
                    >
                      <div className="p-5 text-slate-600 text-xs whitespace-pre-line leading-relaxed">
                        {tip.content}
                        
                        <div className="mt-5 p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-start gap-2.5">
                          <Bookmark className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-extrabold text-blue-900 text-xs block mb-0.5">Dica Bolso Estudante:</span>
                            Coloque em prática anotando qualquer compra de lanche ou transporte hoje mesmo no app! O hábito de registrar é o pilar fundamental.
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          {onResetApp && (
            <div className="pt-4 pb-2 text-center">
              <button
                type="button"
                onClick={onResetApp}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors inline-flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Restaurar dados de demonstração
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sub Tab: QUIZ */}
      {activeSubTab === 'Quiz' && (
        <div id="quiz-container-card">
          {!quizStarted ? (
            /* Quiz Start State */
            <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center space-y-4" id="quiz-start-box">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-xs border border-blue-100">
                🎮
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold text-slate-800">Desafio de Bolso!</h2>
                <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed">
                  Responda 4 perguntas rápidas e veja se você já tem os hábitos de um verdadeiro mestre de poupança!
                </p>
              </div>
              <button
                onClick={handleStartQuiz}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl transition-colors shadow-lg shadow-blue-500/10 cursor-pointer inline-flex items-center justify-center gap-1.5"
                id="btn-start-quiz"
              >
                Começar Desafio
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : quizFinished ? (
            /* Quiz Score Result State */
            <div className="bg-white border border-slate-100 rounded-3xl p-6 text-center space-y-4" id="quiz-result-box">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-xs border border-amber-100 animate-bounce">
                🏆
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-800">Resultado Final</h3>
                <span className="text-blue-600 font-extrabold text-sm block">
                  Você acertou {correctCount} de {QUIZ_QUESTIONS.length} perguntas
                </span>
              </div>

              {/* Rank Container */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left max-w-md mx-auto">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-extrabold text-slate-800 text-sm">
                    {getRank(correctCount).title}
                  </span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {getRank(correctCount).text}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2 justify-center">
                <button
                  onClick={handleStartQuiz}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  id="btn-quiz-retry"
                >
                  <RefreshCw className="w-4 h-4" />
                  Jogar Novamente
                </button>
                <button
                  onClick={() => setActiveSubTab('Dicas')}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Ler Dicas
                </button>
              </div>
            </div>
          ) : (
            /* Quiz Active Question State */
            <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4" id="quiz-active-question-card">
              {/* Quiz Header Info */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="uppercase tracking-wider">Desafio Prático</span>
                <span>Pergunta {currentQuestionIndex + 1} de {QUIZ_QUESTIONS.length}</span>
              </div>

              {/* Progress dots bar */}
              <div className="flex gap-1.5">
                {QUIZ_QUESTIONS.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`flex-1 h-1.5 rounded-full transition-colors ${
                      idx === currentQuestionIndex 
                        ? 'bg-blue-600' 
                        : idx < currentQuestionIndex 
                          ? quizAnswers[idx] ? 'bg-emerald-500' : 'bg-red-500'
                          : 'bg-slate-100'
                    }`}
                  />
                ))}
              </div>

              {/* Question Text */}
              <h3 className="font-extrabold text-slate-800 text-base leading-snug">
                {QUIZ_QUESTIONS[currentQuestionIndex].question}
              </h3>

              {/* Options list */}
              <div className="space-y-2 pt-2" id="quiz-options-list">
                {QUIZ_QUESTIONS[currentQuestionIndex].options.map((opt, optIdx) => {
                  const isSelected = selectedOptionIndex === optIdx;
                  const isCorrectAnswer = optIdx === QUIZ_QUESTIONS[currentQuestionIndex].correctIndex;
                  const hasAnswered = selectedOptionIndex !== null;

                  let optStyle = 'border-slate-100 bg-white hover:border-slate-200 text-slate-700';
                  if (hasAnswered) {
                    if (isCorrectAnswer) {
                      optStyle = 'border-emerald-500 bg-emerald-50/60 text-emerald-950 ring-2 ring-emerald-500/10';
                    } else if (isSelected) {
                      optStyle = 'border-red-500 bg-red-50/60 text-red-950 ring-2 ring-red-500/10';
                    } else {
                      optStyle = 'border-slate-100 bg-white/40 text-slate-400 cursor-not-allowed';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswerOptionClick(optIdx)}
                      disabled={hasAnswered}
                      className={`w-full p-4 rounded-2xl border text-left font-semibold text-xs leading-normal transition-all flex items-start gap-3 cursor-pointer ${optStyle}`}
                      id={`quiz-option-btn-${optIdx}`}
                    >
                      <span className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center font-bold text-[10px] uppercase ${
                        isSelected 
                          ? 'bg-blue-600 text-white' 
                          : hasAnswered && isCorrectAnswer 
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation section if answered */}
              <AnimatePresence>
                {selectedOptionIndex !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1 mt-4">
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {selectedOptionIndex === QUIZ_QUESTIONS[currentQuestionIndex].correctIndex ? (
                          <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Correto!</span>
                        ) : (
                          <span className="text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Resposta Incorreta</span>
                        )}
                      </span>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {QUIZ_QUESTIONS[currentQuestionIndex].explanation}
                      </p>
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl mt-4 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      id="btn-quiz-next-question"
                    >
                      <span>
                        {currentQuestionIndex + 1 === QUIZ_QUESTIONS.length ? 'Ver Resultados' : 'Próxima Pergunta'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
