import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SlotReel from './SlotReel';
import { 
  FLAVOR_ATTRIBUTES, 
  MOOD_ATTRIBUTES, 
  STYLE_ATTRIBUTES,
  SlotMachineResult 
} from '../../utils/slotMachineAttributes';

interface ReelState {
  isSpinning: boolean;
  selectedAttribute?: string;
}

const SlotMachine = () => {
  const navigate = useNavigate();
  
  const [reelStates, setReelStates] = useState<ReelState[]>([
    { isSpinning: false },
    { isSpinning: false },
    { isSpinning: false }
  ]);
  
  const [gameState, setGameState] = useState<'idle' | 'spinning' | 'stopping' | 'complete'>('idle');
  const [currentTap, setCurrentTap] = useState(0); // Which reel to stop next (0-2)
  const [slotResult, setSlotResult] = useState<SlotMachineResult | null>(null);

  // Start all reels spinning
  const startSpinning = useCallback(() => {
    setGameState('spinning');
    setCurrentTap(0);
    setSlotResult(null);
    setReelStates([
      { isSpinning: true },
      { isSpinning: true },
      { isSpinning: true }
    ]);
  }, []);

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
      }
    }
  }, [currentTap, reelStates]);

  // Reset for new spin
  const spinAgain = useCallback(() => {
    setGameState('idle');
    setCurrentTap(0);
    setSlotResult(null);
    setReelStates([
      { isSpinning: false },
      { isSpinning: false },
      { isSpinning: false }
    ]);
  }, []);

  const getInstructionText = () => {
    if (gameState === 'idle') return 'Tap "Spin" to start your cocktail destiny';
    if (gameState === 'spinning') return `Tap to stop reel ${currentTap + 1} of 3`;
    if (gameState === 'stopping') return 'Reel stopping...';
    if (gameState === 'complete') return 'The reels have aligned! 🎰';
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
                disabled={gameState === 'idle' || (gameState === 'spinning' && index !== currentTap)}
              />
            ))}
          </div>

          {/* Tap Area for Mobile */}
          {(gameState === 'spinning') && (
            <div 
              onClick={handleTap}
              className="cursor-pointer bg-premium-dark/50 border-2 border-dashed border-premium-gold/50 rounded-2xl p-8 mb-6 hover:bg-premium-gold/10 transition-all duration-300 active:scale-95"
            >
              <p className="text-premium-gold text-lg font-medium">
                👆 Tap here to stop reel {currentTap + 1}
              </p>
              <p className="text-premium-silver/70 text-sm mt-2">
                Or tap anywhere on the screen
              </p>
            </div>
          )}

          {/* Results Display */}
          {gameState === 'complete' && slotResult && (
            <div className="bg-premium-dark/50 border border-premium-gold/30 rounded-2xl p-6 mb-6">
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
                The spirits aligned perfectly! Let's find your cocktail...
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {gameState === 'idle' && (
            <button
              onClick={startSpinning}
              className="premium-button text-xl px-12 py-4 bg-gradient-to-r from-premium-gold to-premium-silver text-premium-black hover:scale-105 transition-all duration-300"
            >
              🎰 Spin the Reels
            </button>
          )}
          
          {gameState === 'complete' && (
            <>
              <button
                onClick={spinAgain}
                className="premium-button text-lg px-8 py-3 bg-gradient-to-r from-premium-gold to-premium-silver text-premium-black hover:scale-105 transition-all duration-300"
              >
                🎰 Spin Again
              </button>
              <button
                onClick={() => {
                  // TODO: Navigate to results with slot machine data
                  console.log('Navigate to results with:', slotResult);
                }}
                className="premium-button text-lg px-8 py-3 bg-gradient-to-r from-magical-shimmer to-magical-glow text-white hover:scale-105 transition-all duration-300"
              >
                🍸 Find My Cocktail
              </button>
            </>
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

        {/* Global tap handler for mobile */}
        {gameState === 'spinning' && (
          <div 
            onClick={handleTap}
            className="fixed inset-0 z-0 cursor-pointer"
            style={{ background: 'transparent' }}
          />
        )}
      </div>
    </div>
  );
};

export default SlotMachine;