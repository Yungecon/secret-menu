import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { generateRecommendations } from '../utils/recommendationEngine';
import { useEffect, useState } from 'react';
import { RecommendationResult } from '../types';

const Results = () => {
  const navigate = useNavigate();
  const { answers, resetQuiz } = useQuiz();
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      const result = generateRecommendations(answers);
      setRecommendations(result);
    } else {
      // No answers - redirect to start
      navigate('/');
    }
  }, [answers, navigate]);

  const handleTryAnother = () => {
    resetQuiz();
    navigate('/');
  };

  if (!recommendations) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-magical-glow border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-premium-silver">Consulting the spirits...</p>
        </div>
      </div>
    );
  }

  const { primary, adjacent } = recommendations;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center animate-fade-in">
        {/* Magical reveal message */}
        <div className="mb-8">
          <p className="text-magical-glow text-lg mb-2">Your impeccable taste has led us to...</p>
          <h1 className="font-elegant text-5xl md:text-6xl font-bold text-premium-gold mb-4 animate-fade-in">
            {primary.name}
          </h1>
          <div className="w-32 h-0.5 bg-gradient-to-r from-magical-shimmer to-magical-glow mx-auto mb-2"></div>
          <p className="text-premium-silver/60 text-sm">
            {recommendations.matchScore}% match • A perfect harmony for your palate
          </p>
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