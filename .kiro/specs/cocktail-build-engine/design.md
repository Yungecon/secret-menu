# Cocktail Build Engine Design Specification

## Architecture Overview

The Cocktail Build Engine extends the existing secret cocktail menu system with intelligent ingredient profiling and recipe generation capabilities.

## Core Components

### 1. Ingredient Flavor Profiling System

#### Flavor Profile Schema
```typescript
interface FlavorProfile {
  id: string;
  name: string;
  categories: FlavorCategory[];
  intensity: FlavorIntensity;
  notes: string[];
  pairings: string[];
  substitutions: string[];
  seasonal: boolean;
  regional: string[];
}

interface FlavorCategory {
  primary: string;        // citrus, herbal, spicy, sweet, bitter, etc.
  secondary: string[];    // supporting flavor notes
  tertiary: string[];     // subtle background notes
}

interface FlavorIntensity {
  overall: 1-10;         // overall flavor strength
  sweet: 1-10;           // sweetness level
  sour: 1-10;            // acidity level
  bitter: 1-10;          // bitterness level
  spicy: 1-10;           // heat/spice level
  aromatic: 1-10;        // aromatic intensity
}
```

#### Ingredient Categories
- **Base Spirits**: Vodka, Gin, Whiskey, Rum, Tequila, Mezcal, Brandy
- **Fortified Wines**: Vermouth, Sherry, Port, Madeira, Amari
- **Liqueurs**: Orange, Coffee, Herbal, Fruit, Cream
- **Bitters**: Aromatic, Citrus, Herbal, Spicy, Floral
- **Mixers**: Citrus, Sodas, Juices, Syrups, Tonic, Ginger Beer
- **Garnishes**: Citrus, Herbs, Spices, Fruits, Edible Flowers

### 2. Recipe Template System

#### Classic Cocktail Templates
```typescript
interface CocktailTemplate {
  id: string;
  name: string;
  type: 'classic' | 'modern' | 'signature';
  baseStructure: IngredientRole[];
  buildType: 'stirred' | 'shaken' | 'built' | 'blended';
  glassware: string;
  garnish: string[];
  description: string;
  variations: string[];
}

interface IngredientRole {
  role: 'base' | 'modifier' | 'sweetener' | 'bitter' | 'citrus' | 'mixer';
  required: boolean;
  alternatives: string[];
  proportion: {
    min: number;
    max: number;
    default: number;
  };
  flavorProfile: string[];
}
```

#### Example Templates
- **Manhattan Template**: Base (whiskey), Modifier (vermouth), Bitter (aromatic bitters)
- **Paloma Template**: Base (tequila), Citrus (lime), Mixer (grapefruit soda), Salt rim
- **Mule Template**: Base (spirit), Citrus (lime), Mixer (ginger beer), Garnish (lime wheel)

### 3. Recipe Generation Engine

#### Flavor Balance Algorithm
```typescript
interface FlavorBalance {
  sweet: number;     // 0-10 scale
  sour: number;      // 0-10 scale
  bitter: number;    // 0-10 scale
  spicy: number;     // 0-10 scale
  aromatic: number;  // 0-10 scale
  alcoholic: number; // 0-10 scale
}

interface RecipeGenerator {
  generateRecipe(
    availableIngredients: Ingredient[],
    template: CocktailTemplate,
    preferences: FlavorPreferences
  ): GeneratedRecipe;
  
  validateBalance(recipe: GeneratedRecipe): boolean;
  suggestAdjustments(recipe: GeneratedRecipe): Adjustment[];
}
```

#### Generation Process
1. **Template Selection**: Choose appropriate cocktail template
2. **Ingredient Mapping**: Map available ingredients to template roles
3. **Proportion Calculation**: Calculate optimal proportions based on intensity
4. **Balance Validation**: Ensure flavor balance meets criteria
5. **Adjustment Suggestions**: Provide alternatives and modifications

### 4. Ingredient Substitution Logic

#### Substitution Rules
```typescript
interface SubstitutionRule {
  original: string;
  substitutes: {
    ingredient: string;
    ratio: number;        // adjustment ratio (1.0 = same amount)
    notes: string;        // preparation notes
    compatibility: number; // 0-100 compatibility score
  }[];
}
```

#### Substitution Categories
- **Direct Substitutes**: Same flavor profile, similar intensity
- **Complementary Substitutes**: Different but harmonious flavors
- **Creative Substitutes**: Innovative alternatives that work well
- **Seasonal Substitutes**: Seasonal or regional alternatives

### 5. Recipe Database Structure

