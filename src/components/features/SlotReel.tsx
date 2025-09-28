import { useState, useEffect, useRef } from 'react';
import { getCardData } from '../../utils/slotMachineCardData';

interface SlotReelProps {
  attributes: string[];
  isSpinning: boolean;
  onStop: (selectedAttribute: string) => void;
  reelIndex: number;
  disabled?: boolean;
  canTap?: boolean;
  onTap?: () => void;
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
  disabled = false,
  canTap = false,
  onTap
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

    // Much faster spinning animation - cycle through attributes quickly
    intervalRef.current = setInterval(() => {
      setReelState(prev => ({
        ...prev,
        currentIndex: (prev.currentIndex + 1) % attributes.length
      }));
    }, 50); // 20 FPS for fast, smooth spinning effect
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

    // Very fast deceleration - complete within 1.5 seconds
    let decelerationSteps = 0;
    const maxSteps = 6; // Even fewer steps for 1.5s total
    const baseDelay = 40; // Very fast starting delay

    const decelerateStep = () => {
      decelerationSteps++;
      
      // Quick exponential deceleration curve - total ~1.2s for deceleration
      const delay = baseDelay + (decelerationSteps * decelerationSteps * 12);
      
      setReelState(prev => ({
        ...prev,
        currentIndex: (prev.currentIndex + 1) % attributes.length
      }));

      if (decelerationSteps < maxSteps) {
        decelerationTimeoutRef.current = setTimeout(decelerateStep, delay);
      } else {
        // Very quick final settle - ~0.3s for bounce
        setTimeout(() => {
          setReelState(prev => ({
            ...prev,
            isDecelerating: false,
            currentIndex: finalIndex,
            finalAttribute
          }));

          // Super quick bounce/settle animation
          if (reelRef.current) {
            reelRef.current.style.transform = 'translateY(-2px)';
            setTimeout(() => {
              if (reelRef.current) {
                reelRef.current.style.transform = 'translateY(0)';
                setTimeout(() => {
                  if (reelRef.current) {
                    reelRef.current.style.transform = 'translateY(0)';
                    onStop(finalAttribute);
                  }
                }, 60);
              }
            }, 60);
          }
        }, 100);
      }
    };

    // Start deceleration immediately
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
  
  // Get card data for current attribute
  const reelTypes = ['flavor', 'mood', 'style'] as const;
  const reelType = reelTypes[reelIndex];
  const currentCardData = getCardData(currentAttribute, reelType);
  const finalCardData = reelState.finalAttribute ? getCardData(reelState.finalAttribute, reelType) : null;
  
  // Debug logging removed for production

  const handleReelClick = () => {
    if (canTap && onTap) {
      onTap();
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Reel Container */}
      <div 
        className={`relative w-32 h-40 md:w-40 md:h-48 mb-4 ${canTap ? 'cursor-pointer' : ''}`}
        onClick={handleReelClick}
      >
        {/* Reel Frame - Premium metallic appearance */}
        <div className="absolute inset-0 bg-gradient-to-b from-premium-silver/20 via-premium-dark/80 to-premium-silver/20 rounded-2xl border-2 border-premium-silver/30 shadow-2xl backdrop-blur-sm">
          {/* Inner shadow for depth */}
          <div className="absolute inset-2 bg-gradient-to-b from-premium-black/50 to-premium-dark/30 rounded-xl border border-premium-silver/10"></div>
        </div>

        {/* Enhanced Card Content */}
        <div 
          ref={reelRef}
          className={`
            absolute inset-2 rounded-xl overflow-hidden
            transition-all duration-300 ease-out
            ${canTap ? 'cursor-pointer hover:scale-105' : ''}
            ${isStopped ? 'shadow-2xl' : 'shadow-lg'}
          `}
          style={{
            background: currentCardData ? (() => {
              const gradientParts = currentCardData.gradient.split(' ');
              const fromColor = gradientParts[0]?.replace('from-', '') || 'luxury-gold';
              const toColor = gradientParts[2]?.replace('to-', '') || 'luxury-brass';
              return `linear-gradient(135deg, var(--${fromColor}), var(--${toColor}))`;
            })() : 'var(--premium-dark)',
            boxShadow: isStopped && finalCardData ? `0 0 30px var(--${finalCardData.glowColor})` : undefined
          }}
        >
          {/* Card Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40"></div>
          
          {/* Card Content */}
          <div className={`
            relative h-full flex flex-col items-center justify-center p-3 text-center
            transition-all duration-300
            ${isActive ? 'blur-sm scale-110' : 'blur-none scale-100'}
            ${isStopped ? 'animate-pulse' : ''}
          `}>
            {/* Icon */}
            <div className={`
              text-3xl md:text-4xl mb-2 transition-all duration-300
              ${isStopped ? 'drop-shadow-lg' : ''}
            `}>
              {currentCardData?.icon || '🎲'}
            </div>
            
            {/* Label */}
            <div className={`
              font-elegant text-sm md:text-base font-bold mb-1
              ${isStopped 
                ? 'text-white drop-shadow-md' 
                : 'text-white/90'
              }
            `}>
              {currentCardData?.label || currentAttribute}
            </div>
            
            {/* Description */}
            <div className={`
              text-xs md:text-sm font-medium
              ${isStopped 
                ? 'text-white/80 drop-shadow-sm' 
                : 'text-white/70'
              }
            `}>
              {currentCardData?.description || ''}
            </div>
          </div>

          {/* Spinning Effect Overlay */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          )}

          {/* Motion Blur Effect */}
          {reelState.isSpinning && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-spin"></div>
          )}

          {/* Glow Effect for Stopped Cards */}
          {isStopped && finalCardData && (
            <div 
              className="absolute inset-0 rounded-xl opacity-50 animate-pulse"
              style={{
                boxShadow: `inset 0 0 20px var(--${finalCardData.glowColor})`
              }}
            ></div>
          )}
        </div>

        {/* Tap Indicator for Active Reel */}
        {canTap && reelState.isSpinning && (
          <div className="absolute inset-0 bg-premium-gold/10 border-2 border-premium-gold/50 rounded-2xl flex items-center justify-center animate-pulse">
            <div className="text-center">
              <div className="text-premium-gold text-2xl mb-1">👆</div>
              <div className="text-premium-gold text-xs font-semibold">TAP HERE</div>
            </div>
          </div>
        )}

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