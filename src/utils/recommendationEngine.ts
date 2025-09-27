import { Cocktail, QuizAnswers, RecommendationResult } from '../types';
import cocktailData from '../../secret_menu_mvp_cocktails.json';

export const generateRecommendations = (answers: QuizAnswers): RecommendationResult => {
  const cocktails = cocktailData as Cocktail[];
  
  // Score each cocktail based on quiz answers with a base score system that ensures high matches
  const scoredCocktails = cocktails.map(cocktail => {
    let score = 75; // Start with a high base score for magical feeling
    let matchingFactors = 0;
    
    // Flavor preference scoring - Major factor
    if (answers.sweetVsBitter === 'sweet') {
      if (cocktail.flavor_tags.some(tag => ['sweet', 'fruity'].includes(tag))) {
        score += 15;
        matchingFactors++;
      }
      if (cocktail.flavor_tags.some(tag => ['bitter', 'dry'].includes(tag))) score -= 5;
    } else if (answers.sweetVsBitter === 'bitter') {
      if (cocktail.flavor_tags.some(tag => ['bitter', 'dry', 'herbal'].includes(tag))) {
        score += 15;
        matchingFactors++;
      }
      if (cocktail.flavor_tags.some(tag => ['sweet', 'fruity'].includes(tag))) score -= 5;
    }
    
    // Citrus vs Stone fruit preference
    if (answers.citrusVsStone === 'citrus') {
      if (cocktail.flavor_tags.some(tag => ['citrus', 'bright'].includes(tag))) {
        score += 12;
        matchingFactors++;
      }
      if (cocktail.ingredients.some(ing => 
        ing.toLowerCase().includes('lemon') || 
        ing.toLowerCase().includes('lime') || 
        ing.toLowerCase().includes('grapefruit') ||
        ing.toLowerCase().includes('citrus')
      )) {
        score += 8;
        matchingFactors++;
      }
    } else if (answers.citrusVsStone === 'stone') {
      if (cocktail.flavor_tags.some(tag => ['rich', 'deep', 'fruity'].includes(tag))) {
        score += 12;
        matchingFactors++;
      }
    }
    
    // Style preference scoring - Major factor
    if (answers.lightVsBoozy === 'light') {
      if (cocktail.flavor_tags.some(tag => ['light', 'refreshing', 'bubbly', 'long'].includes(tag))) {
        score += 12;
        matchingFactors++;
      }
      if (cocktail.build_type === 'Build' || 
          cocktail.build_type === 'Build/Top' ||
          cocktail.style.includes('Highball') || 
          cocktail.style.includes('Collins') ||
          cocktail.style.includes('Fizz')) {
        score += 8;
        matchingFactors++;
      }
    } else if (answers.lightVsBoozy === 'boozy') {
      if (cocktail.flavor_tags.some(tag => ['boozy', 'spirit-forward', 'rich', 'aromatic'].includes(tag))) {
        score += 12;
        matchingFactors++;
      }
      if (cocktail.build_type === 'Stirred' || 
          cocktail.style.includes('Old Fashioned') || 
          cocktail.style.includes('Manhattan') ||
          cocktail.style.includes('Martini')) {
        score += 8;
        matchingFactors++;
      }
    }
    
    // Classic vs Experimental preference
    if (answers.classicVsExperimental === 'classic') {
      if (cocktail.style.includes('Old Fashioned') || 
          cocktail.style.includes('Manhattan') || 
          cocktail.style.includes('Martini') ||
          cocktail.style.includes('Sour')) {
        score += 10;
        matchingFactors++;
      }
    } else if (answers.classicVsExperimental === 'experimental') {
      if (cocktail.style.includes('Smash') || 
          cocktail.style.includes('Spritz') || 
          cocktail.style.includes('Daisy') ||
          cocktail.flavor_tags.includes('seasonal') ||
          cocktail.flavor_tags.includes('herbal')) {
        score += 10;
        matchingFactors++;
      }
    }
    
    // Mood scoring - Perfect match bonus
    if (answers.moodPreference && cocktail.mood_tags.includes(answers.moodPreference)) {
      score += 15;
      matchingFactors++;
    }
    
    // General mood alignment bonus
    if (cocktail.mood_tags.some(tag => ['elegant', 'sophisticated', 'celebratory', 'cozy'].includes(tag))) {
      score += 5;
    }
    
    // Premium bonus for sophisticated cocktails
    if (cocktail.flavor_tags.some(tag => ['elegant', 'balanced', 'sophisticated'].includes(tag))) {
      score += 8;
    }
    
    // Multiple matching factors bonus (creates higher scores for better matches)
    if (matchingFactors >= 3) score += 10;
    if (matchingFactors >= 4) score += 5;
    if (matchingFactors >= 5) score += 5;
    
    // Ensure minimum score for magical feeling
    score = Math.max(score, 85);
    
    return { cocktail, score, matchingFactors };
  });
  
  // Sort by score and matching factors
  const sortedCocktails = scoredCocktails.sort((a, b) => {
    if (b.score === a.score) {
      return b.matchingFactors - a.matchingFactors;
    }
    return b.score - a.score;
  });
  
  // Get primary recommendation
  const primary = sortedCocktails[0].cocktail;
  
  // Get adjacent recommendations with good scores
  const adjacent = sortedCocktails
    .slice(1)
    .filter(item => 
      item.score >= 85 && // Only show high-scoring alternatives
      (item.cocktail.build_type !== primary.build_type || 
       item.cocktail.style !== primary.style ||
       item.cocktail.base_spirit_category !== primary.base_spirit_category)
    )
    .slice(0, 3)
    .map(item => item.cocktail);
  
  // Ensure the match score feels magical (90-98%)
  const finalScore = Math.min(98, Math.max(90, sortedCocktails[0].score));
  
  return {
    primary,
    adjacent,
    matchScore: finalScore
  };
};