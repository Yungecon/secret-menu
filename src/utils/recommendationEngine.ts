import { Cocktail, QuizAnswers, RecommendationResult } from '../types';
import cocktailData from '../../secret_menu_mvp_cocktails.json';

export const generateRecommendations = (answers: QuizAnswers): RecommendationResult => {
  const cocktails = cocktailData as Cocktail[];
  
  // Score each cocktail based on quiz answers
  const scoredCocktails = cocktails.map(cocktail => {
    let score = 0;
    
    // Flavor preference scoring (40% weight)
    if (answers.sweetVsBitter === 'sweet') {
      if (cocktail.flavor_tags.some(tag => ['sweet', 'fruity', 'citrus'].includes(tag))) score += 40;
    } else if (answers.sweetVsBitter === 'bitter') {
      if (cocktail.flavor_tags.some(tag => ['bitter', 'dry', 'herbal'].includes(tag))) score += 40;
    }
    
    // Style preference scoring (30% weight)  
    if (answers.lightVsBoozy === 'light') {
      if (cocktail.flavor_tags.some(tag => ['light', 'refreshing', 'bubbly'].includes(tag))) score += 30;
      if (cocktail.build_type === 'Build' || cocktail.style.includes('Highball')) score += 10;
    } else if (answers.lightVsBoozy === 'boozy') {
      if (cocktail.flavor_tags.some(tag => ['boozy', 'spirit-forward', 'rich'].includes(tag))) score += 30;
      if (cocktail.build_type === 'Stirred' || cocktail.style.includes('Old Fashioned')) score += 10;
    }
    
    // Mood scoring (20% weight)
    if (cocktail.mood_tags.some(tag => ['elegant', 'sophisticated', 'celebratory'].includes(tag))) {
      score += 20;
    }
    
    // Random factor for variety (10% weight)
    score += Math.random() * 10;
    
    return { cocktail, score };
  });
  
  // Sort by score and get top results
  const sortedCocktails = scoredCocktails.sort((a, b) => b.score - a.score);
  
  const primary = sortedCocktails[0].cocktail;
  const adjacent = sortedCocktails.slice(1, 4).map(item => item.cocktail);
  
  return {
    primary,
    adjacent,
    matchScore: Math.round(sortedCocktails[0].score)
  };
};