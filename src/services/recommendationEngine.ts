import { Cocktail, QuizAnswers, RecommendationResult, EnhancedQuizAnswers } from '../types';
import cocktailData from '../assets/data/secret_menu_mvp_cocktails.json';

// Fuzzy matching helper functions
const hasIngredient = (cocktail: Cocktail, ingredients: string[]): boolean => {
  return cocktail.ingredients.some(ing => 
    ingredients.some(target => ing.toLowerCase().includes(target.toLowerCase()))
  );
};

const hasSweetIngredients = (cocktail: Cocktail): boolean => {
  return hasIngredient(cocktail, [
    'simple syrup', 'honey', 'agave', 'cream', 'chocolate', 'vanilla', 
    'caramel', 'sugar', 'grenadine', 'amaretto', 'baileys'
  ]);
};

const hasBitterIngredients = (cocktail: Cocktail): boolean => {
  return hasIngredient(cocktail, [
    'bitters', 'campari', 'aperol', 'amaro', 'vermouth', 'fernet'
  ]) || cocktail.base_spirit_category.includes('Whiskey');
};

const hasCitrusIngredients = (cocktail: Cocktail): boolean => {
  return hasIngredient(cocktail, [
    'lemon', 'lime', 'grapefruit', 'orange', 'citrus'
  ]);
};

const hasTropicalIngredients = (cocktail: Cocktail): boolean => {
  return hasIngredient(cocktail, [
    'pineapple', 'coconut', 'mango', 'passion fruit', 'guava', 'rum'
  ]) || cocktail.base_spirit_category.includes('Rum');
};

const hasStoneIngredients = (cocktail: Cocktail): boolean => {
  return hasIngredient(cocktail, [
    'peach', 'apricot', 'plum', 'cherry', 'brandied cherry'
  ]) || cocktail.base_spirit_category.includes('Brandy');
};

// Enhanced fuzzy matching functions for balanced preferences
const hasBalancedIngredients = (cocktail: Cocktail): boolean => {
  // Balanced cocktails often have vermouth, equal parts, or neutral spirits
  return hasIngredient(cocktail, [
    'vermouth', 'lillet', 'cocchi', 'dolin', 'dry vermouth', 'sweet vermouth'
  ]) || cocktail.build_type === 'Equal Parts' || 
     cocktail.base_spirit_category === 'Vodka' ||
     cocktail.flavor_tags.includes('balanced');
};

const hasMediumIntensityIngredients = (cocktail: Cocktail): boolean => {
  // Medium intensity cocktails often have moderate alcohol content
  return cocktail.build_type === 'Shaken' || 
         cocktail.style.includes('Sour') || 
         cocktail.style.includes('Daisy') ||
         cocktail.flavor_tags.some(tag => ['medium', 'versatile', 'balanced'].includes(tag));
};

// Enhanced fuzzy matching with metadata tracking
const performFuzzyMatching = (cocktail: Cocktail, answers: EnhancedQuizAnswers): { score: number; fuzzyMatches: string[] } => {
  let fuzzyScore = 0;
  const fuzzyMatches: string[] = [];
  
  // Sweetness fuzzy matching
  if (answers.sweetVsBitter === 'sweet' && hasSweetIngredients(cocktail)) {
    fuzzyScore += 12;
    fuzzyMatches.push('sweet-ingredients');
  } else if (answers.sweetVsBitter === 'bitter' && hasBitterIngredients(cocktail)) {
    fuzzyScore += 12;
    fuzzyMatches.push('bitter-ingredients');
  } else if (answers.sweetVsBitter === 'balanced' && hasBalancedIngredients(cocktail)) {
    fuzzyScore += 15;
    fuzzyMatches.push('balanced-ingredients');
  }
  
  // Fruit family fuzzy matching
  if (answers.citrusVsStone === 'citrus' && hasCitrusIngredients(cocktail)) {
    fuzzyScore += 10;
    fuzzyMatches.push('citrus-ingredients');
  } else if (answers.citrusVsStone === 'stone' && hasStoneIngredients(cocktail)) {
    fuzzyScore += 10;
    fuzzyMatches.push('stone-ingredients');
  } else if (answers.citrusVsStone === 'tropical' && hasTropicalIngredients(cocktail)) {
    fuzzyScore += 10;
    fuzzyMatches.push('tropical-ingredients');
  }
  
  // Intensity fuzzy matching
  if (answers.lightVsBoozy === 'light' && (cocktail.build_type === 'Build' || cocktail.build_type === 'Build/Top')) {
    fuzzyScore += 8;
    fuzzyMatches.push('light-build');
  } else if (answers.lightVsBoozy === 'boozy' && (cocktail.build_type === 'Stirred' || cocktail.flavor_tags.includes('spirit-forward'))) {
    fuzzyScore += 8;
    fuzzyMatches.push('boozy-build');
  } else if (answers.lightVsBoozy === 'medium' && hasMediumIntensityIngredients(cocktail)) {
    fuzzyScore += 10;
    fuzzyMatches.push('medium-build');
  }
  
  return { score: fuzzyScore, fuzzyMatches };
};

