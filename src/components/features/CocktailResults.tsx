import React from 'react';
import { GeneratedRecipe } from '../../types';
import { StandardCocktailCard } from '../ui/StandardCocktailCard';

interface CocktailResultsProps {
  cocktails: GeneratedRecipe[];
  onBack: () => void;
  onStartOver: () => void;
}

export const CocktailResults: React.FC<CocktailResultsProps> = ({
  cocktails,
  onBack,
  onStartOver
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Your Perfect Cocktails
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Based on your flavor journey, here are the cocktails that perfectly match your taste preferences.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {cocktails.map((cocktail, index) => (
          <StandardCocktailCard 
            key={cocktail.id || index} 
            cocktail={{
              id: cocktail.id,
              name: cocktail.name,
              style: (cocktail as any).style,
              notes: (cocktail as any).notes || "A sophisticated blend crafted for your refined palate",
              ingredients: cocktail.ingredients,
              garnish: cocktail.garnish,
              glassware: cocktail.glassware,
              matchScore: (cocktail as any).matchScore,
              build_type: cocktail.build_type,
              difficulty: (cocktail as any).difficulty,
              complexity_score: cocktail.complexity_score,
              balance_profile: cocktail.balance_profile,
              seasonal_notes: cocktail.seasonal_notes
            }}
            showMatchScore={false}
            showFlavorProfile={true}
            showDifficulty={true}
          />
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          ← Back to DNA
        </button>
        {/* Updated button text to match main Results component */}
        <button
          onClick={onStartOver}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors font-medium"
        >
          Discover Another Masterpiece
        </button>
      </div>
    </div>
  );
};

