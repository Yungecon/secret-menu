import React, { useState, useEffect } from 'react';
import { ingredientSpotlightService, SeasonalRecommendation } from '../../services/ingredientSpotlightService';
import { IngredientSearch } from './IngredientSearch';
import { FlavorJourney } from './FlavorJourney';

interface IngredientSpotlightProps {
  onIngredientSelect?: (ingredient: any) => void;
  onCocktailSelect?: (cocktailName: string) => void;
}

export const IngredientSpotlight: React.FC<IngredientSpotlightProps> = ({
  onIngredientSelect,
  onCocktailSelect
}) => {
  const [seasonalSpotlight, setSeasonalSpotlight] = useState<SeasonalRecommendation | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'journey' | 'seasonal' | 'categories'>('search');

  // Load seasonal spotlight on mount
  useEffect(() => {
    const loadSeasonalSpotlight = async () => {
      const currentSeason = getCurrentSeason();
      const spotlight = await ingredientSpotlightService.getSeasonalSpotlight(currentSeason);
      setSeasonalSpotlight(spotlight);
    };

    loadSeasonalSpotlight();
  }, []);

  const getCurrentSeason = (): string => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  };

  const handleIngredientClick = (ingredient: any) => {
    onIngredientSelect?.(ingredient);
  };

  const handleCocktailClick = (cocktailName: string) => {
    onCocktailSelect?.(cocktailName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ingredient Spotlight
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Search for specific ingredients or embark on a guided flavor journey. 
            Discover your perfect cocktail through exploration or targeted search.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800 rounded-lg p-1 flex">
            {[
              { id: 'search', label: 'Search', icon: '🔍' },
              { id: 'journey', label: 'Flavor Journey', icon: '🧬' },
              { id: 'seasonal', label: 'Seasonal', icon: '🌸' },
              { id: 'categories', label: 'Categories', icon: '📚' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-md transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <IngredientSearch
            onIngredientSelect={onIngredientSelect}
            onCocktailSelect={onCocktailSelect}
          />
        )}

        {/* Flavor Journey Tab */}
        {activeTab === 'journey' && (
          <FlavorJourney
            onCocktailGenerate={(cocktails) => {
              // Handle generated cocktails
              console.log('Generated cocktails:', cocktails);
              // Could redirect to results page or show in modal
            }}
          />
        )}

        {/* Seasonal Tab */}
        {activeTab === 'seasonal' && seasonalSpotlight && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-800 to-pink-800 rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold mb-4 capitalize">
                {seasonalSpotlight.season} Spotlight
              </h2>
              <p className="text-xl text-gray-200 mb-6">
                {seasonalSpotlight.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Featured Ingredients</h3>
                <div className="space-y-4">
                  {seasonalSpotlight.featuredIngredients.map((ingredient, index) => (
                    <div
                      key={index}
                      onClick={() => handleIngredientClick(ingredient)}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:bg-slate-700 transition-all duration-200 cursor-pointer"
                    >
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {ingredient.name}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {ingredient.flavor_profile?.map((flavor: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-slate-700 rounded text-sm text-gray-300">
                            {flavor}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Recommended Cocktails</h3>
                <div className="space-y-4">
                  {seasonalSpotlight.recommendedCocktails.map((cocktail, index) => (
                    <button
                      key={index}
                      onClick={() => handleCocktailClick(cocktail)}
                      className="w-full text-left bg-slate-800 border border-slate-700 rounded-lg p-4 hover:bg-slate-700 transition-all duration-200 group"
                    >
                      <h4 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {cocktail}
                      </h4>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {['vodka', 'gin', 'tequila', 'whiskey', 'rum', 'mezcal'].map(spiritType => (
                <SpiritCategoryCard
                  key={spiritType}
                  spiritType={spiritType}
                  onIngredientClick={handleIngredientClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface SpiritCategoryCardProps {
  spiritType: string;
  onIngredientClick: (ingredient: any) => void;
}

const SpiritCategoryCard: React.FC<SpiritCategoryCardProps> = ({ spiritType, onIngredientClick }) => {
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIngredients = async () => {
      const spiritIngredients = await ingredientSpotlightService.getIngredientsBySpirit(spiritType);
      setIngredients(spiritIngredients);
      setLoading(false);
    };

    loadIngredients();
  }, [spiritType]);

  if (loading) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4 capitalize">
        {spiritType}
      </h3>
      <div className="space-y-3">
        {ingredients.slice(0, 4).map((ingredient, index) => (
          <div
            key={index}
            onClick={() => onIngredientClick(ingredient)}
            className="flex justify-between items-center p-3 bg-slate-700 rounded hover:bg-slate-600 transition-colors cursor-pointer group"
          >
            <div>
              <h4 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                {ingredient.name}
              </h4>
              <p className="text-xs text-gray-400">{ingredient.tier}</p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              ingredient.price_point === 'high' ? 'bg-purple-600 text-white' :
              ingredient.price_point === 'medium' ? 'bg-blue-600 text-white' :
              'bg-gray-600 text-white'
            }`}>
              {ingredient.price_point}
            </span>
          </div>
        ))}
        {ingredients.length > 4 && (
          <p className="text-xs text-gray-400 text-center">
            +{ingredients.length - 4} more ingredients
          </p>
        )}
      </div>
    </div>
  );
};
