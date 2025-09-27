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
}

export interface QuizAnswers {
  sweetVsBitter?: 'sweet' | 'bitter' | 'balanced';
  citrusVsStone?: 'citrus' | 'stone' | 'tropical';
  lightVsBoozy?: 'light' | 'boozy' | 'medium';
  classicVsExperimental?: 'classic' | 'experimental' | 'modern';
  spiritPreference?: string;
  moodPreference?: string;
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