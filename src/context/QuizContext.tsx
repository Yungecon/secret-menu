import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QuizAnswers, RecommendationResult } from '../types';

interface QuizContextType {
  answers: QuizAnswers;
  setAnswers: (answers: QuizAnswers) => void;
  recommendations: RecommendationResult | null;
  setRecommendations: (recommendations: RecommendationResult) => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);

  const resetQuiz = () => {
    setAnswers({});
    setRecommendations(null);
  };

  return (
    <QuizContext.Provider value={{
      answers,
      setAnswers,
      recommendations,
      setRecommendations,
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