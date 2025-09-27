import { useState, useEffect } from 'react';
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
    const messages: Record<string, Record<string, string[]>> = {
      sweetVsBitter: {
        sweet: [
          "How delightfully indulgent of you...",
          "Your palate craves life's sweetest pleasures...",
          "Such exquisite appreciation for luxury...",
          "A connoisseur of refined indulgence...",
          "You understand the art of sweet sophistication...",
          "Magnificent taste for the finer things...",
          "Your soul seeks the nectar of elegance...",
          "How beautifully hedonistic of you...",
          "A true devotee of luxurious sweetness...",
          "Your refined palate speaks of pure class..."
        ],
        bitter: [
          "Such sophisticated complexity in your taste...",
          "You appreciate the profound depths of flavor...",
          "How intellectually refined of you...",
          "A true connoisseur of nuanced complexity...",
          "Your palate seeks the mysteries of bitterness...",
          "Such elegant appreciation for the sophisticated...",
          "You understand the poetry of complex flavors...",
          "How wonderfully cerebral your choice...",
          "A devotee of life's more intricate pleasures...",
          "Your taste reveals a deeply cultured soul..."
        ]
      },
      citrusVsStone: {
        citrus: [
          "Ah, a lover of bright, vivacious flavors...",
          "Your spirit dances with sunshine and zest...",
          "How brilliantly effervescent your choice...",
          "You seek the sparkle of life's brightest moments...",
          "Such radiant appreciation for vibrant flavors...",
          "Your palate craves the kiss of golden sunshine...",
          "How delightfully luminous your preference...",
          "A true devotee of life's most brilliant notes...",
          "Your taste buds sing with citrus poetry...",
          "Such electric appreciation for nature's brightness..."
        ],
        stone: [
          "You appreciate the deeper, more mysterious notes...",
          "Your soul seeks the richness of earth's treasures...",
          "How profoundly sensual your selection...",
          "Such elegant appreciation for depth and richness...",
          "You understand the allure of forbidden fruits...",
          "Your palate craves the mysteries of the orchard...",
          "How beautifully complex your preference...",
          "A connoisseur of life's most intimate flavors...",
          "Your taste reveals a deeply passionate nature...",
          "Such sophisticated longing for the profound..."
        ]
      },
      lightVsBoozy: {
        light: [
          "Elegantly refreshing choice...",
          "Your spirit seeks the grace of gentle pleasures...",
          "How beautifully ethereal your preference...",
          "Such refined appreciation for delicate balance...",
          "You understand the art of subtle sophistication...",
          "Your palate dances with airy elegance...",
          "How wonderfully graceful your selection...",
          "A true devotee of life's lighter luxuries...",
          "Your taste speaks of effortless refinement...",
          "Such exquisite appreciation for gentle indulgence..."
        ],
        boozy: [
          "A connoisseur of bold, spirited experiences...",
          "Your soul craves the fire of liquid courage...",
          "How magnificently fearless your choice...",
          "Such powerful appreciation for intensity...",
          "You seek the thunder of spirited adventure...",
          "Your palate demands the full symphony of spirits...",
          "How beautifully audacious your preference...",
          "A true warrior of liquid sophistication...",
          "Your taste reveals an untamed, noble spirit...",
          "Such commanding appreciation for liquid poetry..."
        ]
      },
      classicVsExperimental: {
        classic: [
          "Timeless taste, impeccably refined...",
          "Your soul honors the masters of mixology...",
          "How beautifully traditional your wisdom...",
          "Such elegant reverence for proven perfection...",
          "You understand the poetry of time-tested excellence...",
          "Your palate seeks the comfort of legendary craft...",
          "How wonderfully sophisticated your heritage...",
          "A true guardian of cocktail aristocracy...",
          "Your taste speaks of generational refinement...",
          "Such noble appreciation for eternal elegance..."
        ],
        experimental: [
          "How wonderfully adventurous of you...",
          "Your spirit craves the thrill of discovery...",
          "Such magnificent courage in your exploration...",
          "You seek the frontiers of liquid artistry...",
          "How beautifully bold your pioneering spirit...",
          "Your palate dances with innovative brilliance...",
          "Such fearless appreciation for the unknown...",
          "A true explorer of cocktail possibilities...",
          "Your taste reveals a visionary's soul...",
          "How delightfully rebellious your sophistication..."
        ]
      },
      moodPreference: {
        celebratory: [
          "Ready to toast to life's finest moments...",
          "Your spirit sparkles with joyous anticipation...",
          "How magnificently festive your energy...",
          "Such radiant appreciation for life's victories...",
          "You understand the art of elegant celebration...",
          "Your soul seeks the champagne of existence...",
          "How beautifully effervescent your spirit...",
          "A true maestro of joyful sophistication...",
          "Your heart beats with golden jubilation...",
          "Such luminous appreciation for life's triumphs..."
        ],
        elegant: [
          "Such exquisite refinement in your selection...",
          "Your soul embodies the essence of grace...",
          "How magnificently sophisticated your aura...",
          "Such impeccable appreciation for pure class...",
          "You understand the poetry of refined living...",
          "Your spirit seeks the silk of liquid elegance...",
          "How beautifully aristocratic your preference...",
          "A true embodiment of timeless sophistication...",
          "Your taste reveals a noble, cultured heart...",
          "Such divine appreciation for life's finest arts..."
        ],
        cozy: [
          "You seek the warmth of intimate perfection...",
          "Your soul craves the embrace of liquid comfort...",
          "How beautifully nurturing your choice...",
          "Such tender appreciation for gentle luxury...",
          "You understand the art of soulful indulgence...",
          "Your heart seeks the hearth of liquid warmth...",
          "How wonderfully intimate your preference...",
          "A true devotee of life's softest pleasures...",
          "Your spirit finds solace in liquid poetry...",
          "Such loving appreciation for comfort's embrace..."
        ],
        adventurous: [
          "A spirit that craves delightful surprises...",
          "Your soul dances with fearless curiosity...",
          "How magnificently bold your exploration...",
          "Such thrilling appreciation for the unknown...",
          "You seek the lightning of liquid adventure...",
          "Your palate craves the storm of discovery...",
          "How beautifully wild your sophisticated spirit...",
          "A true pioneer of liquid territories...",
          "Your heart beats with explorer's courage...",
          "Such electric appreciation for life's mysteries..."
        ]
      }
    };
    
    const messageArray = messages[questionId]?.[value];
    if (messageArray && messageArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * messageArray.length);
      return messageArray[randomIndex];
    }
    
    return "Excellent choice...";
  };

  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [showingCompliment, setShowingCompliment] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  // Swipe gesture handling
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentQuestion < questions.length - 1) {
      // Swipe left to go to next question (if answered)
      if (answers[currentQ.id as keyof QuizAnswers]) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }
    
    if (isRightSwipe && currentQuestion > 0) {
      // Swipe right to go to previous question
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 relative"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
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
          {currentQ.options.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(currentQ.id, option.value)}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
                // Haptic feedback for supported devices
                if ('vibrate' in navigator) {
                  navigator.vibrate(10);
                }
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = '';
              }}
              disabled={showingCompliment}
              className={`w-full p-6 rounded-xl bg-gradient-to-r ${option.colorTheme} 
                         text-white font-medium text-xl transition-all duration-300
                         hover:scale-105 hover:shadow-2xl hover:shadow-${option.colorTheme.split('-')[1]}-500/25
                         active:animate-button-press active:shadow-inner
                         disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50
                         transform-gpu will-change-transform
                         animate-slide-up`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                backgroundSize: '200% 200%',
                backgroundImage: `linear-gradient(45deg, var(--tw-gradient-from), var(--tw-gradient-to), var(--tw-gradient-from))`
              }}
            >
              <span className="relative z-10 drop-shadow-sm">
                {option.label}
              </span>
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                            transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                            transition-transform duration-1000 ease-out opacity-0 hover:opacity-100"></div>
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
          <div className="text-center px-8 relative">
            <p className="font-script text-4xl md:text-5xl text-premium-gold animate-handwriting leading-relaxed font-medium drop-shadow-lg">
              {feedbackMessage}
            </p>
            
            {/* Enhanced magical effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Floating sparkles */}
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-magical-glow rounded-full animate-ping opacity-60"></div>
              <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-premium-gold rounded-full animate-pulse delay-500 opacity-80"></div>
              <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-magical-shimmer rounded-full animate-bounce delay-1000 opacity-70"></div>
              <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-magical-glow rounded-full animate-pulse delay-300 opacity-50"></div>
              <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-premium-gold rounded-full animate-ping delay-700 opacity-60"></div>
              
              {/* Magical aura */}
              <div className="absolute inset-0 bg-gradient-radial from-magical-glow/10 via-transparent to-transparent animate-pulse"></div>
              
              {/* Floating particles */}
              <div className="absolute top-1/3 right-1/5 w-0.5 h-0.5 bg-premium-platinum rounded-full animate-float-slow opacity-40"></div>
              <div className="absolute bottom-2/5 left-1/5 w-0.5 h-0.5 bg-magical-shimmer rounded-full animate-float-medium opacity-50"></div>
              <div className="absolute top-3/5 right-2/5 w-0.5 h-0.5 bg-premium-gold rounded-full animate-float-fast opacity-30"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizFlow;