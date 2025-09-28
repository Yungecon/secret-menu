import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../hooks';
import { generateRecommendations, generateEnhancedRecommendations, resetRecentlyShownCocktails } from '../../services/recommendationEngine';
import { useEffect, useState } from 'react';
import { RecommendationResult, EnhancedRecommendationResult } from '../../types';
import { trackRecommendationViewed, trackEnhancedRecommendationViewed, trackQuizRestart } from '../../services/analytics';
import { playCocktailReveal } from '../../services/soundEffects';
import { MagicalLoader, MagicalParticles } from '../ui/animations';
import { StandardCocktailCard } from '../ui/StandardCocktailCard';

const Results = () => {
  const navigate = useNavigate();
  const { answers, resetQuiz } = useQuiz();
  const [recommendations, setRecommendations] = useState<RecommendationResult | EnhancedRecommendationResult | null>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (Object.keys(answers).length > 0) {
        try {
          console.log('Loading recommendations for answers:', answers);
          
          // Add timeout to prevent infinite loading
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Recommendation loading timeout')), 10000); // 10 second timeout
          });
          
          // Check if we have all required answers for enhanced recommendations
          const hasAllAnswers = answers.sweetVsBitter && 
                               answers.citrusVsStone && 
                               answers.lightVsBoozy && 
                               answers.classicVsExperimental && 
                               answers.moodPreference;
          
          // Use enhanced recommendations if we have all answers, otherwise use regular
          const recommendationPromise = hasAllAnswers 
            ? generateEnhancedRecommendations(answers as any) // Type assertion needed for now
            : generateRecommendations(answers);
          
          const result = await Promise.race([recommendationPromise, timeoutPromise]);
          console.log('Recommendations loaded successfully:', result);
          
          setRecommendations(result);
        } catch (error) {
          console.error('Error loading recommendations:', error);
          // Set a fallback recommendation to prevent infinite loading
          setRecommendations({
            primary: {
              id: 'fallback-cocktail',
              name: 'Classic Martini',
              base_spirit_category: 'gin',
              base_brand: 'gin',
              style: 'Classic',
              build_type: 'Stirred',
              difficulty: 'intermediate',
              complexity_score: 6,
              flavor_tags: ['classic', 'sophisticated'],
              mood_tags: ['elegant', 'refined'],
              ingredients: ['2oz Gin', '0.5oz Dry Vermouth', 'Olive or Lemon twist'],
              garnish: 'Olive or Lemon twist',
              glassware: 'Martini glass',
              notes: 'A timeless classic that never goes out of style.',
              balance_profile: {
                sweet: 2,
                sour: 3,
                bitter: 6,
                spicy: 4,
                aromatic: 8,
                alcoholic: 8
              },
              seasonal_notes: []
            },
            adjacent: [],
            matchScore: 85
          });
        }
        
        // Track recommendation viewed with enhanced analytics
        if (recommendations && 'fuzzyMatches' in recommendations && 'fallbackUsed' in recommendations) {
          const enhancedResult = recommendations as EnhancedRecommendationResult;
          if (enhancedResult.fuzzyMatches || enhancedResult.fallbackUsed) {
            trackEnhancedRecommendationViewed(enhancedResult.primary.name, enhancedResult.matchScore, enhancedResult.fuzzyMatches, enhancedResult.fallbackUsed);
          } else {
            trackRecommendationViewed(recommendations.primary.name, recommendations.matchScore);
          }
        } else if (recommendations) {
          trackRecommendationViewed(recommendations.primary.name, recommendations.matchScore);
        }
        
        // Play cocktail reveal sound after a brief delay
        setTimeout(() => {
          playCocktailReveal();
        }, 1000);
      } else {
        // No answers - redirect to start
        navigate('/');
      }
    };
    
    loadRecommendations();
  }, [answers, navigate]);

  const handleTryAnother = () => {
    trackQuizRestart();
    resetQuiz();
    resetRecentlyShownCocktails(); // Reset recently shown cocktails for fresh recommendations
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
        <div className="mb-8">
          <StandardCocktailCard
            cocktail={{
              id: primary.id,
              name: primary.name,
              style: primary.style,
              notes: primary.notes || "A sophisticated blend that speaks to your refined palate",
              ingredients: primary.ingredients,
              garnish: primary.garnish,
              glassware: primary.glassware,
              matchScore: recommendations.matchScore,
              build_type: primary.build_type,
              difficulty: (primary as any).difficulty || 'intermediate',
              complexity_score: (primary as any).complexity_score || 5,
              balance_profile: (primary as any).balance_profile || { sweet: 5, sour: 5, bitter: 3, spicy: 4, aromatic: 6, alcoholic: 7 },
              seasonal_notes: (primary as any).seasonal_notes || []
            }}
            showMatchScore={true}
            showFlavorProfile={true}
            showDifficulty={true}
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Adjacent recommendations - now clickable */}
        {adjacent.length > 0 && (
          <div className="mb-8">
            <h3 className="text-luxury-platinum text-lg mb-4">You might also enjoy...</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {adjacent.map((cocktail) => (
                <StandardCocktailCard
                  key={cocktail.id}
                  cocktail={{
                    id: cocktail.id,
                    name: cocktail.name,
                    style: cocktail.style,
                    notes: cocktail.notes || "A delightful alternative that complements your taste",
                    ingredients: cocktail.ingredients,
                    garnish: cocktail.garnish,
                    glassware: cocktail.glassware,
                    matchScore: 85, // Default match score for adjacent cocktails
                    build_type: cocktail.build_type,
                    difficulty: (cocktail as any).difficulty || 'intermediate',
                    complexity_score: (cocktail as any).complexity_score || 5,
                    balance_profile: (cocktail as any).balance_profile || { sweet: 5, sour: 5, bitter: 3, spicy: 4, aromatic: 6, alcoholic: 7 },
                    seasonal_notes: (cocktail as any).seasonal_notes || []
                  }}
                  showMatchScore={true}
                  showFlavorProfile={true}
                  showDifficulty={true}
                  onClick={async () => {
                    // Track the cocktail as recently shown
                    resetRecentlyShownCocktails(); // Clear the list to allow this cocktail to be shown
                    
                    // Generate new recommendations with the selected cocktail as primary
                    const newAnswers = { ...answers };
                    const newResult = Object.keys(newAnswers).length > 0 
                      ? await generateEnhancedRecommendations(newAnswers as any)
                      : await generateRecommendations(newAnswers);
                    
                    // Create new recommendations with the selected cocktail as primary
                    const newRecommendations = {
                      primary: cocktail,
                      adjacent: newResult.adjacent.filter(c => c.id !== cocktail.id).slice(0, 3),
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
                />
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