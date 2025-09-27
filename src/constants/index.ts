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