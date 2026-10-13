import { Tip, QuizQuestion } from '../types';

export const INITIAL_TIPS: Tip[] = [
  {
    id: 'tip-1',
    title: 'O que é o Programa Pé-de-Meia?',
    shortDescription: 'Entenda como funciona a poupança do ensino médio e como usá-la com sabedoria.',
    content: 'O Pé-de-Meia é um programa de incentivo financeiro-educacional, na modalidade de poupança, destinado a promover a permanência e a conclusão escolar de estudantes matriculados no ensino médio público. Ele oferece um incentivo mensal de R$ 200,00 que pode ser sacado, além de bônus por aprovação e participação no Enem. Usar esse dinheiro para construir uma reserva de emergência ou investir em seus estudos (cursos, livros, materiais) é um excelente primeiro passo para sua independência financeira!',
    readTime: '3 min de leitura',
    badge: 'Pé-de-Meia'
  },
  {
    id: 'tip-2',
    title: 'A Regra dos 50-30-20 para Estudantes',
    shortDescription: 'Um método simples para dividir seu dinheiro sem passar sufoco.',
    content: 'Para quem está começando a controlar o próprio dinheiro, a regra 50-30-20 é perfeita! Ela propõe dividir sua renda (como o auxílio Pé-de-Meia) em três partes:\n\n• 50% para Necessidades (alimentação na escola, transporte, xerox).\n• 30% para Desejos (jogos, passeios, lanches com amigos).\n• 20% para Poupança ou Investimentos futuros (guardar para a faculdade, curso profissionalizante ou celular novo).\n\nAdaptando para a realidade do estudante: de R$ 200,00, seriam R$ 100,00 para necessidades, R$ 60,00 para diversão e R$ 40,00 guardados todo mês!',
    readTime: '4 min de leitura',
    badge: 'Economia'
  },
  {
    id: 'tip-3',
    title: 'Cuidado com os Gastos Invisíveis',
    shortDescription: 'Como pequenas compras diárias podem devorar todo o seu saldo.',
    content: 'Sabe aquele chocolate de R$ 5,00 na saída da escola, ou aquela assinatura de streaming que você quase não usa? Esses são os gastos invisíveis. R$ 5,00 por dia letivo parecem pouco, mas em um mês de aula (20 dias) isso soma R$ 100,00! Ou seja, metade do seu saldo do Pé-de-Meia vai embora sem você perceber. Registre tudo aqui no app e descubra para onde está indo o seu dinheiro.',
    readTime: '3 min de leitura',
    badge: 'Dicas Práticas'
  },
  {
    id: 'tip-4',
    title: 'Juros Compostos: O Segredo do Tempo',
    shortDescription: 'Como fazer o dinheiro trabalhar para você enquanto você estuda.',
    content: 'Juros compostos são "juros sobre juros". Quando você guarda dinheiro na poupança ou em uma conta de rendimento 100% CDI, o rendimento do mês seguinte é calculado em cima do valor total acumulado, e não apenas do que você colocou originalmente. Quanto mais cedo você começar a poupar, mesmo que seja R$ 20,00 por mês, maior será o efeito bola de neve no futuro. O tempo é o melhor amigo do investidor iniciante!',
    readTime: '5 min de leitura',
    badge: 'Investimentos'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    question: 'Se você recebe R$ 200,00 por mês e decide economizar 20% desse valor, quanto você terá guardado após 6 meses (sem contar rendimentos)?',
    options: [
      'R$ 120,00',
      'R$ 240,00',
      'R$ 400,00',
      'R$ 60,00'
    ],
    correctIndex: 1,
    explanation: '20% de R$ 200,00 é R$ 40,00 por mês. Multiplicando R$ 40,00 por 6 meses, temos R$ 240,00 economizados!'
  },
  {
    id: 'q-2',
    question: 'Qual das seguintes opções representa um "gasto invisível" ou formiga?',
    options: [
      'A mensalidade da internet da sua casa',
      'A passagem de ônibus diária para ir à escola',
      'O cafezinho ou docinho comprado quase todo dia na cantina',
      'A inscrição em um vestibular ou concurso'
    ],
    correctIndex: 2,
    explanation: 'Gastos formiga são pequenas despesas diárias que parecem insignificantes, como doces ou lanches rápidos de impulso, mas acumulam um valor alto no final do mês.'
  },
  {
    id: 'q-3',
    question: 'O que significa criar uma "Reserva de Emergência"?',
    options: [
      'Guardar dinheiro para comprar o jogo de videogame no lançamento',
      'Ter um valor guardado para cobrir imprevistos (como consertar o celular ou comprar um remédio)',
      'Pedir dinheiro emprestado para amigos no fim do mês',
      'Gastar todo o saldo antes que o mês termine'
    ],
    correctIndex: 1,
    explanation: 'A reserva de emergência serve justamente para dar segurança financeira diante de imprevistos cotidianos, evitando que você precise fazer dívidas ou pedir empréstimos.'
  },
  {
    id: 'q-4',
    question: 'Se você deixar seu dinheiro guardado em uma conta que rende 100% do CDI, o que acontece com ele?',
    options: [
      'Ele perde valor todos os dias e some',
      'Ele fica exatamente com o mesmo valor para sempre',
      'Ele rende um valor diário ligado à taxa básica de juros, crescendo com juros compostos',
      'Ele só pode ser retirado daqui a 10 anos'
    ],
    correctIndex: 2,
    explanation: 'As contas que rendem 100% do CDI rendem diariamente de forma muito próxima à taxa Selic, sendo uma opção segura de liquidez diária que faz seu dinheiro render juros compostos.'
  }
];
