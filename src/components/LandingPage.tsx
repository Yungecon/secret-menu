import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-magical-glow/5 rounded-full animate-float-slow blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-premium-gold/5 rounded-full animate-float-medium blur-xl"></div>
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-magical-shimmer/3 rounded-full animate-float-fast blur-2xl"></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-magical-deep/5 to-premium-black/20"></div>
      </div>

      <div className="text-center max-w-2xl mx-auto relative z-10">
        {/* Premium Logo/Title with enhanced animation */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-elegant text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-premium-gold via-premium-platinum to-magical-glow bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
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

        {/* Enhanced magical elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating sparkles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-magical-glow rounded-full opacity-60 animate-ping"></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-premium-gold rounded-full opacity-80 animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-magical-shimmer rounded-full opacity-50 animate-bounce delay-2000"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-premium-platinum rounded-full opacity-40 animate-pulse delay-1500"></div>
          <div className="absolute bottom-1/3 left-1/5 w-0.5 h-0.5 bg-magical-glow rounded-full opacity-70 animate-ping delay-3000"></div>
          
          {/* Magical trails */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-magical-glow/20 to-transparent animate-pulse delay-2000"></div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;