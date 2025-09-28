import { Cocktail, QuizAnswers, RecommendationResult, EnhancedQuizAnswers } from '../types';
import { DATA_PATHS } from '../constants';

// Load sophisticated cocktail library
let cocktailData: Cocktail[] = [];

// Track recently shown cocktails to avoid repetition
let recentlyShownCocktails: Set<string> = new Set();
const MAX_RECENT_COCKTAILS = 20; // Keep track of last 20 shown cocktails

// Function to filter out recently shown cocktails
const filterRecentlyShown = (cocktails: Cocktail[]): Cocktail[] => {
  return cocktails.filter(cocktail => !recentlyShownCocktails.has(cocktail.id));
};

// Function to add cocktail to recently shown list
const addToRecentlyShown = (cocktail: Cocktail) => {
  recentlyShownCocktails.add(cocktail.id);
  
  // Keep only the most recent cocktails
  if (recentlyShownCocktails.size > MAX_RECENT_COCKTAILS) {
    const cocktailsArray = Array.from(recentlyShownCocktails);
    recentlyShownCocktails = new Set(cocktailsArray.slice(-MAX_RECENT_COCKTAILS));
  }
};

// Function to reset recently shown cocktails (call when starting new quiz)
export const resetRecentlyShownCocktails = () => {
  recentlyShownCocktails.clear();
};

// Function to get a completely random cocktail for maximum variety
export const getRandomCocktail = async (): Promise<Cocktail | null> => {
  const cocktails = await loadCocktailData();
  if (cocktails.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * cocktails.length);
  return cocktails[randomIndex];
};

const loadCocktailData = async () => {
  // Always reload data to ensure we get the latest sophisticated names
  try {
    const response = await fetch(DATA_PATHS.SOPHISTICATED_COCKTAIL_LIBRARY);
    const data = await response.json();
    cocktailData = data.cocktails.map((cocktail: any) => ({
      id: cocktail.id,
      name: cocktail.name,
      base_spirit_category: cocktail.base_spirit,
      base_brand: cocktail.base_spirit,
      style: cocktail.style || (cocktail.flavor_profile?.smoky ? 'Smoky' : cocktail.flavor_profile?.floral ? 'Floral' : 'Classic'),
      build_type: cocktail.build_type || 'Shaken',
      difficulty: cocktail.difficulty || 'intermediate',
      complexity_score: cocktail.difficulty === 'easy' ? 3 : cocktail.difficulty === 'intermediate' ? 6 : 8,
      flavor_tags: Object.keys(cocktail.flavor_profile || {}),
      mood_tags: ['sophisticated', 'refined'],
      ingredients: cocktail.ingredients.map((ing: any) => `${ing.amount} ${ing.name}`),
      garnish: cocktail.garnish?.join(', ') || 'Lemon twist',
      glassware: cocktail.glassware,
      notes: cocktail.description,
      balance_profile: {
        sweet: cocktail.flavor_profile?.sweet || 5,
        sour: cocktail.flavor_profile?.citrus || 5,
        bitter: cocktail.flavor_profile?.bitter || 3,
        spicy: cocktail.flavor_profile?.spicy || 4,
        aromatic: cocktail.flavor_profile?.floral || 6,
        alcoholic: cocktail.flavor_profile?.complex || 7
      },
      seasonal_notes: cocktail.seasonal_notes || []
    }));
  } catch (error) {
    console.error('Error loading sophisticated cocktail library:', error);
    throw new Error('Failed to load cocktail data. Please refresh the page.');
  }
  return cocktailData;
};

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

