// Application constants
export const APP_CONFIG = {
  name: 'Secret Cocktail Menu',
  version: '1.0.0',
  description: 'Discover your perfect cocktail through magical taste preferences'
} as const;

export const ROUTES = {
  HOME: '/',
  QUIZ: '/quiz',
  RESULTS: '/results'
} as const;

export const ANIMATION_DELAYS = {
  SHORT: 300,
  MEDIUM: 500,
  LONG: 1000,
  COMPLIMENT: 2500
} as const;

export const QUIZ_CONFIG = {
  TOTAL_QUESTIONS: 5,
  MIN_SWIPE_DISTANCE: 50,
  COMPLIMENT_DISPLAY_TIME: 2500
} as const;

export const ANALYTICS_EVENTS = {
  QUIZ_START: 'quiz_start',
  QUESTION_ANSWERED: 'question_answered',
  QUIZ_COMPLETED: 'quiz_completed',
  RECOMMENDATION_VIEWED: 'recommendation_viewed',
  QUIZ_RESTART: 'quiz_restart'
} as const;

// Data file paths
export const DATA_PATHS = {
  ENHANCED_COCKTAIL_LIBRARY: '/enhanced_cocktail_library.json',
  FLAVOR_JOURNEY_DATA: '/flavor_journey_data.json',
  INGREDIENT_MATRIX: '/ingredient_matrix.json',
  SECRET_MENU_COCKTAILS: '/secret_menu_mvp_cocktails.json'
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  COCKTAIL_GENERATION: 'Failed to generate cocktails. Please try again.',
  DATA_LOADING: 'Failed to load data. Please refresh the page.'
} as const;

// Feature flags
export const FEATURES = {
  ANALYTICS: process.env.NODE_ENV === 'production',
  SOUND_EFFECTS: true,
  PWA_INSTALL: true,
  DEBUG_LOGGING: process.env.NODE_ENV === 'development'
} as const;