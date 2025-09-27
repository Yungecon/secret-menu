import React, { useState, useEffect } from 'react';
import { ingredientSpotlightService, IngredientFilter, IngredientSearchResult, SeasonalRecommendation } from '../../services/ingredientSpotlightService';

interface IngredientSpotlightProps {
  onIngredientSelect?: (ingredient: any) => void;
  onCocktailSelect?: (cocktailName: string) => void;
}

export const IngredientSpotlight: React.FC<IngredientSpotlightProps> = ({
  onIngredientSelect,
  onCocktailSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<IngredientFilter>({});
  const [searchResults, setSearchResults] = useState<IngredientSearchResult[]>([]);
  const [seasonalSpotlight, setSeasonalSpotlight] = useState<SeasonalRecommendation | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'seasonal' | 'categories'>('search');
  const [loading, setLoading] = useState(false);

  // Load seasonal spotlight on mount
  useEffect(() => {
    const loadSeasonalSpotlight = async () => {
      const currentSeason = getCurrentSeason();
      const spotlight = await ingredientSpotlightService.getSeasonalSpotlight(currentSeason);
      setSeasonalSpotlight(spotlight);
    };

    loadSeasonalSpotlight();
  }, []);

  // Search ingredients when query or filters change
  useEffect(() => {
    const searchIngredients = async () => {
      if (searchQuery.trim()) {
        setLoading(true);
        const results = await ingredientSpotlightService.searchIngredients(searchQuery, selectedFilters);
        setSearchResults(results);
        setLoading(false);
      } else {
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchIngredients, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedFilters]);

  const getCurrentSeason = (): string => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  };

  const handleFilterChange = (filterType: keyof IngredientFilter, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value === 'all' ? undefined : value
    }));
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
            Discover cocktails by exploring our premium spirits, liqueurs, and mixers. 
            Find the perfect ingredient for your next drink.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800 rounded-lg p-1 flex">
            {[
              { id: 'search', label: 'Search', icon: '🔍' },
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
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search ingredients... (e.g., 'vodka', 'coffee', 'gin')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price Point</label>
                <select
                  value={selectedFilters.pricePoint || 'all'}
                  onChange={(e) => handleFilterChange('pricePoint', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Prices</option>
                  <option value="budget">Budget</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Upsell Potential</label>
                <select
                  value={selectedFilters.upsellPotential || 'all'}
                  onChange={(e) => handleFilterChange('upsellPotential', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="very-high">Very High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Inventory Priority</label>
                <select
                  value={selectedFilters.inventoryPriority || 'all'}
                  onChange={(e) => handleFilterChange('inventoryPriority', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All</option>
                  <option value="very_high">Very High</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Season</label>
                <select
                  value={selectedFilters.season || 'all'}
                  onChange={(e) => handleFilterChange('season', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Seasons</option>
                  <option value="spring">Spring</option>
                  <option value="summer">Summer</option>
                  <option value="fall">Fall</option>
                  <option value="winter">Winter</option>
                </select>
              </div>
            </div>

            {/* Search Results */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                <p className="mt-2 text-gray-300">Searching ingredients...</p>
              </div>
            )}

            {!loading && searchResults.length > 0 && (
              <div className="grid gap-4">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => handleIngredientClick(result.ingredient)}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:bg-slate-700 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {result.ingredient.name}
                      </h3>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          result.ingredient.tier === 'premium' ? 'bg-purple-600 text-white' :
                          result.ingredient.tier === 'craft' ? 'bg-blue-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {result.ingredient.tier}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-600 text-white">
                          {result.ingredient.price_point}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        {result.ingredient.flavor_profile?.map((flavor: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-slate-700 rounded text-sm text-gray-300">
                            {flavor}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-400 mb-2">Best for:</p>
                      <div className="flex flex-wrap gap-2">
                        {result.suggestedCocktails.map((cocktail, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCocktailClick(cocktail);
                            }}
                            className="px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-sm text-white transition-colors"
                          >
                            {cocktail}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Match reasons: {result.matchReasons.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && searchQuery && searchResults.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No ingredients found matching your search.</p>
              </div>
            )}
          </div>
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
