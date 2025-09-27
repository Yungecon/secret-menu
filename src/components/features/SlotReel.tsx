import { useState, useEffect, useRef } from 'react';

interface SlotReelProps {
  attributes: string[];
  isSpinning: boolean;
  onStop: (selectedAttribute: string) => void;
  reelIndex: number;
  disabled?: boolean;
}

interface ReelState {
  isSpinning: boolean;
  isDecelerating: boolean;
  currentIndex: number;
  finalAttribute?: string;
}

const SlotReel: React.FC<SlotReelProps> = ({
  attributes,
  isSpinning,
  onStop,
  reelIndex,
  disabled = false
}) => {
  const [reelState, setReelState] = useState<ReelState>({
    isSpinning: false,
    isDecelerating: false,
    currentIndex: 0
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const decelerationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reelRef = useRef<HTMLDivElement>(null);

  // Start spinning when isSpinning becomes true
  useEffect(() => {
    if (isSpinning && !reelState.isSpinning && !disabled) {
      startSpinning();
    } else if (!isSpinning && reelState.isSpinning) {
      stopSpinning();
    }
  }, [isSpinning, disabled]);

  const startSpinning = () => {
    setReelState(prev => ({
      ...prev,
      isSpinning: true,
      isDecelerating: false,
      finalAttribute: undefined
    }));

    // Fast spinning animation - cycle through attributes quickly
    intervalRef.current = setInterval(() => {
      setReelState(prev => ({
        ...prev,
        currentIndex: (prev.currentIndex + 1) % attributes.length
      }));
    }, 100); // 10 FPS for visible spinning effect
  };

  const stopSpinning = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Begin mechanical deceleration
    setReelState(prev => ({
      ...prev,
      isSpinning: false,
      isDecelerating: true
    }));

    // Select random final attribute
    const finalIndex = Math.floor(Math.random() * attributes.length);
    const finalAttribute = attributes[finalIndex];

    // Simulate mechanical deceleration with realistic timing
    let decelerationSteps = 0;
    const maxSteps = 15; // Number of deceleration steps
    const baseDelay = 100; // Starting delay

    const decelerateStep = () => {
      decelerationSteps++;
      
      // Exponential deceleration curve
      const delay = baseDelay + (decelerationSteps * decelerationSteps * 20);
      
      setReelState(prev => ({
        ...prev,
        currentIndex: (prev.currentIndex + 1) % attributes.length
      }));

      if (decelerationSteps < maxSteps) {
        decelerationTimeoutRef.current = setTimeout(decelerateStep, delay);
      } else {
        // Final settle with bounce effect
        setTimeout(() => {
          setReelState(prev => ({
            ...prev,
            isDecelerating: false,
            currentIndex: finalIndex,
            finalAttribute
          }));

          // Add bounce/settle animation
          if (reelRef.current) {
            reelRef.current.style.transform = 'translateY(-5px)';
            setTimeout(() => {
              if (reelRef.current) {
                reelRef.current.style.transform = 'translateY(2px)';
                setTimeout(() => {
                  if (reelRef.current) {
                    reelRef.current.style.transform = 'translateY(0)';
                    onStop(finalAttribute);
                  }
                }, 150);
              }
            }, 100);
          }
        }, 200);
      }
    };

    // Start deceleration
    decelerationTimeoutRef.current = setTimeout(decelerateStep, baseDelay);
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (decelerationTimeoutRef.current) clearTimeout(decelerationTimeoutRef.current);
    };
  }, []);

  const currentAttribute = attributes[reelState.currentIndex];
  const isActive = reelState.isSpinning || reelState.isDecelerating;
  const isStopped = !isActive && reelState.finalAttribute;

  return (
    <div className="flex flex-col items-center">
      {/* Reel Container */}
      <div className="relative w-32 h-40 md:w-40 md:h-48 mb-4">
        {/* Reel Frame - Premium metallic appearance */}
        <div className="absolute inset-0 bg-gradient-to-b from-premium-silver/20 via-premium-dark/80 to-premium-silver/20 rounded-2xl border-2 border-premium-silver/30 shadow-2xl backdrop-blur-sm">
          {/* Inner shadow for depth */}
          <div className="absolute inset-2 bg-gradient-to-b from-premium-black/50 to-premium-dark/30 rounded-xl border border-premium-silver/10"></div>
        </div>

        {/* Spinning Reel Content */}
        <div 
          ref={reelRef}
          className={`
            absolute inset-4 flex items-center justify-center rounded-lg overflow-hidden
            transition-transform duration-200 ease-out
            ${isActive ? 'bg-premium-dark/90' : 'bg-premium-dark/70'}
          `}
        >
          {/* Attribute Display */}
          <div className={`
            text-center transition-all duration-300
            ${isActive ? 'blur-sm scale-110' : 'blur-none scale-100'}
            ${isStopped ? 'animate-pulse' : ''}
          `}>
            <div className={`
              font-elegant text-lg md:text-xl font-semibold capitalize
              ${isStopped 
                ? 'text-premium-gold bg-gradient-to-r from-premium-gold to-premium-silver bg-clip-text text-transparent' 
                : 'text-premium-silver'
              }
            `}>
              {currentAttribute}
            </div>
          </div>

          {/* Spinning Effect Overlay */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-premium-silver/10 to-transparent animate-pulse"></div>
          )}

          {/* Motion Blur Effect */}
          {reelState.isSpinning && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-premium-silver/5 to-transparent animate-spin"></div>
          )}
        </div>

        {/* Highlight Ring for Stopped Reel */}
        {isStopped && (
          <div className="absolute -inset-1 bg-gradient-to-r from-premium-gold via-premium-silver to-premium-gold rounded-2xl opacity-50 animate-pulse"></div>
        )}

        {/* Reel Number Indicator */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-premium-dark/80 border border-premium-silver/30 rounded-full w-6 h-6 flex items-center justify-center">
            <span className="text-premium-silver text-xs font-bold">{reelIndex + 1}</span>
          </div>
        </div>
      </div>

      {/* Reel Status */}
      <div className="text-center min-h-[2rem]">
        {reelState.isSpinning && (
          <p className="text-premium-silver/70 text-sm animate-pulse">
            Spinning...
          </p>
        )}
        {reelState.isDecelerating && (
          <p className="text-premium-gold/80 text-sm animate-pulse">
            Slowing down...
          </p>
        )}
        {isStopped && (
          <div className="space-y-1">
            <p className="text-premium-gold text-sm font-medium">
              ✨ Locked!
            </p>
            <p className="text-premium-silver/60 text-xs capitalize">
              {reelState.finalAttribute}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotReel;