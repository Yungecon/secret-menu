import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto animate-fade-in">
        {/* Premium Logo/Title */}
        <h1 className="font-elegant text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-premium-gold to-premium-platinum bg-clip-text text-transparent">
          Secret Menu
        </h1>
        
        {/* Magical Subtitle */}
        <div className="mb-8">
          <p className="text-xl md:text-2xl text-premium-silver font-light leading-relaxed">
            Discover a secret cocktail just for you
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-magical-shimmer to-magical-glow mx-auto mt-4"></div>
        </div>

        {/* Premium Description */}
        <p className="text-premium-silver/80 text-lg mb-12 leading-relaxed">
          Through a series of refined questions, we'll unveil the perfect cocktail 
          that matches your sophisticated palate.
        </p>

        {/* Magical CTA Button */}
        <button
          onClick={() => navigate('/quiz')}
          className="premium-button text-xl px-12 py-6 animate-magical-glow"
        >
          Begin Your Journey
        </button>

        {/* Subtle magical elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-magical-glow rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-premium-gold rounded-full opacity-40 animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-magical-shimmer rounded-full opacity-25 animate-pulse delay-2000"></div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;