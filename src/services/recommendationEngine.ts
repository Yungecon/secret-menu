import { Cocktail, QuizAnswers, RecommendationResult, EnhancedQuizAnswers } from '../types';
import { DATA_PATHS } from '../constants';
import { replaceGenericModifierWithInventory } from './inventory';

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

// Generate comprehensive tags for cocktails based on their characteristics
const generateComprehensiveTags = (cocktail: any) => {
  const flavor_tags: string[] = [];
  const style_tags: string[] = [];
  const mood_tags: string[] = [];
  const occasion_tags: string[] = [];
  
  // Analyze flavor profile
  if (cocktail.flavor_profile) {
    if (cocktail.flavor_profile.sweet >= 7) flavor_tags.push('sweet', 'luxurious');
    if (cocktail.flavor_profile.bitter >= 7) flavor_tags.push('bitter', 'sophisticated');
    if (cocktail.flavor_profile.sour >= 6) flavor_tags.push('citrus', 'bright');
    if (cocktail.flavor_profile.spicy >= 6) flavor_tags.push('spicy', 'bold');
    if (cocktail.flavor_profile.aromatic >= 7) flavor_tags.push('herbal', 'complex');
    
    // Determine balance
    const sweet = cocktail.flavor_profile.sweet || 5;
    const bitter = cocktail.flavor_profile.bitter || 3;
    if (sweet >= 4 && sweet <= 6 && bitter >= 4 && bitter <= 6) {
      flavor_tags.push('balanced', 'harmonious');
    }
  }
  
  // Analyze ingredients for flavor hints
  const ingredientNames = cocktail.ingredients?.map((ing: any) => ing.name.toLowerCase()).join(' ') || '';
  
  if (ingredientNames.includes('citrus') || ingredientNames.includes('lemon') || ingredientNames.includes('lime')) {
    flavor_tags.push('citrus', 'bright', 'refreshing');
  }
  if (ingredientNames.includes('orange') || ingredientNames.includes('grapefruit')) {
    flavor_tags.push('citrus', 'zesty');
  }
  if (ingredientNames.includes('pineapple') || ingredientNames.includes('coconut') || ingredientNames.includes('passion')) {
    flavor_tags.push('tropical', 'exotic', 'vibrant');
  }
  if (ingredientNames.includes('peach') || ingredientNames.includes('cherry') || ingredientNames.includes('plum')) {
    flavor_tags.push('stone', 'rich', 'fruity');
  }
  if (ingredientNames.includes('simple syrup') || ingredientNames.includes('honey') || ingredientNames.includes('agave')) {
    flavor_tags.push('sweet', 'indulgent');
  }
  if (ingredientNames.includes('bitters') || ingredientNames.includes('amaro') || ingredientNames.includes('vermouth')) {
    flavor_tags.push('bitter', 'sophisticated', 'herbal');
  }
  
  // Analyze build type and style
  if (cocktail.build_type === 'Build' || cocktail.build_type === 'Build/Top') {
    style_tags.push('light', 'refreshing');
  } else if (cocktail.build_type === 'Stirred') {
    style_tags.push('boozy', 'spirit-forward', 'strong');
  } else if (cocktail.build_type === 'Shaken') {
    style_tags.push('medium', 'versatile', 'balanced');
  }
  
  // Analyze alcohol content
  const alcoholContent = cocktail.flavor_profile?.alcoholic || 7;
  if (alcoholContent >= 8) {
    style_tags.push('boozy', 'strong', 'bold');
  } else if (alcoholContent <= 5) {
    style_tags.push('light', 'approachable');
  } else {
    style_tags.push('medium', 'versatile');
  }
  
  // Analyze cocktail name and description for style hints
  const nameAndDesc = (cocktail.name + ' ' + (cocktail.description || '')).toLowerCase();
  
  if (nameAndDesc.includes('classic') || nameAndDesc.includes('traditional') || cocktail.difficulty === 'easy') {
    style_tags.push('classic', 'timeless');
  }
  if (nameAndDesc.includes('modern') || nameAndDesc.includes('contemporary')) {
    style_tags.push('modern', 'refined', 'contemporary');
  }
  if (nameAndDesc.includes('experimental') || nameAndDesc.includes('innovative') || cocktail.difficulty === 'advanced') {
    style_tags.push('experimental', 'bold', 'innovative');
  }
  
  // Generate mood tags based on flavor and style
  if (flavor_tags.includes('sweet') && flavor_tags.includes('luxurious')) {
    mood_tags.push('elegant', 'refined');
  }
  if (flavor_tags.includes('bitter') && flavor_tags.includes('sophisticated')) {
    mood_tags.push('sophisticated', 'contemplative');
  }
  if (flavor_tags.includes('tropical') && flavor_tags.includes('vibrant')) {
    mood_tags.push('celebratory', 'joyful', 'adventurous');
  }
  if (flavor_tags.includes('citrus') && flavor_tags.includes('refreshing')) {
    mood_tags.push('playful', 'refreshing');
  }
  if (style_tags.includes('light') || style_tags.includes('approachable')) {
    mood_tags.push('cozy', 'intimate');
  }
  if (style_tags.includes('boozy') || style_tags.includes('strong')) {
    mood_tags.push('sophisticated', 'contemplative');
  }
  
  // Default mood tags if none assigned
  if (mood_tags.length === 0) {
    mood_tags.push('elegant', 'sophisticated');
  }
  
  // Generate occasion tags
  if (style_tags.includes('light') || flavor_tags.includes('refreshing')) {
    occasion_tags.push('brunch', 'afternoon');
  }
  if (style_tags.includes('boozy') || mood_tags.includes('sophisticated')) {
    occasion_tags.push('evening', 'dinner');
  }
  if (mood_tags.includes('celebratory') || mood_tags.includes('joyful')) {
    occasion_tags.push('party', 'celebration');
  }
  if (mood_tags.includes('cozy') || mood_tags.includes('intimate')) {
    occasion_tags.push('date', 'relaxation');
  }
  
  // Default occasion if none assigned
  if (occasion_tags.length === 0) {
    occasion_tags.push('evening');
  }
  
  return {
    flavor_tags: [...new Set(flavor_tags)], // Remove duplicates
    style_tags: [...new Set(style_tags)],
    mood_tags: [...new Set(mood_tags)],
    occasion_tags: [...new Set(occasion_tags)]
  };
};

