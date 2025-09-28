import { QuizAnswers } from '../types';

// Slot Machine Attribute Data
export const FLAVOR_ATTRIBUTES = [
  'sweet',
  'bitter', 
  'citrus',
  'herbal',
  'spicy',
  'fruity',
  'floral',
  'smoky',
  'creamy',
  'tart'
] as const;

export const MOOD_ATTRIBUTES = [
  'adventurous',
  'elegant', 
  'playful',
  'cozy',
  'celebratory',
  'sophisticated',
  'bold',
  'refreshing',
  'mysterious',
  'classic'
] as const;

export const STYLE_ATTRIBUTES = [
  'classic',
  'experimental',
  'light',
  'boozy',
  'shaken',
  'stirred',
  'built',
  'tropical',
  'seasonal',
  'premium'
] as const;

// Type definitions for slot machine results
export interface SlotMachineResult {
  flavor: string;
  mood: string;
  style: string;
  timestamp: number;
}

export interface SlotMachineAttributes {
  flavors: readonly string[];
  moods: readonly string[];
  styles: readonly string[];
}

// Attribute collections for easy access
export const SLOT_MACHINE_ATTRIBUTES: SlotMachineAttributes = {
  flavors: FLAVOR_ATTRIBUTES,
  moods: MOOD_ATTRIBUTES,
  styles: STYLE_ATTRIBUTES
};

/**
 * Converts slot machine results to Flavor Journey format for ingredient spotlight
 */
export const convertSlotToFlavorJourney = (slotResult: SlotMachineResult): {
  baseSpirit: string;
  flavorFamily: string;
  specificFlavor: string;
} => {
  const { flavor, mood, style } = slotResult;
  
  // Map to base spirits based on style and mood
  const getBaseSpirit = (): string => {
    if (style === 'tropical' || mood === 'playful') return 'rum';
    if (style === 'premium' || mood === 'elegant') return 'cognac';
    if (style === 'boozy' || mood === 'bold') return 'whiskey';
    if (style === 'light' || mood === 'refreshing') return 'vodka';
    if (style === 'classic' || mood === 'sophisticated') return 'gin';
    if (style === 'experimental' || mood === 'adventurous') return 'mezcal';
    return 'vodka'; // default
  };
  
  // Map to flavor families
  const getFlavorFamily = (): string => {
    if (['citrus', 'tart'].includes(flavor)) return 'citrus';
    if (['herbal', 'smoky'].includes(flavor)) return 'herbal';
    if (['floral', 'sweet'].includes(flavor)) return 'floral';
    if (['spicy', 'bold'].includes(flavor)) return 'spicy';
    if (['fruity', 'creamy'].includes(flavor)) return 'tropical';
    return 'citrus'; // default
  };
  
  // Map to specific flavors
  const getSpecificFlavor = (): string => {
    if (flavor === 'citrus') return 'lemon';
    if (flavor === 'herbal') return 'mint';
    if (flavor === 'floral') return 'rose';
    if (flavor === 'spicy') return 'ginger';
    if (flavor === 'fruity') return 'passion-fruit';
    if (flavor === 'sweet') return 'vanilla';
    if (flavor === 'smoky') return 'smoke';
    if (flavor === 'tart') return 'lime';
    if (flavor === 'creamy') return 'coconut';
    return 'lemon'; // default
  };
  
  return {
    baseSpirit: getBaseSpirit(),
    flavorFamily: getFlavorFamily(),
    specificFlavor: getSpecificFlavor()
  };
};

/**
 * Converts slot machine results to quiz-compatible format for recommendation engine
 */