// Enhanced diversity algorithm with spirit variety and liqueur diversity
const getDiverseRecommendations = (scoredCocktails: any[], primary: Cocktail, maxCount: number): Cocktail[] => {
  const selected: Cocktail[] = [];
  const usedSpirits = new Set([primary.base_spirit_category]);
  const usedStyles = new Set([primary.style]);
  const usedBuildTypes = new Set([primary.build_type]);
  const usedCocktailIds = new Set([primary.id]);
  const usedLiqueurs = new Set();
  
  // Extract liqueurs from primary cocktail for diversity tracking
  const primaryLiqueurs = primary.ingredients.filter((ing: string) => 
    ing.toLowerCase().includes('liqueur') || 
    ing.toLowerCase().includes('amaro') ||
    ing.toLowerCase().includes('chartreuse') ||
    ing.toLowerCase().includes('st-germain') ||
    ing.toLowerCase().includes('campari') ||
    ing.toLowerCase().includes('aperol')
  );
  primaryLiqueurs.forEach((liqueur: string) => usedLiqueurs.add(liqueur.toLowerCase()));
  
  // Enhanced randomization with spirit diversity weighting
  const timestamp = Date.now();
  const shuffledCocktails = [...scoredCocktails].sort((a, b) => {
    // Boost score for diverse spirits and liqueurs
    let diversityBoostA = 0;
    let diversityBoostB = 0;
    
    const spiritA = a.cocktail.base_spirit_category;
    const spiritB = b.cocktail.base_spirit_category;
    
    // Prioritize underrepresented spirits
    if (!usedSpirits.has(spiritA)) diversityBoostA += 15;
    if (!usedSpirits.has(spiritB)) diversityBoostB += 15;
    
    // Prioritize premium/unique spirits
    const premiumSpirits = ['pisco', 'cognac', 'armagnac', 'aquavit', 'shochu', 'mezcal'];
    if (premiumSpirits.includes(spiritA.toLowerCase())) diversityBoostA += 10;
    if (premiumSpirits.includes(spiritB.toLowerCase())) diversityBoostB += 10;
    
    // Check for diverse liqueurs
    const liqueursA = a.cocktail.ingredients.filter((ing: string) => 
      ing.toLowerCase().includes('liqueur') || 
      ing.toLowerCase().includes('amaro') ||
      ing.toLowerCase().includes('chartreuse') ||
      ing.toLowerCase().includes('st-germain') ||
      ing.toLowerCase().includes('campari') ||
      ing.toLowerCase().includes('aperol')
    );
    const liqueursB = b.cocktail.ingredients.filter((ing: string) => 
      ing.toLowerCase().includes('liqueur') || 
      ing.toLowerCase().includes('amaro') ||
      ing.toLowerCase().includes('chartreuse') ||
      ing.toLowerCase().includes('st-germain') ||
      ing.toLowerCase().includes('campari') ||
      ing.toLowerCase().includes('aperol')
    );
    
    const newLiqueursA = liqueursA.filter((l: string) => !usedLiqueurs.has(l.toLowerCase())).length;
    const newLiqueursB = liqueursB.filter((l: string) => !usedLiqueurs.has(l.toLowerCase())).length;
    
    diversityBoostA += newLiqueursA * 5;
    diversityBoostB += newLiqueursB * 5;
    
    const randomA = Math.random() + (a.score + diversityBoostA) / 100 + (timestamp % 1000) / 1000;
    const randomB = Math.random() + (b.score + diversityBoostB) / 100 + (timestamp % 1000) / 1000;
    return randomB - randomA;
  });
  
  // First pass: Select cocktails with different spirits, styles, or build types
  for (const item of shuffledCocktails) {
    if (selected.length >= maxCount) break;
    if (item.score < 65) continue; // Lowered threshold for more variety
    
    const cocktail = item.cocktail;
    const hasDifferentSpirit = !usedSpirits.has(cocktail.base_spirit_category);
    const hasDifferentStyle = !usedStyles.has(cocktail.style);
    const hasDifferentBuildType = !usedBuildTypes.has(cocktail.build_type);
    const isNotDuplicate = !usedCocktailIds.has(cocktail.id);
    
    // Check for liqueur diversity
    const cocktailLiqueurs = cocktail.ingredients.filter((ing: string) => 
      ing.toLowerCase().includes('liqueur') || 
      ing.toLowerCase().includes('amaro') ||
      ing.toLowerCase().includes('chartreuse') ||
      ing.toLowerCase().includes('st-germain') ||
      ing.toLowerCase().includes('campari') ||
      ing.toLowerCase().includes('aperol')
    );
    const hasNewLiqueurs = cocktailLiqueurs.some((l: string) => !usedLiqueurs.has(l.toLowerCase()));
    
    // Select if it differs in at least one major category and isn't a duplicate
    if (isNotDuplicate && (hasDifferentSpirit || hasDifferentStyle || hasDifferentBuildType || hasNewLiqueurs)) {
      selected.push(cocktail);
      usedSpirits.add(cocktail.base_spirit_category);
      usedStyles.add(cocktail.style);
      usedBuildTypes.add(cocktail.build_type);
      usedCocktailIds.add(cocktail.id);
      cocktailLiqueurs.forEach((liqueur: string) => usedLiqueurs.add(liqueur.toLowerCase()));
    }
  }
  
  // Second pass: Fill remaining slots with high-scoring cocktails
  if (selected.length < maxCount) {
    for (const item of shuffledCocktails) {
      if (selected.length >= maxCount) break;
      if (item.score < 70) continue; // Lowered threshold
      
      const cocktail = item.cocktail;
      if (!usedCocktailIds.has(cocktail.id)) {
        selected.push(cocktail);
        usedCocktailIds.add(cocktail.id);
      }
    }
  }
  
  // Third pass: Add any remaining cocktails for maximum variety
  if (selected.length < maxCount) {
    for (const item of shuffledCocktails) {
      if (selected.length >= maxCount) break;
      if (item.score < 55) continue; // Even lower threshold for maximum variety
      
      const cocktail = item.cocktail;
      if (!usedCocktailIds.has(cocktail.id)) {
        selected.push(cocktail);
        usedCocktailIds.add(cocktail.id);
      }
    }
  }
  
  // Enhanced final shuffle with multiple randomization passes
  return selected.sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5);
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