const loadCocktailData = async () => {
  // Always reload data to ensure we get the latest sophisticated names
  try {
    console.log('Loading cocktail data from:', DATA_PATHS.SOPHISTICATED_COCKTAIL_LIBRARY);
    const response = await fetch(DATA_PATHS.SOPHISTICATED_COCKTAIL_LIBRARY);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cocktail data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Loaded cocktail data:', data.cocktails?.length || 0, 'cocktails');
    
    cocktailData = data.cocktails.map((cocktail: any) => {
      console.log('Processing cocktail:', cocktail.id, cocktail.name);
      
      // Generate comprehensive tags based on cocktail characteristics
      const generatedTags = generateComprehensiveTags(cocktail);
      
      return {
        id: cocktail.id,
        name: cocktail.name,
        base_spirit_category: cocktail.base_spirit,
        base_brand: cocktail.base_spirit,
        style: cocktail.style || 'Classic',
        build_type: cocktail.build_type || 'Shaken',
        difficulty: cocktail.difficulty || 'intermediate',
        complexity_score: cocktail.difficulty === 'easy' ? 3 : cocktail.difficulty === 'intermediate' ? 6 : 8,
        flavor_tags: generatedTags.flavor_tags,
        style_tags: generatedTags.style_tags,
        mood_tags: generatedTags.mood_tags,
        occasion_tags: generatedTags.occasion_tags,
        ingredient_tags: cocktail.tags || [], // Keep original ingredient tags
        ingredients: cocktail.ingredients.map((ing: any) => {
          const name = replaceGenericModifierWithInventory(ing.name, cocktail.base_spirit);
          return `${ing.amount} ${name}`;
        }),
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
      };
    });
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
  const primaryLiqueurs = primary.ingredients.filter((ing: any) => 
    ing.toLowerCase().includes('liqueur') || 
    ing.toLowerCase().includes('amaro') ||
    ing.toLowerCase().includes('chartreuse') ||
    ing.toLowerCase().includes('st-germain') ||
    ing.toLowerCase().includes('campari') ||
    ing.toLowerCase().includes('aperol')
  );
  primaryLiqueurs.forEach((liqueur: any) => usedLiqueurs.add(liqueur.toLowerCase()));
  
  // Deterministic ordering by score with diversity as a secondary tie-breaker
  const orderedCocktails = [...scoredCocktails].sort((a, b) => {
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
    const liqueursA = a.cocktail.ingredients.filter((ing: any) => 
      ing.toLowerCase().includes('liqueur') || 
      ing.toLowerCase().includes('amaro') ||
      ing.toLowerCase().includes('chartreuse') ||
      ing.toLowerCase().includes('st-germain') ||
      ing.toLowerCase().includes('campari') ||
      ing.toLowerCase().includes('aperol')
    );
    const liqueursB = b.cocktail.ingredients.filter((ing: any) => 
      ing.toLowerCase().includes('liqueur') || 
      ing.toLowerCase().includes('amaro') ||
      ing.toLowerCase().includes('chartreuse') ||
      ing.toLowerCase().includes('st-germain') ||
      ing.toLowerCase().includes('campari') ||
      ing.toLowerCase().includes('aperol')
    );
    
    const newLiqueursA = liqueursA.filter((l: any) => !usedLiqueurs.has(l.toLowerCase())).length;
    const newLiqueursB = liqueursB.filter((l: any) => !usedLiqueurs.has(l.toLowerCase())).length;
    
    diversityBoostA += newLiqueursA * 5;
    diversityBoostB += newLiqueursB * 5;
    const effectiveA = a.score + diversityBoostA;
    const effectiveB = b.score + diversityBoostB;
    if (effectiveB !== effectiveA) {
      return effectiveB - effectiveA; // Higher first
    }
    // Stable deterministic tie-breakers
    if (a.cocktail.id !== b.cocktail.id) {
      return a.cocktail.id < b.cocktail.id ? -1 : 1;
    }
    return 0;
  });
  
  // First pass: Select cocktails with different spirits, styles, or build types
  for (const item of orderedCocktails) {
    if (selected.length >= maxCount) break;
    if (item.score < 65) continue; // Lowered threshold for more variety
    
    const cocktail = item.cocktail;
    const hasDifferentSpirit = !usedSpirits.has(cocktail.base_spirit_category);
    const hasDifferentStyle = !usedStyles.has(cocktail.style);
    const hasDifferentBuildType = !usedBuildTypes.has(cocktail.build_type);
    const isNotDuplicate = !usedCocktailIds.has(cocktail.id);
    
    // Check for liqueur diversity
    const cocktailLiqueurs = cocktail.ingredients.filter((ing: any) => 
      ing.toLowerCase().includes('liqueur') || 
      ing.toLowerCase().includes('amaro') ||
      ing.toLowerCase().includes('chartreuse') ||
      ing.toLowerCase().includes('st-germain') ||
      ing.toLowerCase().includes('campari') ||
      ing.toLowerCase().includes('aperol')
    );
    const hasNewLiqueurs = cocktailLiqueurs.some((l: any) => !usedLiqueurs.has(l.toLowerCase()));
    
    // Select if it differs in at least one major category and isn't a duplicate
    if (isNotDuplicate && (hasDifferentSpirit || hasDifferentStyle || hasDifferentBuildType || hasNewLiqueurs)) {
      selected.push(cocktail);
      usedSpirits.add(cocktail.base_spirit_category);
      usedStyles.add(cocktail.style);
      usedBuildTypes.add(cocktail.build_type);
      usedCocktailIds.add(cocktail.id);
      cocktailLiqueurs.forEach((liqueur: any) => usedLiqueurs.add(liqueur.toLowerCase()));
    }
  }
  
  // Second pass: Fill remaining slots with high-scoring cocktails
  if (selected.length < maxCount) {
    for (const item of orderedCocktails) {
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
    for (const item of orderedCocktails) {
      if (selected.length >= maxCount) break;
      if (item.score < 55) continue; // Even lower threshold for maximum variety
      
      const cocktail = item.cocktail;
      if (!usedCocktailIds.has(cocktail.id)) {
        selected.push(cocktail);
        usedCocktailIds.add(cocktail.id);
      }
    }
  }
  
  // Return deterministically ordered selections
  return selected.slice(0, maxCount);
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
  console.log('Starting generateRecommendations with answers:', answers);
  
  try {
    const cocktails = await loadCocktailData();
    console.log('Loaded cocktails for recommendations:', cocktails.length);
    
    if (cocktails.length === 0) {
      throw new Error('No cocktails available');
    }
    
    // Filter out recently shown cocktails for more variety
    const availableCocktails = filterRecentlyShown(cocktails);
    console.log('Available cocktails after filtering:', availableCocktails.length);
    
    // If we've shown too many recently, reset the list to allow some repetition
    const cocktailsToUse = availableCocktails.length > 10 ? availableCocktails : cocktails;
    console.log('Using cocktails:', cocktailsToUse.length);
    
    // Add randomization seed based on timestamp and answers to ensure variety
    // const randomizationSeed = Date.now() + JSON.stringify(answers).length;
    
    // Score each cocktail based on quiz answers with enhanced fuzzy matching
    console.log('Starting to score cocktails...');
    
    // Add safety check for large datasets to prevent performance issues
    const maxCocktailsToScore = 200;
    const cocktailsToScore = cocktailsToUse.length > maxCocktailsToScore 
      ? cocktailsToUse.slice(0, maxCocktailsToScore) 
      : cocktailsToUse;
    
    console.log(`Scoring ${cocktailsToScore.length} cocktails (limited from ${cocktailsToUse.length} for performance)`);
    
    const scoredCocktails = cocktailsToScore.map((cocktail, index) => {
    if (index % 50 === 0) {
      console.log(`Scoring cocktail ${index + 1}/${cocktailsToUse.length}:`, cocktail.name);
    }
    let score = 75; // Start with a high base score for magical feeling
    let matchingFactors = 0;
    
    // Enhanced flavor preference scoring with proper tag matching
    if (answers.sweetVsBitter === 'sweet') {
      // Tag-based matching for sweet preferences
      if (cocktail.flavor_tags?.some((tag: string) => ['sweet', 'luxurious', 'rich', 'indulgent'].includes(tag))) {
        score += 20;
        matchingFactors++;
      }
      // Fuzzy ingredient matching as backup
      if (hasSweetIngredients(cocktail)) {
        score += 15;
        matchingFactors++;
      }
      // Penalty for bitter profiles
      if (cocktail.flavor_tags?.some((tag: string) => ['bitter', 'dry', 'sophisticated'].includes(tag))) {
        score -= 10;
      }
    } else if (answers.sweetVsBitter === 'bitter') {
      // Tag-based matching for bitter preferences
      if (cocktail.flavor_tags?.some((tag: string) => ['bitter', 'sophisticated', 'herbal', 'complex'].includes(tag))) {
        score += 20;
        matchingFactors++;
      }
      // Fuzzy ingredient matching as backup
      if (hasBitterIngredients(cocktail)) {
        score += 15;
        matchingFactors++;
      }
      // Penalty for sweet profiles
      if (cocktail.flavor_tags?.some((tag: string) => ['sweet', 'luxurious', 'rich', 'indulgent'].includes(tag))) {
        score -= 10;
      }
    } else if (answers.sweetVsBitter === 'balanced') {
      // Tag-based matching for balanced preferences
      if (cocktail.flavor_tags?.some((tag: string) => ['balanced', 'harmonious', 'elegant', 'refined'].includes(tag))) {
        score += 20;
        matchingFactors++;
      }
      // Bonus for cocktails that aren't extremely sweet or bitter
      if (!cocktail.flavor_tags?.some((tag: string) => ['bitter', 'sweet'].includes(tag))) {
        score += 10;
        matchingFactors++;
      }
    }
    
    // Enhanced fruit preference scoring
    if (answers.citrusVsStone === 'citrus') {
      // Tag-based matching for citrus preferences
      if (cocktail.flavor_tags?.some((tag: string) => ['citrus', 'bright', 'refreshing', 'zesty'].includes(tag))) {
        score += 18;
        matchingFactors++;
      }
      // Fuzzy ingredient matching as backup
      if (hasCitrusIngredients(cocktail)) {
        score += 12;
        matchingFactors++;
      }
    } else if (answers.citrusVsStone === 'stone') {
      // Tag-based matching for stone fruit preferences
      if (cocktail.flavor_tags?.some((tag: string) => ['stone', 'rich', 'deep', 'fruity', 'indulgent'].includes(tag))) {
        score += 18;
        matchingFactors++;
      }
      // Fuzzy ingredient matching as backup
      if (hasStoneIngredients(cocktail)) {
        score += 12;
        matchingFactors++;
      }
    } else if (answers.citrusVsStone === 'tropical') {
      // Tag-based matching for tropical preferences
      if (cocktail.flavor_tags?.some((tag: string) => ['tropical', 'exotic', 'fruity', 'vibrant'].includes(tag))) {
        score += 18;
        matchingFactors++;
      }
      // Fuzzy ingredient matching as backup
      if (hasTropicalIngredients(cocktail)) {
        score += 12;
        matchingFactors++;
      }
    }
    
    // Enhanced style preference scoring
    if (answers.lightVsBoozy === 'light') {
      // Tag matching for light cocktails
      if (cocktail.flavor_tags?.some((tag: string) => ['light', 'refreshing', 'effervescent', 'airy', 'approachable'].includes(tag))) {
        score += 18;
        matchingFactors++;
      }
      // Build type matching
      if (cocktail.build_type === 'Build' || 
          cocktail.build_type === 'Build/Top' ||
          cocktail.style.includes('Highball') || 
          cocktail.style.includes('Collins') ||
          cocktail.style.includes('Fizz')) {
        score += 12;
        matchingFactors++;
      }
    } else if (answers.lightVsBoozy === 'boozy') {
      // Tag matching for boozy cocktails
      if (cocktail.flavor_tags?.some((tag: string) => ['boozy', 'spirit-forward', 'strong', 'bold'].includes(tag))) {
        score += 18;
        matchingFactors++;
      }
      // Build type matching
      if (cocktail.build_type === 'Stirred' || 
          cocktail.style.includes('Old Fashioned') || 
          cocktail.style.includes('Manhattan') ||
          cocktail.style.includes('Martini')) {
        score += 12;
        matchingFactors++;
      }
    } else if (answers.lightVsBoozy === 'medium') {
      // Tag matching for medium intensity cocktails
      if (cocktail.flavor_tags?.some((tag: string) => ['medium', 'versatile', 'balanced', 'approachable'].includes(tag))) {
        score += 18;
        matchingFactors++;
      }
      // Build type matching
      if (cocktail.build_type === 'Shaken' || 
          cocktail.style.includes('Sour') || 
          cocktail.style.includes('Daisy')) {
        score += 12;
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
  
  console.log('Finished scoring cocktails, starting sort...');
  
  // Deterministic sorting by score, then matching factors, then id
  const sortedCocktails = scoredCocktails.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.matchingFactors !== a.matchingFactors) return b.matchingFactors - a.matchingFactors;
    return a.cocktail.id < b.cocktail.id ? -1 : a.cocktail.id > b.cocktail.id ? 1 : 0;
  });
  
  console.log('Sorting complete, selecting recommendations...');
  
  // Get primary recommendation with additional randomization for top candidates
  const topCandidates = sortedCocktails.slice(0, Math.min(5, sortedCocktails.length));
  console.log('Top candidates:', topCandidates.length);
  
  const primary = topCandidates[Math.floor(Math.random() * topCandidates.length)].cocktail;
  console.log('Selected primary:', primary.name);
  
  // Track the primary recommendation to avoid repetition
  addToRecentlyShown(primary);
  
  // Get diverse adjacent recommendations with improved algorithm
  console.log('Getting adjacent recommendations...');
  const adjacent = getDiverseRecommendations(sortedCocktails.slice(1), primary, 8);
  console.log('Got adjacent recommendations:', adjacent.length);
  
  // Track adjacent recommendations too
  adjacent.forEach(cocktail => addToRecentlyShown(cocktail));
  
  // Ensure the match score feels magical (90-98%)
  const finalScore = Math.min(98, Math.max(90, sortedCocktails[0].score));
  
  console.log('Recommendation generation complete, returning result...');
  
  return {
    primary,
    adjacent,
    matchScore: finalScore
  };
  
  } catch (error) {
    console.error('Error in generateRecommendations, using simple fallback:', error);
    
    // Simple fallback that always works
    const simpleCocktails = [
      {
        id: 'simple-fallback-1',
        name: 'Classic Gin Martini',
        base_spirit_category: 'gin',
        base_brand: 'gin',
        style: 'Classic',
        build_type: 'Stirred',
        difficulty: 'intermediate',
        complexity_score: 6,
        flavor_tags: ['classic', 'sophisticated'],
        mood_tags: ['elegant', 'refined'],
        ingredients: ['2oz Gin', '0.5oz Dry Vermouth', 'Lemon twist'],
        garnish: 'Lemon twist',
        glassware: 'Martini glass',
        notes: 'A timeless classic that never disappoints.',
        balance_profile: { sweet: 2, sour: 3, bitter: 6, spicy: 4, aromatic: 8, alcoholic: 8 },
        seasonal_notes: ['Perfect year-round']
      },
      {
        id: 'simple-fallback-2',
        name: 'Old Fashioned',
        base_spirit_category: 'whiskey',
        base_brand: 'whiskey',
        style: 'Classic',
        build_type: 'Stirred',
        difficulty: 'intermediate',
        complexity_score: 6,
        flavor_tags: ['classic', 'rich'],
        mood_tags: ['elegant', 'contemplative'],
        ingredients: ['2oz Bourbon', '0.5oz Simple Syrup', '2 dashes Angostura Bitters', 'Orange peel'],
        garnish: 'Orange peel',
        glassware: 'Rocks glass',
        notes: 'The original cocktail, perfected over time.',
        balance_profile: { sweet: 4, sour: 2, bitter: 6, spicy: 5, aromatic: 7, alcoholic: 8 },
        seasonal_notes: ['Perfect for cooler months']
      }
    ];
    
    const primary = simpleCocktails[Math.floor(Math.random() * simpleCocktails.length)];
    const adjacent = simpleCocktails.filter(c => c.id !== primary.id);
    
    return {
      primary,
      adjacent,
      matchScore: 90
    };
  }
};

// Enhanced recommendation engine with fuzzy matching metadata
export const generateEnhancedRecommendations = async (answers: EnhancedQuizAnswers): Promise<RecommendationResult & { fuzzyMatches?: string[]; fallbackUsed?: boolean }> => {
  try {
    console.log('Starting enhanced recommendations with answers:', answers);
    const cocktails = await loadCocktailData();
    console.log('Loaded cocktails for enhanced recommendations:', cocktails.length);
  
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
  
  // Get primary recommendation deterministically
  const primary = sortedCocktails[0].cocktail;
  
  // Track the primary recommendation to avoid repetition
  addToRecentlyShown(primary);
  
  // Get diverse adjacent recommendations with improved algorithm
  const adjacent = getDiverseRecommendations(sortedCocktails.slice(1), primary, 8);
  
  // Track adjacent recommendations too
  adjacent.forEach(cocktail => addToRecentlyShown(cocktail));
  
  // Deterministic final score (no randomness)
  const finalScore = Math.max(0, Math.min(100, Math.round(sortedCocktails[0].score)));
  
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
  
  } catch (error) {
    console.error('Error in generateEnhancedRecommendations, using fallback:', error);

    // Deterministic fallback: use basic engine (dataset-driven) rather than fabricated cocktail
    const basicResult = await generateRecommendations(answers);
    return { ...basicResult, fallbackUsed: true } as RecommendationResult & { fallbackUsed: boolean };
  }
};