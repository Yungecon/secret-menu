import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../hooks';
import { QuizAnswers, QuizQuestion } from '../../types';
import { trackQuizStart, trackQuestionAnswered, trackQuizCompleted } from '../../services/analytics';
import { playButtonPress, playComplimentReveal, playQuizComplete } from '../../services/soundEffects';

import { ANIMATION_DELAYS } from '../../constants';

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
        { label: 'Sweet & Luxurious', value: 'sweet', colorTheme: 'from-luxury-rose to-luxury-blush', tags: ['sweet', 'luxurious'] },
        { label: 'Bitter & Sophisticated', value: 'bitter', colorTheme: 'from-luxury-brass to-luxury-bronze', tags: ['bitter', 'sophisticated'] },
        { label: 'Balanced & Harmonious', value: 'balanced', colorTheme: 'from-luxury-emerald to-luxury-jade', tags: ['balanced', 'harmonious'] }
      ]
    },
    {
      id: 'citrusVsStone',
      question: 'Which fruit family calls to you?',
      category: 'flavor',
      options: [
        { label: 'Citrus & Bright', value: 'citrus', colorTheme: 'from-luxury-gold to-luxury-champagne', tags: ['citrus', 'bright'] },
        { label: 'Stone Fruit & Rich', value: 'stone', colorTheme: 'from-luxury-rose-dark to-luxury-rose', tags: ['stone', 'rich'] },
        { label: 'Tropical & Exotic', value: 'tropical', colorTheme: 'from-luxury-emerald to-luxury-mint', tags: ['tropical', 'exotic'] }
      ]
    },
    {
      id: 'lightVsBoozy',
      question: 'How do you prefer to indulge?',
      category: 'style',
      options: [
        { label: 'Light & Refreshing', value: 'light', colorTheme: 'from-luxury-emerald to-luxury-mint', tags: ['light', 'refreshing'] },
        { label: 'Bold & Spirit-Forward', value: 'boozy', colorTheme: 'from-luxury-brass to-luxury-antique', tags: ['boozy', 'spirit-forward'] },
        { label: 'Medium & Versatile', value: 'medium', colorTheme: 'from-luxury-platinum to-luxury-pearl', tags: ['medium', 'versatile'] }
      ]
    },
    {
      id: 'classicVsExperimental',
      question: 'What draws your adventurous spirit?',
      category: 'style',
      options: [
        { label: 'Classic & Timeless', value: 'classic', colorTheme: 'from-luxury-platinum to-luxury-pearl', tags: ['classic', 'timeless'] },
        { label: 'Modern & Refined', value: 'modern', colorTheme: 'from-luxury-gold to-luxury-brass-light', tags: ['modern', 'refined'] },
        { label: 'Experimental & Bold', value: 'experimental', colorTheme: 'from-luxury-jade to-luxury-emerald', tags: ['experimental', 'bold'] }
      ]
    },
    {
      id: 'moodPreference',
      question: 'What mood shall we craft for you?',
      category: 'mood',
      options: [
        { label: 'Celebratory & Joyful', value: 'celebratory', colorTheme: 'from-luxury-gold to-luxury-brass-light', tags: ['celebratory', 'joyful'] },
        { label: 'Elegant & Refined', value: 'elegant', colorTheme: 'from-luxury-rose to-luxury-rose-dark', tags: ['elegant', 'refined'] },
        { label: 'Cozy & Intimate', value: 'cozy', colorTheme: 'from-luxury-brass to-luxury-bronze', tags: ['cozy', 'intimate'] },
        { label: 'Adventurous & Playful', value: 'adventurous', colorTheme: 'from-luxury-emerald to-luxury-jade', tags: ['adventurous', 'playful'] }
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
        ],
        balanced: [
          "How beautifully harmonious your approach...",
          "Your palate seeks the perfect equilibrium...",
          "Such sophisticated appreciation for balance...",
          "You understand the art of refined moderation...",
          "How elegantly measured your taste...",
          "Your spirit craves the symphony of perfect harmony...",
          "Such wise appreciation for life's gentle balance...",
          "A true connoisseur of sophisticated restraint...",
          "Your taste reveals a soul of perfect poise...",
          "How magnificently centered your preference..."
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
        ],
        tropical: [
          "How wonderfully exotic your taste...",
          "Your spirit craves the magic of distant shores...",
          "Such adventurous appreciation for tropical paradise...",
          "You seek the sunshine of island dreams...",
          "How beautifully vibrant your preference...",
          "Your palate dances with tropical rhythms...",
          "Such magnificent longing for paradise...",
          "A true explorer of exotic flavors...",
          "Your taste reveals a wanderer's soul...",
          "How delightfully adventurous your spirit..."
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
        ],
        medium: [
          "How beautifully versatile your approach...",
          "Your palate seeks the perfect middle ground...",
          "Such sophisticated appreciation for adaptability...",
          "You understand the art of refined versatility...",
          "How elegantly balanced your preference...",
          "Your spirit craves the harmony of perfect moderation...",
          "Such wise appreciation for life's flexible pleasures...",
          "A true connoisseur of sophisticated adaptability...",
          "Your taste reveals a soul of perfect versatility...",
          "How magnificently adaptable your spirit..."
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
        ],
        modern: [
          "How beautifully contemporary your taste...",
          "Your spirit embraces the elegance of today...",
          "Such sophisticated appreciation for modern refinement...",
          "You understand the art of contemporary sophistication...",
          "How elegantly current your preference...",
          "Your palate seeks the harmony of modern excellence...",
          "Such wise appreciation for refined innovation...",
          "A true connoisseur of sophisticated modernity...",
          "Your taste reveals a soul of perfect contemporary grace...",
          "How magnificently refined your modern spirit..."
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
  const [quizStartTime] = useState<number>(Date.now());

  const handleAnswer = (questionId: string, value: string) => {
    // Play button press sound
    playButtonPress();
    
    // Track the answer
    trackQuestionAnswered(questionId, value, currentQuestion + 1);
    
    const message = getComplimentaryMessage(questionId, value);
    
    // Start the magical compliment sequence
    setShowingCompliment(true);
    setFeedbackMessage(message);
    
    // Play compliment reveal sound after a brief delay
    setTimeout(() => {
      playComplimentReveal();
    }, ANIMATION_DELAYS.SHORT);
    
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
        // Quiz complete - play completion sound and track
        playQuizComplete();
        const completionTime = Date.now() - quizStartTime;
        trackQuizCompleted(questions.length, completionTime);
        setAnswers(newAnswers);
        navigate('/results');
      }
    }, ANIMATION_DELAYS.COMPLIMENT);
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
      const currentQuestionId = questions[currentQuestion].id;
      if (answers[currentQuestionId as keyof QuizAnswers]) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }
    
    if (isRightSwipe && currentQuestion > 0) {
      // Swipe right to go to previous question
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Track quiz start on component mount
  useEffect(() => {
    trackQuizStart();
  }, []);

  const currentQ = questions[currentQuestion];

  // Function to get luxury theme classes based on option index
  const getLuxuryTheme = (optionIndex: number) => {
    const themes = [
      { hover: 'luxury-hover-gold', glow: 'gemstone-glow-gold', text: 'text-luxury-obsidian' },
      { hover: 'luxury-hover-emerald', glow: 'gemstone-glow-emerald', text: 'text-luxury-pearl' },
      { hover: 'luxury-hover-brass', glow: 'gemstone-glow-brass', text: 'text-luxury-pearl' },
      { hover: 'luxury-hover-rose', glow: 'gemstone-glow-rose', text: 'text-luxury-obsidian' },
      { hover: 'luxury-hover-gold', glow: 'gemstone-glow-gold', text: 'text-luxury-obsidian' }
    ];
    
    // Cycle through themes based on option index
    return themes[optionIndex % themes.length];
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 relative bg-gradient-to-br from-luxury-obsidian via-luxury-charcoal to-luxury-obsidian"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Main quiz content */}
      <div className={`max-w-2xl mx-auto text-center transition-all duration-700 luxury-card p-8 ${
        showingCompliment ? 'opacity-20 blur-sm scale-95' : 'opacity-100 blur-none scale-100'
      }`}>
        {/* Enhanced Progress indicator */}
        <div className="mb-8">

          {/* Progress dots */}
          <div className="flex justify-center items-center space-x-3 mb-6">
            {questions.map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`relative w-4 h-4 rounded-full transition-all duration-500 ${
                    index < currentQuestion 
                      ? 'bg-luxury-gold shadow-lg shadow-luxury-gold/50' 
                      : index === currentQuestion
                      ? 'bg-magical-glow shadow-lg shadow-magical-glow/50 animate-pulse'
                      : 'bg-luxury-platinum/30'
                  }`}
                >
                  {/* Completed checkmark */}
                  {index < currentQuestion && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-luxury-obsidian" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Current question glow */}
                  {index === currentQuestion && (
                    <div className="absolute inset-0 rounded-full bg-magical-glow animate-ping opacity-30"></div>
                  )}
                </div>
                
                {/* Connection line */}
                {index < questions.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 transition-all duration-500 ${
                    index < currentQuestion 
                      ? 'bg-luxury-gold' 
                      : 'bg-luxury-platinum/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Progress text with percentage */}
          <div className="text-center">
            <p className="text-luxury-pearl/60 text-sm mb-1">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <div className="w-48 h-1 bg-luxury-platinum/20 rounded-full mx-auto overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-magical-shimmer to-magical-glow rounded-full transition-all duration-700 ease-out"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
            <p className="text-magical-glow text-xs mt-2 font-medium">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
            </p>
          </div>
        </div>

        {/* Previous Questions and Answers */}
        {currentQuestion > 0 && (
          <div className="mb-12 space-y-8 luxury-card-gold p-6 rounded-xl">
            {questions.slice(0, currentQuestion).map((question, index) => {
              const answer = answers[question.id as keyof QuizAnswers];
              const selectedOption = question.options.find(opt => opt.value === answer);
              
              // Define shiny text colors for each answer
              const shinyColors = [
                'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500',
                'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500',
                'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500',
                'text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600',
                'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-pink-500'
              ];
              
              return (
                <div key={question.id} className="text-center">
                  <h3 className="font-elegant text-2xl md:text-3xl font-medium mb-3 text-luxury-pearl/80">
                    {question.question}
                  </h3>
                  <p className={`font-medium text-xl md:text-2xl ${shinyColors[index % shinyColors.length]} 
                                animate-shimmer bg-[length:200%_100%] drop-shadow-lg`}>
                    {selectedOption?.label || answer}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Current Question with enhanced animation */}
        <h2 
          key={`current-question-${currentQuestion}`} // Force re-render for animation
          className="font-elegant text-4xl md:text-5xl font-semibold mb-12 text-luxury-pearl animate-slide-up luxury-text-gold"
        >
          {currentQ.question}
        </h2>

        {/* Answer options with enhanced animations */}
        <div key={`options-${currentQuestion}`} className="space-y-6">
          {currentQ.options.map((option, optionIndex) => {
            const luxuryTheme = getLuxuryTheme(optionIndex);
            return (
            <button
              key={option.value}
              onClick={() => handleAnswer(currentQ.id, option.value)}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
                e.currentTarget.style.filter = 'brightness(1.1)';
                // Haptic feedback for supported devices
                if ('vibrate' in navigator) {
                  navigator.vibrate(10);
                }
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.filter = '';
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
                e.currentTarget.style.filter = 'brightness(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.filter = '';
              }}
              disabled={showingCompliment}
              className={`w-full p-6 rounded-xl bg-gradient-to-r ${option.colorTheme} 
                         ${luxuryTheme.text} font-medium text-xl transition-all duration-300
                         hover:scale-105 hover:shadow-2xl ${luxuryTheme.hover}
                         active:animate-button-press active:shadow-inner
                         disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50
                         transform-gpu will-change-transform
                         animate-slide-up ${luxuryTheme.glow}`}
              style={{ 
                animationDelay: `${optionIndex * 100}ms`,
                backgroundSize: '200% 200%',
                backgroundImage: `linear-gradient(45deg, var(--tw-gradient-from), var(--tw-gradient-to), var(--tw-gradient-from))`
              }}
            >
              <span className="relative z-10 drop-shadow-sm">
                {option.label}
              </span>
              {/* Luxury shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent 
                            transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                            transition-transform duration-1000 ease-out opacity-0 hover:opacity-100"></div>
            </button>
            );
          })}
        </div>

        {/* Subtle encouragement when not showing compliment */}
        {!showingCompliment && (
          <div className="mt-8 h-8 flex items-center justify-center">
            <p className="text-luxury-pearl/70 text-lg">
              Excellent taste in considering your options...
            </p>
          </div>
        )}
      </div>

      {/* Magical compliment overlay */}
      {showingCompliment && feedbackMessage && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center px-8 relative">
            <p className="font-script text-4xl md:text-5xl text-luxury-gold animate-handwriting leading-relaxed font-medium drop-shadow-lg">
              {feedbackMessage}
            </p>
            
            {/* Enhanced magical effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Floating sparkles */}
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-magical-glow rounded-full animate-ping opacity-60"></div>
              <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-luxury-gold rounded-full animate-pulse delay-500 opacity-80"></div>
              <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-magical-shimmer rounded-full animate-bounce delay-1000 opacity-70"></div>
              <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-magical-glow rounded-full animate-pulse delay-300 opacity-50"></div>
              <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-luxury-gold rounded-full animate-ping delay-700 opacity-60"></div>
              
              {/* Magical aura */}
              <div className="absolute inset-0 bg-gradient-radial from-magical-glow/10 via-transparent to-transparent animate-pulse"></div>
              
              {/* Floating particles */}
              <div className="absolute top-1/3 right-1/5 w-0.5 h-0.5 bg-luxury-platinum rounded-full animate-float-slow opacity-40"></div>
              <div className="absolute bottom-2/5 left-1/5 w-0.5 h-0.5 bg-magical-shimmer rounded-full animate-float-medium opacity-50"></div>
              <div className="absolute top-3/5 right-2/5 w-0.5 h-0.5 bg-luxury-gold rounded-full animate-float-fast opacity-30"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizFlow;