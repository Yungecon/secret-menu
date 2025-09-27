// Centralized animation utilities to reduce code duplication

// ANIMATION_DELAYS moved to src/constants/index.ts

export const ANIMATION_CLASSES = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  handwriting: 'animate-handwriting',
  shimmer: 'animate-shimmer bg-[length:200%_100%]',
  pulse: 'animate-pulse',
  ping: 'animate-ping',
  bounce: 'animate-bounce',
  floatSlow: 'animate-float-slow',
  floatMedium: 'animate-float-medium',
  floatFast: 'animate-float-fast'
} as const;

export const GRADIENT_CLASSES = {
  goldToPlatinum: 'bg-gradient-to-r from-premium-gold via-premium-platinum to-premium-gold bg-clip-text text-transparent',
  magicalGlow: 'bg-gradient-to-r from-magical-shimmer to-magical-glow',
  radial: 'bg-gradient-radial from-transparent via-magical-deep/5 to-premium-black/20'
} as const;

// Common magical particle component
export const MagicalParticles = ({ className = '' }: { className?: string }) => (
  <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-magical-glow rounded-full opacity-60 animate-ping"></div>
    <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-premium-gold rounded-full opacity-80 animate-pulse delay-1000"></div>
    <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-magical-shimmer rounded-full opacity-50 animate-bounce delay-2000"></div>
    <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-premium-platinum rounded-full opacity-40 animate-pulse delay-1500"></div>
    <div className="absolute bottom-1/3 left-1/5 w-0.5 h-0.5 bg-magical-glow rounded-full opacity-70 animate-ping delay-3000"></div>
  </div>
);

// Common floating orbs background
export const FloatingOrbs = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-magical-glow/5 rounded-full animate-float-slow blur-xl"></div>
    <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-premium-gold/5 rounded-full animate-float-medium blur-xl"></div>
    <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-magical-shimmer/3 rounded-full animate-float-fast blur-2xl"></div>
    <div className="absolute inset-0 bg-gradient-radial from-transparent via-magical-deep/5 to-premium-black/20"></div>
  </div>
);

// Enhanced button interaction handlers
export const createButtonHandlers = () => ({
  onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
    e.currentTarget.style.filter = 'brightness(1.05)';
  },
  onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.filter = '';
  },
  onTouchStart: (e: React.TouchEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'scale(0.98)';
    e.currentTarget.style.filter = 'brightness(1.1)';
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },
  onTouchEnd: (e: React.TouchEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.filter = '';
  }
});

// Common loading component
export const MagicalLoader = ({ message = "Consulting the spirits..." }: { message?: string }) => (
  <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
    <FloatingOrbs />
    <div className="text-center relative z-10">
      <div className="relative mb-8">
        <div className="animate-spin w-12 h-12 border-2 border-magical-glow/30 border-t-magical-glow rounded-full mx-auto"></div>
        <div className="absolute inset-0 animate-ping w-12 h-12 border border-magical-glow/20 rounded-full mx-auto"></div>
      </div>
      <div className="space-y-2">
        <p className="font-script text-2xl text-premium-gold animate-pulse">{message}</p>
        <p className="text-premium-silver/60 text-sm animate-fade-in delay-500">Crafting your perfect match</p>
      </div>
      <MagicalParticles />
    </div>
  </div>
);