#### Extended Cocktail Schema
```typescript
interface EnhancedCocktail {
  // Existing fields from current system
  id: string;
  name: string;
  base_spirit_category: string;
  base_brand: string;
  style: string;
  build_type: string;
  flavor_tags: string[];
  mood_tags: string[];
  ingredients: string[];
  garnish: string;
  glassware: string;
  
  // New fields for build engine
  template_id?: string;           // Reference to cocktail template
  generated: boolean;             // Whether recipe was generated
  substitutions: Substitution[];  // Applied substitutions
  balance_profile: FlavorBalance; // Calculated flavor balance
  complexity_score: number;       // Recipe complexity (1-10)
  seasonal_notes: string[];       // Seasonal variations
  variations: CocktailVariation[]; // Alternative versions
}
```

## Implementation Strategy

### Phase 1: Ingredient Profiling
1. Create comprehensive ingredient database
2. Define flavor profile schema
3. Implement ingredient categorization
4. Build flavor intensity mapping

### Phase 2: Template System
1. Create classic cocktail templates
2. Define modern cocktail formulas
3. Implement template matching logic
4. Build variation generation system

### Phase 3: Recipe Generation
1. Implement flavor balance algorithm
2. Create proportion calculation engine
3. Build recipe validation system
4. Add adjustment suggestion logic

### Phase 4: Integration
1. Extend existing cocktail data structure
2. Integrate with current quiz system
3. Enhance recommendation engine
4. Add new UI components for recipe building

## Data Examples

### Ingredient Flavor Profiles
```json
{
  "id": "borghetti-coffee-liqueur",
  "name": "Borghetti Coffee Liqueur",
  "categories": [
    {
      "primary": "coffee",
      "secondary": ["sweet", "aromatic"],
      "tertiary": ["vanilla", "caramel"]
    }
  ],
  "intensity": {
    "overall": 7,
    "sweet": 8,
    "sour": 1,
    "bitter": 4,
    "spicy": 0,
    "aromatic": 6
  },
  "pairings": ["tequila", "grapefruit", "lime", "agave"],
  "substitutions": ["kahlua", "tia-maria", "coffee-syrup"],
  "seasonal": false,
  "regional": ["mexican", "italian"]
}
```

### Cocktail Template
```json
{
  "id": "paloma-template",
  "name": "Paloma Template",
  "type": "classic",
  "baseStructure": [
    {
      "role": "base",
      "required": true,
      "alternatives": ["tequila", "mezcal"],
      "proportion": { "min": 1.5, "max": 2.5, "default": 2.0 }
    },
    {
      "role": "citrus",
      "required": true,
      "alternatives": ["lime-juice", "lemon-juice"],
      "proportion": { "min": 0.5, "max": 1.0, "default": 0.75 }
    },
    {
      "role": "mixer",
      "required": true,
      "alternatives": ["grapefruit-soda", "grapefruit-juice", "tonic"],
      "proportion": { "min": 4.0, "max": 6.0, "default": 5.0 }
    }
  ],
  "buildType": "built",
  "glassware": "highball",
  "garnish": ["lime-wheel", "grapefruit-wheel"],
  "description": "Refreshing tequila highball with grapefruit",
  "variations": ["coffee-paloma", "spicy-paloma", "herbal-paloma"]
}
```

### Generated Recipe Example
```json
{
  "id": "coffee-paloma-001",
  "name": "Coffee Paloma",
  "template_id": "paloma-template",
  "generated": true,
  "ingredients": [
    "2oz Tequila Blanco",
    "0.75oz Lime Juice",
    "0.5oz Borghetti Coffee Liqueur",
    "4oz Grapefruit Soda"
  ],
  "instructions": [
    "Build in highball glass with ice",
    "Add tequila, lime juice, and coffee liqueur",
    "Top with grapefruit soda",
    "Stir gently",
    "Garnish with lime wheel"
  ],
  "balance_profile": {
    "sweet": 6,
    "sour": 5,
    "bitter": 3,
    "spicy": 0,
    "aromatic": 4,
    "alcoholic": 4
  },
  "complexity_score": 6,
  "seasonal_notes": ["Perfect for afternoon sipping", "Coffee notes add warmth"],
  "substitutions": [
    {
      "original": "Borghetti Coffee Liqueur",
      "substitute": "Kahlua",
      "ratio": 1.0,
      "notes": "Slightly sweeter, adjust lime if needed"
    }
  ]
}
```

## UI/UX Considerations

### Recipe Builder Interface
- **Ingredient Selection**: Drag-and-drop ingredient selection
- **Template Browser**: Browse classic and modern templates
- **Real-time Balance**: Visual flavor balance indicator
- **Substitution Suggestions**: Inline substitution recommendations
- **Recipe Preview**: Live preview of generated recipe

### Integration Points
- **Quiz Integration**: Use quiz preferences for recipe generation
- **Recommendation Engine**: Enhanced recommendations with generated recipes
- **Ingredient Search**: Advanced filtering by flavor profile
- **Recipe Sharing**: Save and share custom recipes

This design provides a comprehensive foundation for building intelligent cocktail recipes while maintaining compatibility with the existing system.
