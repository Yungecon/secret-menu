import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { QuizAnswers, QuizQuestion } from '../types';

const QuizFlow = () => {
  const navigate = useNavigate();
  const { setAnswers } = useQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setLocalAnswers] = useState<QuizAnswers>({});

  const questions: QuizQuestion[] = [
    {
      id: 'sweetVsBitter',
      question: 'What speaks to your refined palate?',
      category: 'flavor',
      options: [
        { label: 'Sweet & Luxurious', value: 'sweet', colorTheme: 'from-pink-500 to-rose-400', tags: ['sweet', 'luxurious'] },
        { label: 'Bitter & Sophisticated', value: 'bitter', colorTheme: 'from-amber-600 to-orange-500', tags: ['bitter', 'sophisticated'] }
      ]
    },
    {
      id: 'citrusVsStone',
      question: 'Which fruit family calls to you?',
      category: 'flavor',
      options: [
        { label: 'Citrus & Bright', value: 'citrus', colorTheme: 'from-yellow-400 to-orange-400', tags: ['citrus', 'bright'] },
        { label: 'Stone Fruit & Rich', value: 'stone', colorTheme: 'from-purple-500 to-pink-500', tags: ['stone', 'rich'] }
      ]
    },
    {
      id: 'lightVsBoozy',
      question: 'How do you prefer to indulge?',
      category: 'style',
      options: [
        { label: 'Light & Refreshing', value: 'light', colorTheme: 'from-blue-400 to-cyan-300', tags: ['light', 'refreshing'] },
        { label: 'Bold & Spirit-Forward', value: 'boozy', colorTheme: 'from-red-600 to-red-500', tags: ['boozy', 'spirit-forward'] }
      ]
    },
    {
      id: 'classicVsExperimental',
      question: 'What draws your adventurous spirit?',
      category: 'style',
      options: [
        { label: 'Classic & Timeless', value: 'classic', colorTheme: 'from-gray-600 to-gray-500', tags: ['classic', 'timeless'] },
        { label: 'Experimental & Bold', value: 'experimental', colorTheme: 'from-purple-600 to-indigo-600', tags: ['experimental', 'bold'] }
      ]
    },
    {
      id: 'moodPreference',
      question: 'What mood shall we craft for you?',
      category: 'mood',
      options: [
        { label: 'Celebratory & Joyful', value: 'celebratory', colorTheme: 'from-green-500 to-emerald-400', tags: ['celebratory', 'joyful'] },
        { label: 'Elegant & Refined', value: 'elegant', colorTheme: 'from-indigo-500 to-purple-500', tags: ['elegant', 'refined'] },
        { label: 'Cozy & Intimate', value: 'cozy', colorTheme: 'from-orange-500 to-red-500', tags: ['cozy', 'intimate'] },
        { label: 'Adventurous & Playful', value: 'adventurous', colorTheme: 'from-teal-500 to-cyan-500', tags: ['adventurous', 'playful'] }
      ]
    }
  ];

  const getComplimentaryMessage = (questionId: string, value: string): string => {
    const messages: Record<string, Record<string, string>> = {
      sweetVsBitter: {
        sweet: "How delightfully indulgent of you...",
        bitter: "Such sophisticated complexity in your taste..."
      },
      citrusVsStone: {
        citrus: "Ah, a lover of bright, vivacious flavors...",
        stone: "You appreciate the deeper, more mysterious notes..."
      },
      lightVsBoozy: {
        light: "Elegantly refreshing choice...",
        boozy: "A connoisseur of bold, spirited experiences..."
      },
      classicVsExperimental: {
        classic: "Timeless taste, impeccably refined...",
        experimental: "How wonderfully adventurous of you..."
      },
      moodPreference: {
        celebratory: "Ready to toast to life's finest moments...",
        elegant: "Such exquisite refinement in your selection...",
        cozy: "You seek the warmth of intimate perfection...",
        adventurous: "A spirit that craves delightful surprises..."
      }
    };
    
    return messages[questionId]?.[value] || "Excellent choice...";
  };

  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  const handleAnswer = (questionId: string, value: string) => {
    const message = getComplimentaryMessage(questionId, value);
    setFeedbackMessage(message);
    
    // Brief pause to show the compliment
    setTimeout(() => {
      const newAnswers = { 
        ...answers, 
        [questionId as keyof QuizAnswers]: value as any 
      };
      setLocalAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setFeedbackMessage("");
      } else {
        // Quiz complete - pass answers to context
        setAnswers(newAnswers);
        navigate('/results');
      }
    }, 1200);
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

        {/* Dynamic feedback message */}
        <div className="mt-8 h-8 flex items-center justify-center">
          {feedbackMessage ? (
            <p className="text-magical-glow text-lg animate-fade-in font-medium">
              {feedbackMessage}
            </p>
          ) : (
            <p className="text-premium-silver/70 text-lg">
              Excellent taste in considering your options...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizFlow;