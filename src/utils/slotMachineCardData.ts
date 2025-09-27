/**
 * Slot Machine Card Data
 * 
 * Enhanced card data for slot machine reels with icons, gradients,
 * and descriptive text for a premium experience.
 */

export interface CardData {
  value: string;
  icon: string;
  label: string;
  description: string;
  gradient: string;
  glowColor: string;
}

// Flavor attribute cards
export const FLAVOR_CARDS: CardData[] = [
  {
    value: 'sweet',
    icon: '🍯',
    label: 'Sweet',
    description: 'Rich & Indulgent',
    gradient: 'from-luxury-gold to-luxury-brass',
    glowColor: 'luxury-gold'
  },
  {
    value: 'bitter',
    icon: '☕',
    label: 'Bitter',
    description: 'Complex & Bold',
    gradient: 'from-luxury-charcoal to-luxury-antique',
    glowColor: 'luxury-brass'
  },
  {
    value: 'citrus',
    icon: '🍋',
    label: 'Citrus',
    description: 'Fresh & Bright',
    gradient: 'from-luxury-emerald to-luxury-mint',
    glowColor: 'luxury-emerald'
  },
  {
    value: 'herbal',
    icon: '🌿',
    label: 'Herbal',
    description: 'Aromatic & Earthy',
    gradient: 'from-luxury-emerald to-luxury-charcoal',
    glowColor: 'luxury-emerald'
  },
  {
    value: 'spicy',
    icon: '🌶️',
    label: 'Spicy',
    description: 'Warm & Fiery',
    gradient: 'from-luxury-brass to-luxury-gold',
    glowColor: 'luxury-brass'
  },
  {
    value: 'fruity',
    icon: '🍓',
    label: 'Fruity',
    description: 'Juicy & Vibrant',
    gradient: 'from-luxury-rose to-luxury-blush',
    glowColor: 'luxury-rose'
  },
  {
    value: 'floral',
    icon: '🌸',
    label: 'Floral',
    description: 'Delicate & Fragrant',
    gradient: 'from-luxury-rose to-luxury-pearl',
    glowColor: 'luxury-rose'
  },
  {
    value: 'smoky',
    icon: '🔥',
    label: 'Smoky',
    description: 'Deep & Intense',
    gradient: 'from-luxury-charcoal to-luxury-antique',
    glowColor: 'luxury-charcoal'
  },
  {
    value: 'creamy',
    icon: '🥛',
    label: 'Creamy',
    description: 'Smooth & Luxurious',
    gradient: 'from-luxury-pearl to-luxury-platinum',
    glowColor: 'luxury-pearl'
  },
  {
    value: 'tart',
    icon: '🍋',
    label: 'Tart',
    description: 'Sharp & Refreshing',
    gradient: 'from-luxury-mint to-luxury-emerald',
    glowColor: 'luxury-mint'
  }
];

// Mood attribute cards
export const MOOD_CARDS: CardData[] = [
  {
    value: 'adventurous',
    icon: '🗺️',
    label: 'Adventurous',
    description: 'Bold & Exciting',
    gradient: 'from-luxury-emerald to-luxury-mint',
    glowColor: 'luxury-emerald'
  },
  {
    value: 'elegant',
    icon: '👑',
    label: 'Elegant',
    description: 'Refined & Sophisticated',
    gradient: 'from-luxury-platinum to-luxury-pearl',
    glowColor: 'luxury-platinum'
  },
  {
    value: 'playful',
    icon: '🎪',
    label: 'Playful',
    description: 'Fun & Whimsical',
    gradient: 'from-luxury-rose to-luxury-blush',
    glowColor: 'luxury-rose'
  },
  {
    value: 'cozy',
    icon: '🕯️',
    label: 'Cozy',
    description: 'Warm & Intimate',
    gradient: 'from-luxury-brass to-luxury-antique',
    glowColor: 'luxury-brass'
  },
  {
    value: 'celebratory',
    icon: '🥂',
    label: 'Celebratory',
    description: 'Joyful & Festive',
    gradient: 'from-luxury-gold to-luxury-brass',
    glowColor: 'luxury-gold'
  },
  {
    value: 'sophisticated',
    icon: '🎭',
    label: 'Sophisticated',
    description: 'Worldly & Cultured',
    gradient: 'from-luxury-charcoal to-luxury-antique',
    glowColor: 'luxury-charcoal'
  },
  {
    value: 'bold',
    icon: '⚡',
    label: 'Bold',
    description: 'Daring & Confident',
    gradient: 'from-luxury-gold to-luxury-brass',
    glowColor: 'luxury-gold'
  },
  {
    value: 'refreshing',
    icon: '💧',
    label: 'Refreshing',
    description: 'Cool & Revitalizing',
    gradient: 'from-luxury-emerald to-luxury-mint',
    glowColor: 'luxury-emerald'
  },
  {
    value: 'mysterious',
    icon: '🔮',
    label: 'Mysterious',
    description: 'Enigmatic & Intriguing',
    gradient: 'from-luxury-charcoal to-luxury-antique',
    glowColor: 'luxury-charcoal'
  },
  {
    value: 'classic',
    icon: '🏛️',
    label: 'Classic',
    description: 'Timeless & Traditional',
    gradient: 'from-luxury-gold to-luxury-brass',
    glowColor: 'luxury-gold'
  }
];

