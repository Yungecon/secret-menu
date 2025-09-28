import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SlotReel from './SlotReel';
import { 
  FLAVOR_ATTRIBUTES, 
  MOOD_ATTRIBUTES, 
  STYLE_ATTRIBUTES,
  SlotMachineResult,
  convertSlotToQuizAnswers
} from '../../utils/slotMachineAttributes';
import { generateRecommendations, resetRecentlyShownCocktails } from '../../services/recommendationEngine';
import { RecommendationResult } from '../../types';
import { StandardCocktailCard } from '../ui/StandardCocktailCard';

interface ReelState {
  isSpinning: boolean;
  selectedAttribute?: string;
}

const SlotMachine = () => {
  const navigate = useNavigate();
  // Force rebuild - full slot machine functionality
  
  const [reelStates, setReelStates] = useState<ReelState[]>([
    { isSpinning: true },
    { isSpinning: true },
    { isSpinning: true }
  ]);
  
  const [gameState, setGameState] = useState<'spinning' | 'stopping' | 'complete' | 'results'>('spinning');
  const [currentTap, setCurrentTap] = useState(0);
  const [slotResult, setSlotResult] = useState<SlotMachineResult | null>(null);
  const [cocktailResult, setCocktailResult] = useState<RecommendationResult | null>(null);
  
  // Auto-selection timer state
  const [countdown, setCountdown] = useState(6);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Start countdown timer when game begins
  const startCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    
    setCountdown(6);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Auto-stop current reel when countdown reaches 0
          if (gameState === 'spinning' && currentTap < 3) {
            setGameState('stopping');
            setReelStates(prevReels => prevReels.map((reel, index) => 
              index === currentTap 
                ? { ...reel, isSpinning: false }
                : reel
            ));
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [gameState, currentTap]);


  // Handle tap to stop current reel
  const handleTap = useCallback(() => {
    if (gameState !== 'spinning' || currentTap >= 3) return;

    // Clear countdown timer when user manually taps
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    setGameState('stopping');
    
    // Stop the current reel
    setReelStates(prev => prev.map((reel, index) => 
      index === currentTap 
        ? { ...reel, isSpinning: false }
        : reel
    ));
  }, [gameState, currentTap]);

  // Handle when a reel stops and selects an attribute
  const handleReelStop = useCallback((reelIndex: number, selectedAttribute: string) => {
    setReelStates(prev => prev.map((reel, index) => 
      index === reelIndex 
        ? { ...reel, selectedAttribute }
        : reel
    ));

    const nextTap = currentTap + 1;
    setCurrentTap(nextTap);

    if (nextTap < 3) {
      // More reels to stop, return to spinning state and restart countdown
      setGameState('spinning');
      startCountdown();
    } else {
      // All reels stopped, create final result
      const updatedStates = [...reelStates];
      updatedStates[reelIndex] = { ...updatedStates[reelIndex], selectedAttribute };
      
      // Check if we have all three attributes
      const flavor = updatedStates[0].selectedAttribute;
      const mood = updatedStates[1].selectedAttribute;
      const style = updatedStates[2].selectedAttribute;
      
      if (flavor && mood && style) {
        const result: SlotMachineResult = {
          flavor,
          mood,
          style,
          timestamp: Date.now()
        };
        
        setSlotResult(result);
        setGameState('complete');

        // Clear countdown timer when game is complete
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }

        // Generate cocktail recommendation using slot machine attributes
        setTimeout(async () => {
          // Reset recently shown cocktails for fresh results
          resetRecentlyShownCocktails();
          
          const quizAnswers = convertSlotToQuizAnswers(result);
          const recommendation = await generateRecommendations(quizAnswers);
          setCocktailResult(recommendation);
          setGameState('results');
        }, 1500);
      }
    }
  }, [currentTap, reelStates, startCountdown]);

  // Reset for new spin
  const spinAgain = useCallback(() => {
    setGameState('spinning');
    setCurrentTap(0);
    setSlotResult(null);
    setCocktailResult(null);
    setReelStates([
      { isSpinning: true },
      { isSpinning: true },
      { isSpinning: true }
    ]);
    
    // Clear any existing countdown and start new one
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    startCountdown();
  }, [startCountdown]);

  // Start countdown timer when component mounts
  useEffect(() => {
    if (gameState === 'spinning') {
      startCountdown();
    }
    
    // Cleanup timer on unmount
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [startCountdown, gameState]);

  const getInstructionText = () => {
    if (gameState === 'spinning') {
      return `Tap the glowing reel to stop it (${currentTap + 1} of 3) - Auto-stops in ${countdown}s`;
    }
    if (gameState === 'stopping') return 'Reel stopping...';
    if (gameState === 'complete') return 'The reels have aligned! 🎰';
    if (gameState === 'results') return 'Your perfect cocktail awaits! 🍸';
    return '';
  };

  const getReelAttributes = (reelIndex: number) => {
    switch (reelIndex) {
      case 0: return Array.from(FLAVOR_ATTRIBUTES);
      case 1: return Array.from(MOOD_ATTRIBUTES);
      case 2: return Array.from(STYLE_ATTRIBUTES);
      default: return [];
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-premium-black">
      <div className="text-center max-w-6xl mx-auto relative z-10">
        {/* Premium Title */}
        <div className="mb-8">
          <h1 className="font-elegant text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-premium-gold via-premium-silver to-premium-gold bg-clip-text text-transparent">
            Secret Shuffle
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-premium-gold to-transparent mx-auto"></div>
        </div>

        {/* Instructions */}
        <div className="mb-8">
          <p className="text-premium-silver text-xl mb-4">
            Let the reels decide your cocktail destiny
          </p>
          <p className="text-premium-gold text-lg font-medium animate-pulse">
            {getInstructionText()}
          </p>
          
          {/* Countdown Timer */}
          {gameState === 'spinning' && countdown > 0 && (
            <div className="mt-4 flex items-center justify-center">
              <div className="bg-premium-dark/50 border border-premium-gold/30 rounded-full px-6 py-2">
                <div className="flex items-center gap-2">
                  <div className={`text-2xl font-bold ${countdown <= 3 ? 'text-red-400 animate-pulse' : 'text-premium-gold'}`}>
                    {countdown}
                  </div>
                  <div className="text-premium-silver text-sm">
                    seconds until auto-select
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Slot Machine Interface */}
        <div className="bg-premium-dark/30 backdrop-blur-sm border border-premium-silver/20 rounded-3xl p-8 mb-8 slot-machine-glow">
          {/* Reel Labels */}
          <div className="flex justify-center gap-8 md:gap-16 mb-6">
            <div className="text-center">
              <h3 className="text-premium-gold text-sm font-semibold mb-2">FLAVORS</h3>
              <div className="w-16 h-px bg-premium-gold/50"></div>
            </div>
            <div className="text-center">
              <h3 className="text-premium-gold text-sm font-semibold mb-2">MOODS</h3>
              <div className="w-16 h-px bg-premium-gold/50"></div>
            </div>
            <div className="text-center">
              <h3 className="text-premium-gold text-sm font-semibold mb-2">STYLES</h3>
              <div className="w-16 h-px bg-premium-gold/50"></div>
            </div>
          </div>

          {/* Three Reels */}
          <div className="flex justify-center gap-8 md:gap-16 mb-8">
            {reelStates.map((reel, index) => (
              <SlotReel
                key={index}
                attributes={getReelAttributes(index)}
                isSpinning={reel.isSpinning}
                onStop={(attribute) => handleReelStop(index, attribute)}
                reelIndex={index}
                disabled={gameState === 'spinning' && index !== currentTap}
                canTap={gameState === 'spinning' && index === currentTap}
                onTap={handleTap}
              />
            ))}
          </div>

          {/* Results Display */}
          {gameState === 'complete' && slotResult && (
            <div className="bg-premium-dark/50 border border-premium-gold/30 rounded-2xl p-6 mb-6 animate-fade-in">
              <h3 className="text-premium-gold text-xl font-semibold mb-4">
                ✨ Your Combination ✨
              </h3>
              <div className="flex justify-center gap-4 text-premium-silver">
                <span className="bg-premium-dark/70 px-4 py-2 rounded-lg border border-premium-silver/20 capitalize">
                  {slotResult.flavor}
                </span>
                <span className="text-premium-gold text-xl">+</span>
                <span className="bg-premium-dark/70 px-4 py-2 rounded-lg border border-premium-silver/20 capitalize">
                  {slotResult.mood}
                </span>
                <span className="text-premium-gold text-xl">+</span>
                <span className="bg-premium-dark/70 px-4 py-2 rounded-lg border border-premium-silver/20 capitalize">
                  {slotResult.style}
                </span>
              </div>
              <p className="text-premium-silver/80 text-sm mt-4">
                The spirits aligned perfectly! Finding your cocktail...
              </p>
            </div>
          )}

          {/* Cocktail Results Display */}
          {gameState === 'results' && cocktailResult && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <p className="text-premium-gold text-lg mb-4 italic">
                  Your combination revealed these magical cocktails...
                </p>
              </div>
              <div className="max-w-4xl mx-auto">
                <StandardCocktailCard
                  cocktail={{
                    id: cocktailResult.primary.id,
                    name: cocktailResult.primary.name,
                    style: (cocktailResult.primary as any).style || "Sophisticated",
                    notes: (cocktailResult.primary as any).notes || "A sophisticated blend that speaks to your refined palate",
                    ingredients: cocktailResult.primary.ingredients,
                    garnish: cocktailResult.primary.garnish,
                    glassware: cocktailResult.primary.glassware,
                    matchScore: cocktailResult.matchScore,
                    build_type: cocktailResult.primary.build_type,
                    difficulty: (cocktailResult.primary as any).difficulty || "intermediate",
                    complexity_score: (cocktailResult.primary as any).complexity_score || 5,
                    balance_profile: (cocktailResult.primary as any).balance_profile || { sweet: 5, sour: 5, bitter: 3, spicy: 4, aromatic: 6, alcoholic: 7 },
                    seasonal_notes: (cocktailResult.primary as any).seasonal_notes || []
                  }}
                  showMatchScore={true}
                  showFlavorProfile={true}
                  showDifficulty={true}
                  className="max-w-2xl mx-auto"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {(gameState === 'complete' || gameState === 'results') && (
            <button
              onClick={spinAgain}
              className="premium-button text-lg px-8 py-3 bg-gradient-to-r from-premium-gold to-premium-silver text-premium-black hover:scale-105 transition-all duration-300"
            >
              🎰 Spin Again
            </button>
          )}
          
          {/* Navigation buttons */}
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-premium-dark/50 border border-premium-silver/30 text-premium-silver rounded-lg hover:bg-premium-silver/10 transition-all duration-300"
          >
            Back to Menu
          </button>
          <button
            onClick={() => navigate('/quiz')}
            className="px-6 py-3 bg-premium-dark/50 border border-premium-silver/30 text-premium-silver rounded-lg hover:bg-premium-silver/10 transition-all duration-300"
          >
            Take Quiz Instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;