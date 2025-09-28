import React from 'react';
import { GeneratedRecipe } from '../../types';

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
          <CocktailCard key={cocktail.id || index} cocktail={cocktail} />
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

interface CocktailCardProps {
  cocktail: GeneratedRecipe;
}

const CocktailCard: React.FC<CocktailCardProps> = ({ cocktail }) => {
  const getDifficultyColor = (score: number) => {
    if (score <= 3) return 'bg-green-600';
    if (score <= 6) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getDifficultyText = (score: number) => {
    if (score <= 3) return 'Easy';
    if (score <= 6) return 'Intermediate';
    return 'Advanced';
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:bg-slate-750 transition-all duration-200 group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
          {cocktail.name}
        </h3>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded text-sm font-medium text-white ${getDifficultyColor(cocktail.complexity_score)}`}>
            {getDifficultyText(cocktail.complexity_score)}
          </span>
          <span className="px-3 py-1 bg-slate-600 rounded text-sm text-gray-300">
            {cocktail.build_type}
          </span>
        </div>
      </div>

      {/* Flavor Profile */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Flavor Profile</h4>
        <div className="space-y-2">
          {Object.entries(cocktail.balance_profile).map(([trait, value]) => (
            <div key={trait} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-16 capitalize text-right">{trait}:</span>
              <div className="flex-1 bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((value as number) * 10, 100)}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-300 w-6">{(value as number)}/10</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Ingredients</h4>
        <ul className="space-y-1">
          {cocktail.ingredients.map((ingredient, idx) => (
            <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              {ingredient}
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Instructions</h4>
        <ol className="space-y-1">
          {cocktail.instructions.map((instruction, idx) => (
            <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
              <span className="text-purple-400 font-medium text-xs mt-0.5">{idx + 1}.</span>
              <span>{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Glassware & Garnish */}
      <div className="flex justify-between items-center text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <span>🥃</span>
          <span>{cocktail.glassware}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🌸</span>
          <span>{Array.isArray(cocktail.garnish) ? cocktail.garnish.join(', ') : cocktail.garnish}</span>
        </div>
      </div>

      {/* Seasonal Notes */}
      {cocktail.seasonal_notes && cocktail.seasonal_notes.length > 0 && (
        <div className="mt-4 p-3 bg-purple-900/30 border border-purple-500/30 rounded">
          <h4 className="text-sm font-medium text-purple-300 mb-1">Perfect For</h4>
          <p className="text-sm text-purple-200">{cocktail.seasonal_notes.join(', ')}</p>
        </div>
      )}
    </div>
  );
};