// Style attribute cards
export const STYLE_CARDS: CardData[] = [
  {
    value: 'classic',
    icon: '🍸',
    label: 'Classic',
    description: 'Timeless & Elegant',
    gradient: 'from-luxury-gold to-luxury-brass',
    glowColor: 'luxury-gold'
  },
  {
    value: 'experimental',
    icon: '🧪',
    label: 'Experimental',
    description: 'Creative & Bold',
    gradient: 'from-luxury-emerald to-luxury-gold',
    glowColor: 'luxury-emerald'
  },
  {
    value: 'light',
    icon: '☀️',
    label: 'Light',
    description: 'Crisp & Refreshing',
    gradient: 'from-luxury-emerald to-luxury-mint',
    glowColor: 'luxury-emerald'
  },
  {
    value: 'boozy',
    icon: '🥃',
    label: 'Boozy',
    description: 'Rich & Intense',
    gradient: 'from-luxury-brass to-luxury-antique',
    glowColor: 'luxury-brass'
  },
  {
    value: 'shaken',
    icon: '🥤',
    label: 'Shaken',
    description: 'Vigorous & Frothy',
    gradient: 'from-luxury-mint to-luxury-emerald',
    glowColor: 'luxury-mint'
  },
  {
    value: 'stirred',
    icon: '🥄',
    label: 'Stirred',
    description: 'Smooth & Refined',
    gradient: 'from-luxury-platinum to-luxury-pearl',
    glowColor: 'luxury-platinum'
  },
  {
    value: 'built',
    icon: '🏗️',
    label: 'Built',
    description: 'Layered & Complex',
    gradient: 'from-luxury-charcoal to-luxury-antique',
    glowColor: 'luxury-charcoal'
  },
  {
    value: 'tropical',
    icon: '🌴',
    label: 'Tropical',
    description: 'Exotic & Vibrant',
    gradient: 'from-luxury-emerald to-luxury-gold',
    glowColor: 'luxury-emerald'
  },
  {
    value: 'seasonal',
    icon: '🍂',
    label: 'Seasonal',
    description: 'Timely & Fresh',
    gradient: 'from-luxury-brass to-luxury-gold',
    glowColor: 'luxury-brass'
  },
  {
    value: 'premium',
    icon: '💎',
    label: 'Premium',
    description: 'Luxurious & Exclusive',
    gradient: 'from-luxury-platinum to-luxury-pearl',
    glowColor: 'luxury-platinum'
  }
];

// Helper function to get card data by value
export const getCardData = (value: string, type: 'flavor' | 'mood' | 'style'): CardData | null => {
  const cardMap = {
    flavor: FLAVOR_CARDS,
    mood: MOOD_CARDS,
    style: STYLE_CARDS
  };
  
  // Try exact match first
  let card = cardMap[type].find(card => card.value === value);
  
  // If no exact match, try case-insensitive match
  if (!card) {
    card = cardMap[type].find(card => card.value.toLowerCase() === value.toLowerCase());
  }
  
  return card || null;
};

// Helper function to get all cards for a reel type
export const getCardsForReel = (type: 'flavor' | 'mood' | 'style'): CardData[] => {
  const cardMap = {
    flavor: FLAVOR_CARDS,
    mood: MOOD_CARDS,
    style: STYLE_CARDS
  };
  
  return cardMap[type];
};
