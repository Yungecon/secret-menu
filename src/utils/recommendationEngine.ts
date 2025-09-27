import { Cocktail, QuizAnswers, RecommendationResult } from '../types';
import cocktailData from '../../secret_menu_mvp_cocktails.json';

export const generateRecommendations = (answers: QuizAnswers): RecommendationResult => {
  const cocktails = cocktailData as Cocktail[];
  
  // Score each cocktail based on quiz answers
  const scoredCocktails = cocktails.map(cocktail => {
    let score = 0;
    
    // Flavor preference scoring (30% weight)
    if (answers.sweetVsBitter === 'sweet') {
      if (cocktail.flavor_tags.some(tag => ['sweet', 'fruity'].includes(tag))) score += 30;
      if (cocktail.flavor_tags.some(tag => ['bitter', 'dry'].includes(tag))) score -= 10;
    } else if (answers.sweetVsBitter === 'bitter') {
      if (cocktail.flavor_tags.some(tag => ['bitter', 'dry', 'herbal'].includes(tag))) score += 30;
      if (cocktail.flavor_tags.some(tag => ['sweet', 'fruity'].includes(tag))) score -= 10;
    }
    
    // Citrus vs Stone fruit preference (20% weight)
    if (answers.citrusVsStone === 'citrus') {
      if (cocktail.flavor_tags.some(tag => ['citrus', 'bright'].includes(tag))) score += 20;
      if (cocktail.ingredients.some(ing => ing.toLowerCase().includes('lemon') || ing.toLowerCase().includes('lime') || ing.toLowerCase().includes('grapefruit'))) score += 10;
    } else if (answers.citrusVsStone === 'stone') {
      if (cocktail.flavor_tags.some(tag => ['rich', 'deep'].includes(tag))) score += 20;
    }
    
    // Style preference scoring (25% weight)  
    if (answers.lightVsBoozy === 'light') {
      if (cocktail.flavor_tags.some(tag => ['light', 'refreshing', 'bubbly', 'long'].includes(tag))) score += 25;
      if (cocktail.build_type === 'Build' || cocktail.style.includes('Highball') || cocktail.style.includes('Collins')) score += 10;
    } else if (answers.lightVsBoozy === 'boozy') {
      if (cocktail.flavor_tags.some(tag => ['boozy', 'spirit-forward', 'rich'].includes(tag))) score += 25;
      if (cocktail.build_type === 'Stirred' || cocktail.style.includes('Old Fashioned') || cocktail.style.includes('Manhattan')) score += 10;
    }
    
    // Classic vs Experimental preference (15% weight)
    if (answers.classicVsExperimental === 'classic') {
      if (cocktail.style.includes('Old Fashioned') || cocktail.style.includes('Manhattan') || cocktail.style.includes('Martini')) score += 15;
    } else if (answers.classicVsExperimental === 'experimental') {
      if (cocktail.style.includes('Smash') || cocktail.style.includes('Spritz') || cocktail.flavor_tags.includes('seasonal')) score += 15;
    }
    
    // Mood scoring (10% weight)
    if (answers.moodPreference && cocktail.mood_tags.includes(answers.moodPreference)) {
      score += 10;
    }
    
    // Bonus points for mood alignment
    if (cocktail.mood_tags.some(tag => ['elegant', 'sophisticated', 'celebratory'].includes(tag))) {
      score += 5;
    }
    
    return { cocktail, score };
  });
  
  // Sort by score and get top results
  const sortedCocktails = scoredCocktails.sort((a, b) => b.score - a.score);
  
  // Get primary recommendation
  const primary = sortedCocktails[0].cocktail;
  
  // Get adjacent recommendations from same flavor family but different styles
  const adjacent = sortedCocktails
    .slice(1)
    .filter(item => 
      // Different build type or style from primary
      item.cocktail.build_type !== primary.build_type || 
      item.cocktail.style !== primary.style
    )
    .slice(0, 3)
    .map(item => item.cocktail);
  
  return {
    primary,
    adjacent,
    matchScore: Math.round(sortedCocktails[0].score)
  };
};