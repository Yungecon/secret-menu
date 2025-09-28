import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SlotReel from './SlotReel';
import { 
  FLAVOR_ATTRIBUTES, 
  MOOD_ATTRIBUTES, 
  STYLE_ATTRIBUTES,
  SlotMachineResult,
  convertSlotToQuizAnswers
} from '../../utils/slotMachineAttributes';
import { generateRecommendations } from '../../services/recommendationEngine';
import { RecommendationResult } from '../../types';

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

  // Handle tap to stop current reel
  const handleTap = useCallback(() => {
    if (gameState !== 'spinning' || currentTap >= 3) return;

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
      // More reels to stop, return to spinning state
      setGameState('spinning');
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

        // Generate cocktail recommendation after a brief pause
        setTimeout(() => {
          try {
            const quizAnswers = convertSlotToQuizAnswers(result);
            const recommendation = generateRecommendations(quizAnswers);
            setCocktailResult(recommendation);
            setGameState('results');
          } catch (err) {
            // Fallback to a generic recommendation to avoid getting stuck
            try {
              const fallback = generateRecommendations({} as any);
              setCocktailResult(fallback);
              setGameState('results');
            } catch {}
          }
        }, 1500);
      }
    }
  }, [currentTap, reelStates]);

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
  }, []);

  const getInstructionText = () => {
    if (gameState === 'spinning') return `Tap the glowing reel to stop it (${currentTap + 1} of 3)`;
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
              <div className="bg-premium-dark/50 border border-premium-gold/30 rounded-2xl p-8 mb-6">
                <div className="text-center mb-6">
                  <p className="text-premium-gold text-lg mb-4 italic">
                    Your combination revealed...
                  </p>
                  <h2 className="font-elegant text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-premium-gold via-premium-silver to-premium-gold bg-clip-text text-transparent">
                    {cocktailResult.primary.name}
                  </h2>
                  <div className="inline-flex items-center space-x-2 bg-premium-charcoal/30 px-4 py-2 rounded-full border border-premium-gold/20 mb-4">
                    <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse"></div>
                    <span className="text-premium-gold font-medium text-sm">
                      {cocktailResult.matchScore}% Perfect Match
                    </span>
                    <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse delay-500"></div>
                  </div>
                </div>

                {/* Cocktail Details */}
                <div className="mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-premium-gold text-sm font-medium px-3 py-1 bg-premium-gold/10 rounded-full">
                      {cocktailResult.primary.style}
                    </span>
                  </div>
                  <p className="text-premium-silver text-lg mb-6 leading-relaxed italic text-center">
                    "{cocktailResult.primary.notes || "A sophisticated blend that speaks to your refined palate"}"
                  </p>
                </div>

                {/* Ingredients */}
                <div className="mb-6">
                  <h3 className="text-premium-platinum font-semibold text-lg mb-4 text-center">
                    Crafted With
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {cocktailResult.primary.ingredients.map((ingredient, index) => (
                      <div key={index} className="text-premium-silver text-center py-2 px-4 bg-premium-charcoal/30 rounded-lg">
                        {ingredient}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Garnish and Glassware */}
                <div className="border-t border-premium-silver/20 pt-4">
                  <div className="flex justify-between text-sm text-premium-silver/70">
                    <span>✨ Garnished with {cocktailResult.primary.garnish}</span>
                    <span>🥃 Served in {cocktailResult.primary.glassware}</span>
                  </div>
                </div>
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