export const convertSlotToQuizAnswers = (slotResult: SlotMachineResult): QuizAnswers => {
  const { flavor, mood, style } = slotResult;
  
  // Map flavor attributes to quiz format
  const sweetVsBitter = (): 'sweet' | 'bitter' | undefined => {
    if (['sweet', 'fruity', 'creamy'].includes(flavor)) return 'sweet';
    if (['bitter', 'herbal', 'smoky'].includes(flavor)) return 'bitter';
    return undefined;
  };

  const citrusVsStone = (): 'citrus' | 'stone' | undefined => {
    if (['citrus', 'tart'].includes(flavor)) return 'citrus';
    if (['fruity', 'sweet', 'creamy'].includes(flavor)) return 'stone';
    return undefined;
  };

  // Map style attributes to quiz format
  const lightVsBoozy = (): 'light' | 'boozy' | undefined => {
    if (['light', 'built', 'tropical'].includes(style)) return 'light';
    if (['boozy', 'stirred', 'premium'].includes(style)) return 'boozy';
    return undefined;
  };

  const classicVsExperimental = (): 'classic' | 'experimental' | undefined => {
    if (['classic', 'stirred', 'premium'].includes(style)) return 'classic';
    if (['experimental', 'tropical', 'seasonal'].includes(style)) return 'experimental';
    return undefined;
  };


  // Map mood to quiz format
  const moodPreference = (): 'celebratory' | 'elegant' | 'cozy' | 'adventurous' | undefined => {
    if (['celebratory', 'party', 'festive'].includes(mood)) return 'celebratory';
    if (['elegant', 'sophisticated', 'refined'].includes(mood)) return 'elegant';
    if (['cozy', 'intimate', 'warm'].includes(mood)) return 'cozy';
    if (['adventurous', 'bold', 'exciting'].includes(mood)) return 'adventurous';
    return undefined;
  };

  return {
    sweetVsBitter: sweetVsBitter(),
    citrusVsStone: citrusVsStone(),
    lightVsBoozy: lightVsBoozy(),
    classicVsExperimental: classicVsExperimental(),
    moodPreference: moodPreference()
  };
};

/**
 * Maps slot machine attributes to cocktail database tags for enhanced matching
 */
export const mapAttributesToTags = (slotResult: SlotMachineResult): {
  flavorTags: string[];
  moodTags: string[];
  styleTags: string[];
} => {
  const { flavor, mood, style } = slotResult;

  // Enhanced flavor tag mapping
  const flavorTags: string[] = [flavor];
  if (flavor === 'sweet') flavorTags.push('fruity', 'rich');
  if (flavor === 'citrus') flavorTags.push('bright', 'refreshing');
  if (flavor === 'herbal') flavorTags.push('botanical', 'complex');
  if (flavor === 'smoky') flavorTags.push('rich', 'aromatic');
  if (flavor === 'spicy') flavorTags.push('bold', 'warming');

  // Enhanced mood tag mapping
  const moodTags: string[] = [mood];
  if (mood === 'elegant') moodTags.push('sophisticated', 'refined');
  if (mood === 'adventurous') moodTags.push('bold', 'experimental');
  if (mood === 'playful') moodTags.push('fun', 'creative');
  if (mood === 'cozy') moodTags.push('warming', 'comforting');

  // Enhanced style tag mapping
  const styleTags: string[] = [style];
  if (style === 'classic') styleTags.push('timeless', 'traditional');
  if (style === 'light') styleTags.push('refreshing', 'bubbly');
  if (style === 'boozy') styleTags.push('spirit-forward', 'strong');
  if (style === 'premium') styleTags.push('sophisticated', 'elegant');

  return {
    flavorTags,
    moodTags,
    styleTags
  };
};

/**
 * Generates a random attribute from the specified reel
 */
export const getRandomAttribute = (reel: 'flavor' | 'mood' | 'style'): string => {
  const attributes = {
    flavor: FLAVOR_ATTRIBUTES,
    mood: MOOD_ATTRIBUTES,
    style: STYLE_ATTRIBUTES
  };

  const reelAttributes = attributes[reel];
  const randomIndex = Math.floor(Math.random() * reelAttributes.length);
  return reelAttributes[randomIndex];
};

/**
 * Validates that a slot machine result contains valid attributes
 */
export const validateSlotResult = (result: SlotMachineResult): boolean => {
  return (
    FLAVOR_ATTRIBUTES.includes(result.flavor as any) &&
    MOOD_ATTRIBUTES.includes(result.mood as any) &&
    STYLE_ATTRIBUTES.includes(result.style as any) &&
    typeof result.timestamp === 'number'
  );
};