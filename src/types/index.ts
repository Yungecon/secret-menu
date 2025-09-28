export interface Cocktail {
  id: string;
  name: string;
  base_spirit_category: string;
  base_brand: string;
  style: string;
  build_type: string;
  flavor_tags: string[];
  mood_tags: string[];
  ingredients: string[];
  garnish: string;
  glassware: string;
  notes: string;
  // Enhanced properties for better tag matching
  comprehensive_tags?: string[];
  enhanced_flavor_profile?: {
    primary: string;
    secondary: string;
    intensity: number;
    sweetness: number;
    bitterness: number;
    acidity: number;
    aromatic: number;
    tags: string[];
  };
  enhanced_tags?: {
    flavor_profile: any;
    mood_tags: string[];
    style_tags: string[];
    intensity_tags: string[];
    occasion_tags: string[];
    ingredient_categories: any;
  };
}

export interface QuizAnswers {
  sweetVsBitter?: 'sweet' | 'bitter' | 'balanced';
  citrusVsStone?: 'citrus' | 'stone' | 'tropical';
  lightVsBoozy?: 'light' | 'boozy' | 'medium';
  classicVsExperimental?: 'classic' | 'experimental' | 'modern';
  moodPreference?: 'celebratory' | 'elegant' | 'cozy' | 'adventurous';
}

// Enhanced interface for the new three-option system
export interface EnhancedQuizAnswers {
  sweetVsBitter: 'sweet' | 'bitter' | 'balanced';
  citrusVsStone: 'citrus' | 'stone' | 'tropical';
  lightVsBoozy: 'light' | 'boozy' | 'medium';
  classicVsExperimental: 'classic' | 'experimental' | 'modern';
  moodPreference: 'celebratory' | 'elegant' | 'cozy' | 'adventurous';
}

// Fuzzy matching result interface
export interface FuzzyMatchResult {
  cocktail: Cocktail;
  score: number;
  matchingFactors: number;
  fuzzyMatches: string[];
  fallbackUsed: boolean;
}

// Enhanced recommendation result with fuzzy matching metadata
export interface EnhancedRecommendationResult extends RecommendationResult {
  fuzzyMatches?: string[];
  fallbackUsed?: boolean;
}

// Fuzzy matching rules for ingredient analysis
export interface FuzzyMatchingRules {
  sweetness: {
    indicators: string[];
    weight: number;
  };
  fruitFamily: {
    citrus: string[];
    stone: string[];
    tropical: string[];
  };
  intensity: {
    light: string[];
    medium: string[];
    boozy: string[];
  };
  balance: {
    indicators: string[];
    weight: number;
  };
}

export interface RecommendationResult {
  primary: Cocktail;
  adjacent: Cocktail[];
  matchScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    value: string;
    colorTheme: string;
    tags: string[];
  }[];
  category: 'flavor' | 'mood' | 'spirit' | 'style';
}

// Cocktail Build Engine Types
export interface IngredientProfile {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  flavor_profile: {
    primary: string[];
    secondary: string[];
    tertiary: string[];
    intensity: {
      overall: number;
      sweet: number;
      sour: number;
      bitter: number;
      spicy: number;
      aromatic: number;
    };
  };
  pairings: string[];
  substitutions: string[];
  best_uses: string[];
  seasonal: boolean;
  regional: string[];
  notes: string;
}

export interface CocktailTemplate {
  id: string;
  name: string;
  type: 'classic' | 'modern' | 'signature';
  description: string;
  base_structure: IngredientRole[];
  build_type: 'stirred' | 'shaken' | 'built' | 'blended';
  glassware: string;
  garnish: string[];
  variations: string[];
}

export interface IngredientRole {
  role: 'base' | 'modifier' | 'sweetener' | 'bitter' | 'citrus' | 'mixer';
  required: boolean;
  ingredient_type: string;
  proportion: {
    min: number;
    max: number;
    default: number;
  };
  alternatives: string[];
  flavor_profile: string[];
}

export interface FlavorBalance {
  sweet: number;
  sour: number;
  bitter: number;
  spicy: number;
  aromatic: number;
  alcoholic: number;
}

// Cocktail Build Engine Types
export interface RecipeGenerationRequest {
  availableIngredients: string[];
  templateId?: string;
  preferences?: {
    spiritType?: string;
    flavorProfile?: string[];
    sweetness?: number;
    strength?: number;
  };
}

export interface GeneratedRecipe {
  id: string;
  name: string;
  template_id: string;
  generated: boolean;
  ingredients: string[];
  balance_profile: FlavorBalance;
  complexity_score: number;
  seasonal_notes: string[];
  substitutions: Substitution[];
  glassware: string;
  garnish: string[];
  build_type: string;
  instructions?: string[];
}

export interface Substitution {
  original: string;
  substitute: string;
  ratio: number;
  notes: string;
  compatibility: number;
}

// Ingredient Spotlight Types
export interface IngredientMatrix {
  ingredient_matrix: {
    spirits: {
      [key: string]: {
        category: string;
        subcategories: string[];
        ingredients: any[];
      };
    };
    liqueurs: {
      [key: string]: {
        category: string;
        subcategories: string[];
        ingredients: any[];
      };
    };
    mixers: {
      [key: string]: {
        category: string;
        subcategories: string[];
        ingredients: any[];
      };
    };
  };
  filtering_categories: {
    by_spirit_type: { [key: string]: string[] };
    by_price_point: { [key: string]: string[] };
    by_season: { [key: string]: string[] };
    by_upsell_potential: { [key: string]: string[] };
  };
  inventory_priorities: { [key: string]: string[] };
  seasonal_spotlights: { [key: string]: any };
  bartender_recommendations: {
    signature_drinks: any[];
    upsell_opportunities: any[];
  };
}

export interface SpiritCategory {
  name: string;
  ingredients: any[];
  totalCount: number;
}

export interface SeasonalSpotlight {
  season: string;
  featured: string[];
  cocktails: string[];
  description: string;
}

export interface BartenderRecommendation {
  name: string;
  ingredients: string[];
  reason: string;
}

// Ingredient Spotlight Service Types
export interface IngredientFilter {
  spiritType?: string;
  pricePoint?: 'budget' | 'medium' | 'high' | 'premium';
  season?: 'spring' | 'summer' | 'fall' | 'winter';
  upsellPotential?: 'low' | 'medium' | 'high' | 'very-high';
  inventoryPriority?: 'very_high' | 'high' | 'medium' | 'low';
}

export interface IngredientSearchResult {
  ingredient: any;
  relevanceScore: number;
  matchReasons: string[];
  suggestedCocktails: string[];
}

export interface SeasonalRecommendation {
  season: string;
  featuredIngredients: any[];
  recommendedCocktails: string[];
  description: string;
}