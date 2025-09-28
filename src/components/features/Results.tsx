import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../hooks';
import { generateRecommendations, generateEnhancedRecommendations } from '../../services/recommendationEngine';
import { useEffect, useState } from 'react';
import { RecommendationResult, EnhancedRecommendationResult } from '../../types';
import { trackRecommendationViewed, trackEnhancedRecommendationViewed, trackQuizRestart } from '../../services/analytics';
import { playCocktailReveal } from '../../services/soundEffects';
import { MagicalLoader, MagicalParticles } from '../ui/animations';

const Results = () => {
  const navigate = useNavigate();
  const { answers, resetQuiz } = useQuiz();
  const [recommendations, setRecommendations] = useState<RecommendationResult | EnhancedRecommendationResult | null>(null);

  useEffect(() => {
    let timeoutId: number | undefined;

    if (Object.keys(answers).length > 0) {
      try {
        // Check if we have all required answers for enhanced recommendations
        const hasAllAnswers = answers.sweetVsBitter && 
                             answers.citrusVsStone && 
                             answers.lightVsBoozy && 
                             answers.classicVsExperimental && 
                             answers.moodPreference;

        // Use enhanced recommendations if we have all answers, otherwise use regular
        const result = hasAllAnswers 
          ? generateEnhancedRecommendations(answers as any) // Type assertion needed for now
          : generateRecommendations(answers);

        setRecommendations(result);

        // Track recommendation viewed with enhanced analytics
        if ('fuzzyMatches' in result && 'fallbackUsed' in result) {
          const enhancedResult = result as EnhancedRecommendationResult;
          if (enhancedResult.fuzzyMatches || enhancedResult.fallbackUsed) {
            trackEnhancedRecommendationViewed(enhancedResult.primary.name, enhancedResult.matchScore, enhancedResult.fuzzyMatches, enhancedResult.fallbackUsed);
          } else {
            trackRecommendationViewed(result.primary.name, result.matchScore);
          }
        } else {
          trackRecommendationViewed(result.primary.name, result.matchScore);
        }

        // Play cocktail reveal sound after a brief delay
        setTimeout(() => {
          playCocktailReveal();
        }, 1000);
      } catch (err) {
        // Fallback: generate a safe default recommendation
        try {
          const fallback = generateRecommendations({} as any);
          setRecommendations(fallback);
          trackRecommendationViewed(fallback.primary.name, fallback.matchScore);
          setTimeout(() => {
            playCocktailReveal();
          }, 500);
        } catch {}
      }
    } else {
      // No answers - generate a safe fallback instead of redirecting to avoid loader hang
      try {
        const fallback = generateRecommendations({} as any);
        setRecommendations(fallback);
        trackRecommendationViewed(fallback.primary.name, fallback.matchScore);
        setTimeout(() => {
          playCocktailReveal();
        }, 500);
      } catch {}
    }
    
    // Safety timeout: if still no recommendations after a short delay, populate fallback
    timeoutId = window.setTimeout(() => {
      if (!recommendations) {
        try {
          const fallback = generateRecommendations({} as any);
          setRecommendations(fallback);
          trackRecommendationViewed(fallback.primary.name, fallback.matchScore);
          setTimeout(() => {
            playCocktailReveal();
          }, 300);
        } catch {}
      }
    }, 1500);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [answers, navigate, recommendations]);

  const handleTryAnother = () => {
    trackQuizRestart();
    resetQuiz();
    navigate('/');
  };

  if (!recommendations) {
    return <MagicalLoader />;
  }

  const { primary, adjacent } = recommendations;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-luxury-obsidian via-luxury-charcoal to-luxury-obsidian">
      <div className="max-w-2xl mx-auto text-center animate-fade-in">
        {/* Enhanced magical reveal */}
        <div className="mb-10 relative">
          {/* Dramatic entrance text */}
          <div className="animate-fade-in">
            <p className="font-script text-xl text-luxury-gold mb-4 animate-handwriting">
              Your impeccable taste has led us to...
            </p>
          </div>
          
          {/* Hero cocktail name with dramatic reveal */}
          <div className="relative animate-slide-up delay-500">
            <h1 className="font-elegant text-6xl md:text-7xl font-bold mb-6 animate-shimmer text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold via-luxury-champagne to-luxury-platinum">
              {primary.name}
            </h1>
            
            {/* Magical underline with animation */}
            <div className="relative mx-auto mb-4" style={{ width: 'fit-content' }}>
              <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-luxury-gold to-transparent animate-fade-in delay-1000"></div>
              <div className="absolute inset-0 w-40 h-0.5 bg-gradient-to-r from-luxury-champagne to-luxury-gold animate-pulse"></div>
            </div>
          </div>
          
          {/* Enhanced match score */}
          <div className="animate-fade-in delay-1000">
            <div className="inline-flex items-center space-x-2 bg-luxury-charcoal/30 px-6 py-2 rounded-full border border-luxury-gold/20">
              <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse"></div>
              <span className="text-luxury-gold font-medium">
                {recommendations.matchScore}% Perfect Match
              </span>
              <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse delay-500"></div>
            </div>
            <p className="text-luxury-pearl/60 text-sm mt-2 italic">
              A symphony crafted for your distinguished palate
            </p>
          </div>
          
          <MagicalParticles />
        </div>

        {/* Cocktail details */}
        <div className="magical-card p-8 mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-center mb-4">
              <span className="text-luxury-gold text-sm font-medium px-3 py-1 bg-luxury-gold/10 rounded-full">
                {primary.style}
              </span>
            </div>
            <p className="text-luxury-pearl text-lg mb-6 leading-relaxed italic">
              "{primary.notes || "A sophisticated blend that speaks to your refined palate"}"
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-luxury-platinum font-semibold text-xl mb-4 text-center">
              Crafted With
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {primary.ingredients.map((ingredient, index) => (
                <div key={index} className="text-luxury-pearl text-center py-2 px-4 bg-luxury-charcoal/30 rounded-lg">
                  {ingredient}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-luxury-platinum/20 pt-4">
            <div className="flex justify-between text-sm text-luxury-pearl/70">
              <span>✨ Garnished with {primary.garnish}</span>
              <span>🥃 Served in {primary.glassware}</span>
            </div>
          </div>
        </div>

        {/* Adjacent recommendations - now clickable */}
        {adjacent.length > 0 && (
          <div className="mb-8">
            <h3 className="text-luxury-platinum text-lg mb-4">You might also enjoy...</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {adjacent.map((cocktail) => (
                <button
                  key={cocktail.id}
                  onClick={() => {
                    // Switch to this cocktail as the primary recommendation
                    const newRecommendations = {
                      primary: cocktail,
                      adjacent: adjacent.filter(c => c.id !== cocktail.id).concat([primary]).slice(0, 3),
                      matchScore: Math.max(88, Math.floor(Math.random() * 8) + 90) // Generate high match score
                    };
                    setRecommendations(newRecommendations);
                    
                    // Track the new cocktail view
                    trackRecommendationViewed(cocktail.name, newRecommendations.matchScore);
                    
                    // Play cocktail reveal sound
                    setTimeout(() => {
                      playCocktailReveal();
                    }, 300);
                  }}
                  className="magical-card p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-luxury-gold/20 active:scale-95 text-left group"
                >
                  <h4 className="text-luxury-gold font-medium mb-2 group-hover:text-luxury-champagne transition-colors">
                    {cocktail.name}
                  </h4>
                  <p className="text-luxury-pearl/80 text-sm mb-2">{cocktail.style}</p>
                  <p className="text-luxury-pearl/60 text-xs italic">
                    Tap to explore this exquisite creation
                  </p>
                  
                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-luxury-gold/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out opacity-0 group-hover:opacity-100 rounded-xl"></div>
                </button>
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

        <p className="text-luxury-pearl/60 mt-6 text-sm">
          How wonderfully sophisticated of you to explore further...
        </p>
      </div>
    </div>
  );
};

export default Results;