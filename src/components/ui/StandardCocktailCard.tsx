import React from 'react';

interface CocktailCardProps {
  cocktail: {
    id: string;
    name: string;
    style?: string;
    notes?: string;
    ingredients: string[];
    garnish: string;
    glassware: string;
    matchScore?: number;
    build_type?: string;
    difficulty?: string;
    complexity_score?: number;
    balance_profile?: {
      sweet: number;
      sour: number;
      bitter: number;
      spicy: number;
      aromatic: number;
      alcoholic: number;
    };
    seasonal_notes?: string[];
  };
  showMatchScore?: boolean;
  showFlavorProfile?: boolean;
  showDifficulty?: boolean;
  className?: string;
  onClick?: () => void;
}

export const StandardCocktailCard: React.FC<CocktailCardProps> = ({
  cocktail,
  showMatchScore = true,
  showFlavorProfile = false,
  showDifficulty = false,
  className = '',
  onClick
}) => {
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
    <div 
      className={`bg-slate-800 border border-slate-700 rounded-lg p-6 hover:bg-slate-750 transition-all duration-200 group ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
          {cocktail.name}
        </h3>
        <div className="flex gap-2">
          {showDifficulty && cocktail.complexity_score && (
            <span className={`px-3 py-1 rounded text-sm font-medium text-white ${getDifficultyColor(cocktail.complexity_score)}`}>
              {getDifficultyText(cocktail.complexity_score)}
            </span>
          )}
          {cocktail.build_type && (
            <span className="px-3 py-1 bg-slate-600 rounded text-sm text-gray-300">
              {cocktail.build_type}
            </span>
          )}
          {cocktail.style && (
            <span className="px-3 py-1 bg-purple-600 rounded text-sm text-white">
              {cocktail.style}
            </span>
          )}
        </div>
      </div>

      {/* Match Score */}
      {showMatchScore && cocktail.matchScore && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(cocktail.matchScore, 100)}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-400">{cocktail.matchScore}% match</span>
          </div>
        </div>
      )}

      {/* Description */}
      {cocktail.notes && (
        <div className="mb-4">
          <p className="text-gray-300 italic text-sm leading-relaxed">
            "{cocktail.notes}"
          </p>
        </div>
      )}

      {/* Flavor Profile */}
      {showFlavorProfile && cocktail.balance_profile && (
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
      )}

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

      {/* Glassware & Garnish */}
      <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-1">
          <span>🥃</span>
          <span>{cocktail.glassware}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🌸</span>
          <span>{cocktail.garnish}</span>
        </div>
      </div>

      {/* Seasonal Notes */}
      {cocktail.seasonal_notes && cocktail.seasonal_notes.length > 0 && (
        <div className="p-3 bg-purple-900/30 border border-purple-500/30 rounded">
          <h4 className="text-sm font-medium text-purple-300 mb-1">Perfect For</h4>
          <p className="text-sm text-purple-200">{cocktail.seasonal_notes.join(', ')}</p>
        </div>
      )}
    </div>
  );
};
