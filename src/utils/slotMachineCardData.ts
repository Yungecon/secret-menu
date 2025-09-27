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
    value: 'spicy',
    icon: '🌶️',
    label: 'Spicy',
    description: 'Warm & Fiery',
    gradient: 'from-luxury-brass to-luxury-gold',
    glowColor: 'luxury-brass'
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
    value: 'smoky',
    icon: '🔥',
    label: 'Smoky',
    description: 'Deep & Intense',
    gradient: 'from-luxury-charcoal to-luxury-antique',
    glowColor: 'luxury-charcoal'
  }
];

// Mood attribute cards
export const MOOD_CARDS: CardData[] = [
  {
    value: 'celebratory',
    icon: '🥂',
    label: 'Celebratory',
    description: 'Joyful & Festive',
    gradient: 'from-luxury-gold to-luxury-brass',
    glowColor: 'luxury-gold'
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
    value: 'cozy',
    icon: '🕯️',
    label: 'Cozy',
    description: 'Warm & Intimate',
    gradient: 'from-luxury-brass to-luxury-antique',
    glowColor: 'luxury-brass'
  },
  {
    value: 'adventurous',
    icon: '🗺️',
    label: 'Adventurous',
    description: 'Bold & Exciting',
    gradient: 'from-luxury-emerald to-luxury-mint',
    glowColor: 'luxury-emerald'
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
    value: 'intimate',
    icon: '🌹',
    label: 'Intimate',
    description: 'Personal & Close',
    gradient: 'from-luxury-brass to-luxury-gold',
    glowColor: 'luxury-brass'
  }
];

// Style attribute cards
export const STYLE_CARDS: CardData[] = [
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
    value: 'classic',
    icon: '🍸',
    label: 'Classic',
    description: 'Timeless & Elegant',
    gradient: 'from-luxury-gold to-luxury-brass',
    glowColor: 'luxury-gold'
  },
  {
    value: 'modern',
    icon: '✨',
    label: 'Modern',
    description: 'Innovative & Fresh',
    gradient: 'from-luxury-platinum to-luxury-pearl',
    glowColor: 'luxury-platinum'
  },
  {
    value: 'balanced',
    icon: '⚖️',
    label: 'Balanced',
    description: 'Harmonious & Smooth',
    gradient: 'from-luxury-charcoal to-luxury-antique',
    glowColor: 'luxury-charcoal'
  },
  {
    value: 'experimental',
    icon: '🧪',
    label: 'Experimental',
    description: 'Creative & Bold',
    gradient: 'from-luxury-emerald to-luxury-gold',
    glowColor: 'luxury-emerald'
  }
];

// Helper function to get card data by value
export const getCardData = (value: string, type: 'flavor' | 'mood' | 'style'): CardData | null => {
  const cardMap = {
    flavor: FLAVOR_CARDS,
    mood: MOOD_CARDS,
    style: STYLE_CARDS
  };
  
  return cardMap[type].find(card => card.value === value) || null;
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
