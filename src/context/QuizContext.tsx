import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QuizAnswers } from '../types';

interface QuizContextType {
  answers: QuizAnswers;
  setAnswers: (answers: QuizAnswers) => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const resetQuiz = () => {
    setAnswers({});
  };

  return (
    <QuizContext.Provider value={{
      answers,
      setAnswers,
      resetQuiz
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};