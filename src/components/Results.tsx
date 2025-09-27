import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { generateRecommendations } from '../utils/recommendationEngine';
import { useEffect, useState } from 'react';
import { RecommendationResult } from '../types';
import { trackRecommendationViewed, trackQuizRestart } from '../utils/analytics';
import { playCocktailReveal } from '../utils/soundEffects';

const Results = () => {
  const navigate = useNavigate();
  const { answers, resetQuiz } = useQuiz();
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      const result = generateRecommendations(answers);
      setRecommendations(result);
      
      // Track recommendation viewed
      trackRecommendationViewed(result.primary.name, result.matchScore);
      
      // Play cocktail reveal sound after a brief delay
      setTimeout(() => {
        playCocktailReveal();
      }, 1000);
    } else {
      // No answers - redirect to start
      navigate('/');
    }
  }, [answers, navigate]);

  const handleTryAnother = () => {
    trackQuizRestart();
    resetQuiz();
    navigate('/');
  };

  if (!recommendations) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Magical loading background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-magical-glow/10 rounded-full animate-pulse blur-xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-premium-gold/5 rounded-full animate-float-slow blur-2xl"></div>
        </div>
        
        <div className="text-center relative z-10">
          {/* Enhanced loading spinner */}
          <div className="relative mb-8">
            <div className="animate-spin w-12 h-12 border-2 border-magical-glow/30 border-t-magical-glow rounded-full mx-auto"></div>
            <div className="absolute inset-0 animate-ping w-12 h-12 border border-magical-glow/20 rounded-full mx-auto"></div>
          </div>
          
          {/* Magical loading text */}
          <div className="space-y-2">
            <p className="font-script text-2xl text-premium-gold animate-pulse">
              Consulting the spirits...
            </p>
            <p className="text-premium-silver/60 text-sm animate-fade-in delay-500">
              Crafting your perfect match
            </p>
          </div>
          
          {/* Loading sparkles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-magical-glow rounded-full animate-ping delay-300"></div>
            <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-premium-gold rounded-full animate-pulse delay-700"></div>
          </div>
        </div>
      </div>
    );
  }

  const { primary, adjacent } = recommendations;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center animate-fade-in">
        {/* Enhanced magical reveal */}
        <div className="mb-10 relative">
          {/* Dramatic entrance text */}
          <div className="animate-fade-in">
            <p className="font-script text-xl text-magical-glow mb-4 animate-handwriting">
              Your impeccable taste has led us to...
            </p>
          </div>
          
          {/* Hero cocktail name with dramatic reveal */}
          <div className="relative animate-slide-up delay-500">
            <h1 className="font-elegant text-6xl md:text-7xl font-bold text-premium-gold mb-6 animate-shimmer bg-gradient-to-r from-premium-gold via-premium-platinum to-premium-gold bg-clip-text text-transparent bg-[length:200%_100%]">
              {primary.name}
            </h1>
            
            {/* Magical underline with animation */}
            <div className="relative mx-auto mb-4" style={{ width: 'fit-content' }}>
              <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-magical-glow to-transparent animate-fade-in delay-1000"></div>
              <div className="absolute inset-0 w-40 h-0.5 bg-gradient-to-r from-magical-shimmer to-magical-glow animate-pulse"></div>
            </div>
          </div>
          
          {/* Enhanced match score */}
          <div className="animate-fade-in delay-1000">
            <div className="inline-flex items-center space-x-2 bg-premium-charcoal/30 px-6 py-2 rounded-full border border-premium-gold/20">
              <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse"></div>
              <span className="text-premium-gold font-medium">
                {recommendations.matchScore}% Perfect Match
              </span>
              <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse delay-500"></div>
            </div>
            <p className="text-premium-silver/60 text-sm mt-2 italic">
              A symphony crafted for your distinguished palate
            </p>
          </div>
          
          {/* Floating celebration particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/4 w-1 h-1 bg-premium-gold rounded-full animate-float-slow opacity-60"></div>
            <div className="absolute top-1/4 right-1/4 w-0.5 h-0.5 bg-magical-glow rounded-full animate-float-fast opacity-80"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-magical-shimmer rounded-full animate-bounce opacity-40"></div>
          </div>
        </div>

        {/* Cocktail details */}
        <div className="magical-card p-8 mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-center mb-4">
              <span className="text-premium-gold text-sm font-medium px-3 py-1 bg-premium-gold/10 rounded-full">
                {primary.style}
              </span>
            </div>
            <p className="text-premium-silver text-lg mb-6 leading-relaxed italic">
              "{primary.notes || "A sophisticated blend that speaks to your refined palate"}"
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-premium-platinum font-semibold text-xl mb-4 text-center">
              Crafted With
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {primary.ingredients.map((ingredient, index) => (
                <div key={index} className="text-premium-silver text-center py-2 px-4 bg-premium-charcoal/30 rounded-lg">
                  {ingredient}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-premium-silver/20 pt-4">
            <div className="flex justify-between text-sm text-premium-silver/70">
              <span>✨ Garnished with {primary.garnish}</span>
              <span>🥃 Served in {primary.glassware}</span>
            </div>
          </div>
        </div>

        {/* Adjacent recommendations */}
        {adjacent.length > 0 && (
          <div className="mb-8">
            <h3 className="text-premium-platinum text-lg mb-4">You might also enjoy...</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {adjacent.map((cocktail) => (
                <div key={cocktail.id} className="magical-card p-4">
                  <h4 className="text-premium-gold font-medium mb-2">{cocktail.name}</h4>
                  <p className="text-premium-silver/80 text-sm">{cocktail.style}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Try another button */}
        <button
          onClick={handleTryAnother}
          className="premium-button text-lg px-10 py-4"
        >
          Discover Another Masterpiece
        </button>

        <p className="text-premium-silver/60 mt-6 text-sm">
          How wonderfully sophisticated of you to explore further...
        </p>
      </div>
    </div>
  );
};

export default Results;