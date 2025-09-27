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
  sweetVsBitter?: 'sweet' | 'bitter';
  citrusVsStone?: 'citrus' | 'stone';
  lightVsBoozy?: 'light' | 'boozy';
  classicVsExperimental?: 'classic' | 'experimental';
  spiritPreference?: string;
  moodPreference?: string;
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