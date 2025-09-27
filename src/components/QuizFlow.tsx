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
  const [showingCompliment, setShowingCompliment] = useState<boolean>(false);

  const handleAnswer = (questionId: string, value: string) => {
    const message = getComplimentaryMessage(questionId, value);
    
    // Start the magical compliment sequence
    setShowingCompliment(true);
    setFeedbackMessage(message);
    
    // After compliment animation completes, proceed to next question
    setTimeout(() => {
      const newAnswers = { 
        ...answers, 
        [questionId as keyof QuizAnswers]: value as any 
      };
      setLocalAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setFeedbackMessage("");
        setShowingCompliment(false);
      } else {
        // Quiz complete - pass answers to context
        setAnswers(newAnswers);
        navigate('/results');
      }
    }, 2500); // Extended time for the magical moment
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Main quiz content */}
      <div className={`max-w-2xl mx-auto text-center transition-all duration-700 ${
        showingCompliment ? 'opacity-20 blur-sm scale-95' : 'opacity-100 blur-none scale-100'
      }`}>
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
              disabled={showingCompliment}
              className={`w-full p-6 rounded-xl bg-gradient-to-r ${option.colorTheme} 
                         text-white font-medium text-xl transition-all duration-300
                         hover:scale-105 hover:shadow-xl active:scale-95
                         disabled:cursor-not-allowed disabled:transform-none`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Subtle encouragement when not showing compliment */}
        {!showingCompliment && (
          <div className="mt-8 h-8 flex items-center justify-center">
            <p className="text-premium-silver/70 text-lg">
              Excellent taste in considering your options...
            </p>
          </div>
        )}
      </div>

      {/* Magical compliment overlay */}
      {showingCompliment && feedbackMessage && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center px-8">
            <p className="font-script text-4xl md:text-5xl text-premium-gold animate-handwriting leading-relaxed font-medium">
              {feedbackMessage}
            </p>
            {/* Magical sparkles */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-magical-glow rounded-full animate-ping opacity-60"></div>
              <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-premium-gold rounded-full animate-pulse delay-500 opacity-80"></div>
              <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-magical-shimmer rounded-full animate-bounce delay-1000 opacity-70"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizFlow;