import { useNavigate } from 'react-router-dom';
import { FloatingOrbs, GRADIENT_CLASSES, MagicalParticles } from '../utils/animations';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <FloatingOrbs />

      <div className="text-center max-w-2xl mx-auto relative z-10">
        {/* Premium Logo/Title with enhanced animation */}
        <div className="mb-8 animate-fade-in">
          <h1 className={`font-elegant text-6xl md:text-8xl font-bold mb-4 animate-shimmer ${GRADIENT_CLASSES.goldToPlatinum}`}>
            Secret Menu
          </h1>
          
          {/* Elegant underline */}
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-premium-gold to-transparent mx-auto animate-fade-in delay-500"></div>
        </div>
        
        {/* Magical Subtitle with staggered animation */}
        <div className="mb-10 animate-slide-up delay-300">
          <p className="text-2xl md:text-3xl text-premium-silver font-light leading-relaxed mb-4">
            Discover a secret cocktail just for you
          </p>
          <p className="text-premium-silver/70 text-lg italic">
            Where sophistication meets serendipity
          </p>
        </div>

        {/* Premium Description with fade-in */}
        <p className="text-premium-silver/80 text-lg mb-12 leading-relaxed animate-fade-in delay-700 max-w-lg mx-auto">
          Through a series of refined questions, we'll unveil the perfect cocktail 
          that speaks to your distinguished taste and captures your essence.
        </p>

        {/* Enhanced CTA Button */}
        <div className="animate-fade-in delay-1000">
          <button
            onClick={() => navigate('/quiz')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(168, 85, 247, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(168, 85, 247, 0.2)';
            }}
            className="group relative premium-button text-xl px-16 py-6 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 font-medium">Begin Your Journey</span>
            
            {/* Button shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            
            {/* Button glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-magical-shimmer to-magical-glow opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
          
          {/* Subtle call to action */}
          <p className="text-premium-silver/50 text-sm mt-6 animate-pulse">
            Your perfect cocktail awaits...
          </p>
        </div>

        <MagicalParticles>
          {/* Additional magical trail */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-magical-glow/20 to-transparent animate-pulse delay-2000"></div>
        </MagicalParticles>
      </div>
    </div>
  );
};

export default LandingPage;