export const generateRecommendations = async (answers: QuizAnswers): Promise<RecommendationResult> => {
  const cocktails = await loadCocktailData();
  
  // Filter out recently shown cocktails for more variety
  const availableCocktails = filterRecentlyShown(cocktails);
  
  // If we've shown too many recently, reset the list to allow some repetition
  const cocktailsToUse = availableCocktails.length > 10 ? availableCocktails : cocktails;
  
  // Add randomization seed based on timestamp and answers to ensure variety
  // const randomizationSeed = Date.now() + JSON.stringify(answers).length;
  
  // Score each cocktail based on quiz answers with enhanced fuzzy matching
  const scoredCocktails = cocktailsToUse.map(cocktail => {
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
    
    // Add randomization factor to score to ensure variety
    const randomFactor = (Math.random() - 0.5) * 10; // ±5 point variation
    score += randomFactor;
    
    // Ensure minimum score for magical feeling
    score = Math.max(score, 80);
    
    return { cocktail, score, matchingFactors };
  });
  
  // Enhanced sorting with randomization for variety
  const sortedCocktails = scoredCocktails.sort((a, b) => {
    // Primary sort by score
    if (Math.abs(b.score - a.score) > 5) {
      return b.score - a.score;
    }
    
    // For similar scores, add randomization
    const randomA = Math.random();
    const randomB = Math.random();
    
    if (b.matchingFactors !== a.matchingFactors) {
      return b.matchingFactors - a.matchingFactors;
    }
    
    return randomB - randomA;
  });
  
  // Get primary recommendation with additional randomization for top candidates
  const topCandidates = sortedCocktails.slice(0, Math.min(5, sortedCocktails.length));
  const primary = topCandidates[Math.floor(Math.random() * topCandidates.length)].cocktail;
  
  // Track the primary recommendation to avoid repetition
  addToRecentlyShown(primary);
  
  // Get diverse adjacent recommendations with improved algorithm
  const adjacent = getDiverseRecommendations(sortedCocktails.slice(1), primary, 8);
  
  // Track adjacent recommendations too
  adjacent.forEach(cocktail => addToRecentlyShown(cocktail));
  
  // Ensure the match score feels magical (90-98%)
  const finalScore = Math.min(98, Math.max(90, sortedCocktails[0].score));
  
  return {
    primary,
    adjacent,
    matchScore: finalScore
  };
};

// Enhanced recommendation engine with fuzzy matching metadata
export const generateEnhancedRecommendations = async (answers: EnhancedQuizAnswers): Promise<RecommendationResult & { fuzzyMatches?: string[]; fallbackUsed?: boolean }> => {
  const cocktails = await loadCocktailData();
  
  // Filter out recently shown cocktails for more variety
  const availableCocktails = filterRecentlyShown(cocktails);
  
  // If we've shown too many recently, reset the list to allow some repetition
  const cocktailsToUse = availableCocktails.length > 10 ? availableCocktails : cocktails;
  
  // Add randomization seed based on timestamp and answers to ensure variety
  // const randomizationSeed = Date.now() + JSON.stringify(answers).length;
  
  // Score each cocktail with enhanced fuzzy matching
  const scoredCocktails = cocktailsToUse.map(cocktail => {
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
    
    // Add randomization factor to score to ensure variety
    const randomFactor = (Math.random() - 0.5) * 10; // ±5 point variation
    score += randomFactor;
    
    // Ensure minimum score for magical feeling
    score = Math.max(score, 80);
    
    return { cocktail, score, matchingFactors, fuzzyMatches, fallbackUsed };
  });
  
  // Enhanced sorting with randomization for variety
  const sortedCocktails = scoredCocktails.sort((a, b) => {
    // Primary sort by score
    if (Math.abs(b.score - a.score) > 5) {
      return b.score - a.score;
    }
    
    // For similar scores, add randomization
    const randomA = Math.random();
    const randomB = Math.random();
    
    if (b.matchingFactors !== a.matchingFactors) {
      return b.matchingFactors - a.matchingFactors;
    }
    
    return randomB - randomA;
  });
  
  // Get primary recommendation with additional randomization for top candidates
  const topCandidates = sortedCocktails.slice(0, Math.min(5, sortedCocktails.length));
  const primary = topCandidates[Math.floor(Math.random() * topCandidates.length)].cocktail;
  
  // Track the primary recommendation to avoid repetition
  addToRecentlyShown(primary);
  
  // Get diverse adjacent recommendations with improved algorithm
  const adjacent = getDiverseRecommendations(sortedCocktails.slice(1), primary, 8);
  
  // Track adjacent recommendations too
  adjacent.forEach(cocktail => addToRecentlyShown(cocktail));
  
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