export const generateRecommendations = (answers: QuizAnswers): RecommendationResult => {
  const cocktails = cocktailData as Cocktail[];
  
  // Score each cocktail based on quiz answers with enhanced fuzzy matching
  const scoredCocktails = cocktails.map(cocktail => {
    let score = 75; // Start with a high base score for magical feeling
    let matchingFactors = 0;
    
    // Enhanced flavor preference scoring with fuzzy matching
    if (answers.sweetVsBitter === 'sweet') {
      // Tag-based matching
      if (cocktail.flavor_tags.some(tag => ['sweet', 'fruity'].includes(tag))) {
        score += 15;
        matchingFactors++;
      }
      // Fuzzy ingredient matching
      if (hasSweetIngredients(cocktail)) {
        score += 12;
        matchingFactors++;
      }
      // Penalty for bitter
      if (cocktail.flavor_tags.some(tag => ['bitter', 'dry'].includes(tag))) score -= 5;
    } else if (answers.sweetVsBitter === 'bitter') {
      // Tag-based matching
      if (cocktail.flavor_tags.some(tag => ['bitter', 'dry', 'herbal'].includes(tag))) {
        score += 15;
        matchingFactors++;
      }
      // Fuzzy ingredient matching
      if (hasBitterIngredients(cocktail)) {
        score += 12;
        matchingFactors++;
      }
      // Penalty for sweet
      if (cocktail.flavor_tags.some(tag => ['sweet', 'fruity'].includes(tag))) score -= 5;
    } else if (answers.sweetVsBitter === 'balanced') {
      // Balanced prefers cocktails with both elements or neutral profiles
      if (cocktail.flavor_tags.some(tag => ['balanced', 'harmonious', 'elegant'].includes(tag))) {
        score += 15;
        matchingFactors++;
      }
      // Bonus for cocktails that aren't extremely sweet or bitter
      if (!cocktail.flavor_tags.some(tag => ['bitter', 'sweet'].includes(tag))) {
        score += 8;
        matchingFactors++;
      }
    }
    
    // Enhanced fruit preference scoring
    if (answers.citrusVsStone === 'citrus') {
      // Tag-based matching
      if (cocktail.flavor_tags.some(tag => ['citrus', 'bright'].includes(tag))) {
        score += 12;
        matchingFactors++;
      }
      // Fuzzy ingredient matching
      if (hasCitrusIngredients(cocktail)) {
        score += 10;
        matchingFactors++;
      }
    } else if (answers.citrusVsStone === 'stone') {
      // Tag-based matching
      if (cocktail.flavor_tags.some(tag => ['rich', 'deep', 'fruity', 'stone'].includes(tag))) {
        score += 12;
        matchingFactors++;
      }
      // Fuzzy ingredient matching
      if (hasStoneIngredients(cocktail)) {
        score += 10;
        matchingFactors++;
      }
    } else if (answers.citrusVsStone === 'tropical') {
      // Tag-based matching
      if (cocktail.flavor_tags.some(tag => ['tropical', 'exotic', 'fruity'].includes(tag))) {
        score += 12;
        matchingFactors++;
      }
      // Fuzzy ingredient matching
      if (hasTropicalIngredients(cocktail)) {
        score += 10;
        matchingFactors++;
      }
    }
    
    // Enhanced style preference scoring
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
    } else if (answers.lightVsBoozy === 'medium') {
      // Medium prefers balanced cocktails - not too light, not too boozy
      if (cocktail.flavor_tags.some(tag => ['medium', 'versatile', 'balanced'].includes(tag))) {
        score += 12;
        matchingFactors++;
      }
      if (cocktail.build_type === 'Shaken' || 
          cocktail.style.includes('Sour') || 
          cocktail.style.includes('Daisy')) {
        score += 8;
        matchingFactors++;
      }
    }
    
    // Enhanced classic vs experimental preference
    if (answers.classicVsExperimental === 'classic') {
      if (cocktail.style.includes('Old Fashioned') || 
          cocktail.style.includes('Manhattan') || 
          cocktail.style.includes('Martini') ||
          cocktail.style.includes('Sour')) {
        score += 10;
        matchingFactors++;
      }
      if (cocktail.flavor_tags.some(tag => ['classic', 'timeless', 'traditional'].includes(tag))) {
        score += 8;
        matchingFactors++;
      }
    } else if (answers.classicVsExperimental === 'modern') {
      // Modern prefers contemporary interpretations of classics
      if (cocktail.flavor_tags.some(tag => ['modern', 'refined', 'contemporary'].includes(tag))) {
        score += 10;
        matchingFactors++;
      }
      if (cocktail.style.includes('Collins') || 
          cocktail.style.includes('Fizz') || 
          cocktail.style.includes('Mule')) {
        score += 8;
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
      if (cocktail.flavor_tags.some(tag => ['experimental', 'bold', 'innovative'].includes(tag))) {
        score += 8;
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

// Enhanced recommendation engine with fuzzy matching metadata
export const generateEnhancedRecommendations = (answers: EnhancedQuizAnswers): RecommendationResult & { fuzzyMatches?: string[]; fallbackUsed?: boolean } => {
  const cocktails = cocktailData as Cocktail[];
  
  // Score each cocktail with enhanced fuzzy matching
  const scoredCocktails = cocktails.map(cocktail => {
    let score = 75; // Start with a high base score for magical feeling
    let matchingFactors = 0;
    let fuzzyMatches: string[] = [];
    let fallbackUsed = false;
    
    // Enhanced flavor preference scoring with fuzzy matching
    if (answers.sweetVsBitter === 'sweet') {
      // Tag-based matching
      if (cocktail.flavor_tags.some(tag => ['sweet', 'fruity'].includes(tag))) {
        score += 15;
        matchingFactors++;
      } else {
        // Use fuzzy matching as fallback
        const fuzzyResult = performFuzzyMatching(cocktail, answers);
        if (fuzzyResult.fuzzyMatches.includes('sweet-ingredients')) {
          score += 12;
          matchingFactors++;
          fuzzyMatches.push(...fuzzyResult.fuzzyMatches);
          fallbackUsed = true;
        }
      }
      // Penalty for bitter
      if (cocktail.flavor_tags.some(tag => ['bitter', 'dry'].includes(tag))) score -= 5;
    } else if (answers.sweetVsBitter === 'bitter') {
      // Tag-based matching
      if (cocktail.flavor_tags.some(tag => ['bitter', 'dry', 'herbal'].includes(tag))) {
        score += 15;
        matchingFactors++;
      } else {
        // Use fuzzy matching as fallback
        const fuzzyResult = performFuzzyMatching(cocktail, answers);
        if (fuzzyResult.fuzzyMatches.includes('bitter-ingredients')) {
          score += 12;
          matchingFactors++;
          fuzzyMatches.push(...fuzzyResult.fuzzyMatches);
          fallbackUsed = true;
        }
      }
      // Penalty for sweet
      if (cocktail.flavor_tags.some(tag => ['sweet', 'fruity'].includes(tag))) score -= 5;
    } else if (answers.sweetVsBitter === 'balanced') {
      // Tag-based matching
      if (cocktail.flavor_tags.some(tag => ['balanced', 'harmonious', 'elegant'].includes(tag))) {
        score += 15;
        matchingFactors++;
      } else {
        // Use fuzzy matching as fallback
        const fuzzyResult = performFuzzyMatching(cocktail, answers);
        if (fuzzyResult.fuzzyMatches.includes('balanced-ingredients')) {
          score += 15;
          matchingFactors++;
          fuzzyMatches.push(...fuzzyResult.fuzzyMatches);
          fallbackUsed = true;
        }
      }
      // Bonus for cocktails that aren't extremely sweet or bitter
      if (!cocktail.flavor_tags.some(tag => ['bitter', 'sweet'].includes(tag))) {
        score += 8;
        matchingFactors++;
      }
    }
    
    // Enhanced fruit preference scoring
    if (answers.citrusVsStone === 'citrus') {
      // Tag-based matching
      if (cocktail.flavor_tags.some(tag => ['citrus', 'bright'].includes(tag))) {
        score += 12;
        matchingFactors++;
      } else {
        // Use fuzzy matching as fallback
        const fuzzyResult = performFuzzyMatching(cocktail, answers);
        if (fuzzyResult.fuzzyMatches.includes('citrus-ingredients')) {
          score += 10;
          matchingFactors++;
          fuzzyMatches.push(...fuzzyResult.fuzzyMatches);
          fallbackUsed = true;
        }
      }
    } else if (answers.citrusVsStone === 'stone') {
      // Tag-based matching
      if (cocktail.flavor_tags.some(tag => ['rich', 'deep', 'fruity', 'stone'].includes(tag))) {
        score += 12;
        matchingFactors++;
      } else {
        // Use fuzzy matching as fallback
        const fuzzyResult = performFuzzyMatching(cocktail, answers);
        if (fuzzyResult.fuzzyMatches.includes('stone-ingredients')) {
          score += 10;
          matchingFactors++;
          fuzzyMatches.push(...fuzzyResult.fuzzyMatches);
          fallbackUsed = true;
        }
      }
    } else if (answers.citrusVsStone === 'tropical') {
      // Tag-based matching
      if (cocktail.flavor_tags.some(tag => ['tropical', 'exotic', 'fruity'].includes(tag))) {
        score += 12;
        matchingFactors++;
      } else {
        // Use fuzzy matching as fallback
        const fuzzyResult = performFuzzyMatching(cocktail, answers);
        if (fuzzyResult.fuzzyMatches.includes('tropical-ingredients')) {
          score += 10;
          matchingFactors++;
          fuzzyMatches.push(...fuzzyResult.fuzzyMatches);
          fallbackUsed = true;
        }
      }
    }
    
    // Enhanced style preference scoring
    if (answers.lightVsBoozy === 'light') {
      if (cocktail.flavor_tags.some(tag => ['light', 'refreshing', 'bubbly', 'long'].includes(tag))) {
        score += 12;
        matchingFactors++;
      } else {
        // Use fuzzy matching as fallback
        const fuzzyResult = performFuzzyMatching(cocktail, answers);
        if (fuzzyResult.fuzzyMatches.includes('light-build')) {
          score += 8;
          matchingFactors++;
          fuzzyMatches.push(...fuzzyResult.fuzzyMatches);
          fallbackUsed = true;
        }
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
      } else {
        // Use fuzzy matching as fallback
        const fuzzyResult = performFuzzyMatching(cocktail, answers);
        if (fuzzyResult.fuzzyMatches.includes('boozy-build')) {
          score += 8;
          matchingFactors++;
          fuzzyMatches.push(...fuzzyResult.fuzzyMatches);
          fallbackUsed = true;
        }
      }
      if (cocktail.build_type === 'Stirred' || 
          cocktail.style.includes('Old Fashioned') || 
          cocktail.style.includes('Manhattan') ||
          cocktail.style.includes('Martini')) {
        score += 8;
        matchingFactors++;
      }
    } else if (answers.lightVsBoozy === 'medium') {
      // Medium prefers balanced cocktails - not too light, not too boozy
      if (cocktail.flavor_tags.some(tag => ['medium', 'versatile', 'balanced'].includes(tag))) {
        score += 12;
        matchingFactors++;
      } else {
        // Use fuzzy matching as fallback
        const fuzzyResult = performFuzzyMatching(cocktail, answers);
        if (fuzzyResult.fuzzyMatches.includes('medium-build')) {
          score += 10;
          matchingFactors++;
          fuzzyMatches.push(...fuzzyResult.fuzzyMatches);
          fallbackUsed = true;
        }
      }
      if (cocktail.build_type === 'Shaken' || 
          cocktail.style.includes('Sour') || 
          cocktail.style.includes('Daisy')) {
        score += 8;
        matchingFactors++;
      }
    }
    
    // Enhanced classic vs experimental preference
    if (answers.classicVsExperimental === 'classic') {
      if (cocktail.style.includes('Old Fashioned') || 
          cocktail.style.includes('Manhattan') || 
          cocktail.style.includes('Martini') ||
          cocktail.style.includes('Sour')) {
        score += 10;
        matchingFactors++;
      }
      if (cocktail.flavor_tags.some(tag => ['classic', 'timeless', 'traditional'].includes(tag))) {
        score += 8;
        matchingFactors++;
      }
    } else if (answers.classicVsExperimental === 'modern') {
      // Modern prefers contemporary interpretations of classics
      if (cocktail.flavor_tags.some(tag => ['modern', 'refined', 'contemporary'].includes(tag))) {
        score += 10;
        matchingFactors++;
      }
      if (cocktail.style.includes('Collins') || 
          cocktail.style.includes('Fizz') || 
          cocktail.style.includes('Mule')) {
        score += 8;
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
      if (cocktail.flavor_tags.some(tag => ['experimental', 'bold', 'innovative'].includes(tag))) {
        score += 8;
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
    
    return { cocktail, score, matchingFactors, fuzzyMatches, fallbackUsed };
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
  
  // Collect fuzzy matching metadata
  const allFuzzyMatches = sortedCocktails[0].fuzzyMatches || [];
  const fallbackWasUsed = sortedCocktails[0].fallbackUsed || false;
  
  return {
    primary,
    adjacent,
    matchScore: finalScore,
    fuzzyMatches: allFuzzyMatches,
    fallbackUsed: fallbackWasUsed
  };
};