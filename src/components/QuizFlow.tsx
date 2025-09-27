import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';

const QuizFlow = () => {
  const navigate = useNavigate();
  const { setAnswers } = useQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setLocalAnswers] = useState<Record<string, string>>({});

  // Placeholder questions - will be expanded in implementation
  const questions = [
    {
      id: 'sweetVsBitter',
      question: 'What speaks to your refined palate?',
      options: [
        { label: 'Sweet & Luxurious', value: 'sweet', colorTheme: 'from-pink-500 to-rose-400' },
        { label: 'Bitter & Sophisticated', value: 'bitter', colorTheme: 'from-amber-600 to-orange-500' }
      ]
    },
    {
      id: 'lightVsBoozy',
      question: 'How do you prefer to indulge?',
      options: [
        { label: 'Light & Refreshing', value: 'light', colorTheme: 'from-blue-400 to-cyan-300' },
        { label: 'Bold & Spirit-Forward', value: 'boozy', colorTheme: 'from-red-600 to-red-500' }
      ]
    }
  ];

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setLocalAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz complete
      setAnswers(newAnswers);
      navigate('/results');
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center animate-slide-up">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-center space-x-2 mb-4">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentQuestion 
                    ? 'bg-magical-glow' 
                    : 'bg-premium-silver/30'
                }`}
              />
            ))}
          </div>
          <p className="text-premium-silver/60 text-sm">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        {/* Question */}
        <h2 className="font-elegant text-4xl md:text-5xl font-semibold mb-12 text-premium-platinum">
          {currentQ.question}
        </h2>

        {/* Answer options */}
        <div className="space-y-6">
          {currentQ.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(currentQ.id, option.value)}
              className={`w-full p-6 rounded-xl bg-gradient-to-r ${option.colorTheme} 
                         text-white font-medium text-xl transition-all duration-300
                         hover:scale-105 hover:shadow-xl active:scale-95`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Encouraging message */}
        <p className="text-premium-silver/70 mt-8 text-lg">
          Excellent taste in considering your options...
        </p>
      </div>
    </div>
  );
};

export default QuizFlow;