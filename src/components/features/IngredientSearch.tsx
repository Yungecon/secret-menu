import React, { useState, useEffect, useCallback } from 'react';
import { ingredientSpotlightService, IngredientFilter, IngredientSearchResult } from '../../services/ingredientSpotlightService';

interface IngredientSearchProps {
  onIngredientSelect?: (ingredient: any) => void;
  onCocktailSelect?: (cocktailName: string) => void;
  initialQuery?: string;
  initialFilters?: IngredientFilter;
}

export const IngredientSearch: React.FC<IngredientSearchProps> = ({
  onIngredientSelect,
  onCocktailSelect,
  initialQuery = '',
  initialFilters = {}
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedFilters, setSelectedFilters] = useState<IngredientFilter>(initialFilters);
  const [searchResults, setSearchResults] = useState<IngredientSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string, filters: IngredientFilter) => {
      if (query.trim()) {
        setLoading(true);
        try {
          const results = await ingredientSpotlightService.searchIngredients(query, filters);
          setSearchResults(results);
          
          // Add to search history
          if (query && !searchHistory.includes(query)) {
            setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
          }
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300),
    [searchHistory]
  );

  // Generate search suggestions
  const generateSuggestions = useCallback(async (query: string) => {
    if (query.length >= 2) {
      try {
        // Get ingredient stats to generate suggestions
        const stats = ingredientSpotlightService.getIngredientStats();
        const suggestionTerms = [
          ...Object.keys(stats.byCategory || {}),
          'vodka', 'gin', 'tequila', 'whiskey', 'rum', 'mezcal',
          'coffee', 'chocolate', 'citrus', 'floral', 'smoky',
          'premium', 'budget', 'seasonal', 'classic', 'modern'
        ];
        
        const filteredSuggestions = suggestionTerms
          .filter(term => term.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5);
        
        setSuggestions(filteredSuggestions);
        setShowSuggestions(filteredSuggestions.length > 0);
      } catch (error) {
        console.error('Suggestions error:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  // Search when query or filters change
  useEffect(() => {
    debouncedSearch(searchQuery, selectedFilters);
  }, [searchQuery, selectedFilters, debouncedSearch]);

  // Generate suggestions when query changes
  useEffect(() => {
    generateSuggestions(searchQuery);
  }, [searchQuery, generateSuggestions]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleHistoryClick = (historyItem: string) => {
    setSearchQuery(historyItem);
    setShowSuggestions(false);
  };

  const handleFilterChange = (filterType: keyof IngredientFilter, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value === 'all' ? undefined : value
    }));
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setSelectedFilters({});
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Enhanced Search Bar */}
      <div className="relative mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search ingredients... (e.g., 'vodka', 'coffee', 'gin', 'smoky')"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(searchQuery.length >= 2 || searchHistory.length > 0)}
            className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg pr-12"
          />
          
          {/* Search Icon */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
            ) : (
              <span className="text-gray-400">🔍</span>
            )}
          </div>

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="p-3 border-b border-slate-700">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Recent Searches</h4>
                <div className="space-y-1">
                  {searchHistory.slice(0, 3).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistoryClick(item)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-slate-700 rounded transition-colors flex items-center gap-2"
                    >
                      <span>🕒</span>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-3">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Suggestions</h4>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-slate-700 rounded transition-colors flex items-center gap-2"
                    >
                      <span>💡</span>
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Price Point</label>
          <select
            value={selectedFilters.pricePoint || 'all'}
            onChange={(e) => handleFilterChange('pricePoint', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Prices</option>
            <option value="budget">💰 Budget</option>
            <option value="medium">💎 Medium</option>
            <option value="high">👑 High</option>
            <option value="premium">💎 Premium</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Upsell Potential</label>
          <select
            value={selectedFilters.upsellPotential || 'all'}
            onChange={(e) => handleFilterChange('upsellPotential', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Levels</option>
            <option value="low">📈 Low</option>
            <option value="medium">📊 Medium</option>
            <option value="high">🚀 High</option>
            <option value="very-high">⭐ Very High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Inventory Priority</label>
          <select
            value={selectedFilters.inventoryPriority || 'all'}
            onChange={(e) => handleFilterChange('inventoryPriority', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Priorities</option>
            <option value="very_high">🔴 Very High</option>
            <option value="high">🟡 High</option>
            <option value="medium">🟢 Medium</option>
            <option value="low">⚪ Low</option>
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
            <option value="spring">🌸 Spring</option>
            <option value="summer">☀️ Summer</option>
            <option value="fall">🍂 Fall</option>
            <option value="winter">❄️ Winter</option>
          </select>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
          </span>
          
          {/* Active Filters */}
          {Object.values(selectedFilters).some(filter => filter !== undefined) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Active filters:</span>
              {Object.entries(selectedFilters).map(([key, value]) => 
                value && (
                  <span key={key} className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                    {key}: {value}
                  </span>
                )
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-400 hover:text-white underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Sort Options */}
        <select className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-white text-sm">
          <option value="relevance">Sort by Relevance</option>
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="upsell">Sort by Upsell Potential</option>
        </select>
      </div>

      {/* Enhanced Search Results */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          <p className="mt-2 text-gray-300">Searching ingredients...</p>
        </div>
      )}

      {!loading && searchResults.length > 0 && (
        <div className="grid gap-4">
          {searchResults.map((result, index) => (
            <EnhancedIngredientCard
              key={index}
              result={result}
              onIngredientClick={onIngredientSelect}
              onCocktailClick={onCocktailSelect}
            />
          ))}
        </div>
      )}

      {!loading && searchQuery && searchResults.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No ingredients found</h3>
          <p className="text-gray-400 mb-4">
            Try searching for different terms or adjusting your filters
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={clearSearch}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
            >
              Clear Search
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {!loading && !searchQuery && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🥃</div>
          <h3 className="text-xl font-semibold text-white mb-2">Discover Premium Ingredients</h3>
          <p className="text-gray-400 mb-4">
            Search for spirits, liqueurs, and mixers to find the perfect ingredients for your cocktails
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['vodka', 'gin', 'tequila', 'whiskey', 'coffee', 'citrus', 'floral'].map(term => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-full text-sm transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Ingredient Card Component
interface EnhancedIngredientCardProps {
  result: IngredientSearchResult;
  onIngredientClick?: (ingredient: any) => void;
  onCocktailClick?: (cocktailName: string) => void;
}

const EnhancedIngredientCard: React.FC<EnhancedIngredientCardProps> = ({
  result,
  onIngredientClick,
  onCocktailClick
}) => {
  const { ingredient, relevanceScore, matchReasons, suggestedCocktails } = result;

  return (
    <div
      onClick={() => onIngredientClick?.(ingredient)}
      className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:bg-slate-700 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors mb-2">
            {ingredient.name}
          </h3>
          
          {/* Relevance Score */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(relevanceScore, 100)}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-400">{relevanceScore}% match</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 ml-4">
          <span className={`px-3 py-1 rounded text-sm font-medium ${
            ingredient.tier === 'premium' ? 'bg-purple-600 text-white' :
            ingredient.tier === 'craft' ? 'bg-blue-600 text-white' :
            'bg-gray-600 text-white'
          }`}>
            {ingredient.tier}
          </span>
          <span className={`px-3 py-1 rounded text-sm font-medium ${
            ingredient.price_point === 'premium' ? 'bg-yellow-600 text-white' :
            ingredient.price_point === 'high' ? 'bg-purple-600 text-white' :
            ingredient.price_point === 'medium' ? 'bg-blue-600 text-white' :
            'bg-green-600 text-white'
          }`}>
            {ingredient.price_point}
          </span>
        </div>
      </div>

      {/* Flavor Profile */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Flavor Profile</h4>
        <div className="flex flex-wrap gap-2">
          {ingredient.flavor_profile?.map((flavor: string, idx: number) => (
            <span key={idx} className="px-2 py-1 bg-slate-700 rounded text-sm text-gray-300">
              {flavor}
            </span>
          ))}
        </div>
      </div>

      {/* Cocktail Suggestions */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Perfect for</h4>
        <div className="flex flex-wrap gap-2">
          {suggestedCocktails.map((cocktail, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                onCocktailClick?.(cocktail);
              }}
              className="px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-sm text-white transition-colors"
            >
              {cocktail}
            </button>
          ))}
        </div>
      </div>

      {/* Match Reasons */}
      <div className="text-xs text-gray-500">
        Match reasons: {matchReasons.join(', ')}
      </div>
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
