import { 
  CocktailTemplate, 
  IngredientProfile, 
  FlavorBalance, 
  RecipeGenerationRequest,
  GeneratedRecipe,
  Substitution
} from '../types';
import { DATA_PATHS } from '../constants';

// Specific amaros from the ingredient database
const SPECIFIC_AMAROS = [
  'Amaro Montenegro',
  'Amaro Nonino', 
  'Amaro Averna',
  'Amaro Lucano',
  'Amaro Ramazzotti',
  'Amaro Sibilla',
  'Amaro Meletti',
  'Aperol',
  'Campari',
  'Cappelletti Aperitivo',
  'Cynar',
  'Fernet Branca',
  'Fernet Vallet',
  'Punt e Mes'
];

// Amaro flavor profiles for intelligent selection (unused but kept for future reference)
/*
const AMARO_PROFILES: Record<string, any> = {
  'Amaro Montenegro': {
    flavor: ['sweet', 'orange', 'vanilla', 'herbal'],
    intensity: 'medium',
    bitterness: 'low',
    sweetness: 'high',
    best_for: ['mezcal', 'whiskey', 'gin']
  },
  'Amaro Nonino': {
    flavor: ['orange', 'gentian', 'licorice', 'warm'],
    intensity: 'medium',
    bitterness: 'medium',
    sweetness: 'medium',
    best_for: ['bourbon', 'whiskey', 'brandy']
  },
  'Amaro Averna': {
    flavor: ['licorice', 'orange', 'herbal', 'spice'],
    intensity: 'medium-high',
    bitterness: 'medium',
    sweetness: 'medium',
    best_for: ['mezcal', 'whiskey', 'rum']
  },
  'Amaro Lucano': {
    flavor: ['herbal', 'citrus', 'spice', 'gentian'],
    intensity: 'medium',
    bitterness: 'medium',
    sweetness: 'medium',
    best_for: ['gin', 'vodka', 'tequila']
  },
  'Amaro Ramazzotti': {
    flavor: ['orange', 'vanilla', 'herbal', 'bitter'],
    intensity: 'medium',
    bitterness: 'medium-high',
    sweetness: 'medium',
    best_for: ['gin', 'vodka', 'tequila']
  },
  'Amaro Sibilla': {
    flavor: ['herbal', 'gentian', 'citrus', 'spice'],
    intensity: 'medium-high',
    bitterness: 'high',
    sweetness: 'low',
    best_for: ['gin', 'vodka', 'tequila']
  },
  'Amaro Meletti': {
    flavor: ['saffron', 'saffron', 'orange', 'herbal'],
    intensity: 'medium',
    bitterness: 'medium',
    sweetness: 'medium',
    best_for: ['gin', 'vodka', 'tequila']
  },
  'Aperol': {
    flavor: ['orange', 'bitter', 'citrus', 'refreshing'],
    intensity: 'low-medium',
    bitterness: 'medium',
    sweetness: 'high',
    best_for: ['gin', 'vodka', 'prosecco']
  },
  'Campari': {
    flavor: ['bitter', 'orange', 'herbal', 'citrus'],
    intensity: 'medium-high',
    bitterness: 'high',
    sweetness: 'low',
    best_for: ['gin', 'vodka', 'whiskey']
  },
  'Cappelletti Aperitivo': {
    flavor: ['bitter', 'orange', 'herbal', 'citrus'],
    intensity: 'medium',
    bitterness: 'medium',
    sweetness: 'medium',
    best_for: ['gin', 'vodka', 'prosecco']
  },
  'Cynar': {
    flavor: ['artichoke', 'bitter', 'herbal', 'vegetal'],
    intensity: 'medium',
    bitterness: 'medium',
    sweetness: 'low',
    best_for: ['gin', 'vodka', 'tequila']
  },
  'Fernet Branca': {
    flavor: ['menthol', 'bitter', 'herbal', 'spice'],
    intensity: 'high',
    bitterness: 'very-high',
    sweetness: 'very-low',
    best_for: ['whiskey', 'mezcal', 'gin']
  },
  'Fernet Vallet': {
    flavor: ['menthol', 'bitter', 'herbal', 'spice'],
    intensity: 'high',
    bitterness: 'very-high',
    sweetness: 'very-low',
    best_for: ['whiskey', 'mezcal', 'gin']
  },
  'Punt e Mes': {
    flavor: ['bitter', 'sweet', 'orange', 'herbal'],
    intensity: 'medium',
    bitterness: 'medium',
    sweetness: 'medium',
    best_for: ['gin', 'whiskey', 'vermouth']
  }
};
*/

export class CocktailBuildEngine {
  private ingredientProfiles: Map<string, IngredientProfile> = new Map();
  private templates: Map<string, CocktailTemplate> = new Map();
  
  // Track recently shown cocktails for Flavor Journey to avoid repetition
  private recentlyShownFlavorJourney: Set<string> = new Set();
  private readonly MAX_RECENT_FLAVOR_JOURNEY = 15;

  constructor() {
    this.loadIngredientProfiles();
    this.loadTemplates();
  }

  // Method to reset recently shown cocktails for Flavor Journey
  resetRecentlyShownFlavorJourney() {
    this.recentlyShownFlavorJourney.clear();
  }

  // Method to add cocktail to recently shown list for Flavor Journey
  private addToRecentlyShownFlavorJourney(cocktailId: string) {
    this.recentlyShownFlavorJourney.add(cocktailId);
    
    // Keep only the most recent cocktails
    if (this.recentlyShownFlavorJourney.size > this.MAX_RECENT_FLAVOR_JOURNEY) {
      const cocktailsArray = Array.from(this.recentlyShownFlavorJourney);
      this.recentlyShownFlavorJourney = new Set(cocktailsArray.slice(-this.MAX_RECENT_FLAVOR_JOURNEY));
    }
  }

  private async loadIngredientProfiles() {
    try {
      // Load enhanced cocktail library instead of basic profiles
      const response = await fetch(DATA_PATHS.SOPHISTICATED_COCKTAIL_LIBRARY);
      const data = await response.json();
      
      // Create ingredient profiles from the cocktail library
      this.createIngredientProfilesFromLibrary(data);
    } catch (error) {
      console.error('Error loading ingredient profiles:', error);
    }
  }

  private createIngredientProfilesFromLibrary(libraryData: any) {
    // Create profiles from base spirits
    Object.entries(libraryData.base_spirits.traditional).forEach(([key, spirit]: [string, any]) => {
        this.ingredientProfiles.set(key, {
          id: key,
          name: spirit.name,
          category: 'spirit',
          subcategory: 'base',
          flavor_profile: {
            primary: spirit.flavor_characteristics,
            secondary: [],
            tertiary: [],
            intensity: {
              overall: 7,
              sweet: 5,
              sour: 3,
              bitter: 4,
              spicy: 6,
              aromatic: 8
            }
          },
          pairings: [],
          substitutions: [],
          best_uses: spirit.best_for || [],
          seasonal: false,
          regional: [],
          notes: spirit.description || ''
        });
    });

    Object.entries(libraryData.base_spirits.non_traditional).forEach(([key, spirit]: [string, any]) => {
        this.ingredientProfiles.set(key, {
          id: key,
          name: spirit.name,
          category: 'spirit',
          subcategory: 'specialty',
          flavor_profile: {
            primary: spirit.flavor_characteristics,
            secondary: [],
            tertiary: [],
            intensity: {
              overall: 8,
              sweet: 6,
              sour: 4,
              bitter: 5,
              spicy: 7,
              aromatic: 9
            }
          },
          pairings: [],
          substitutions: [],
          best_uses: spirit.best_for || [],
          seasonal: false,
          regional: [],
          notes: spirit.description || ''
        });
    });

    // Create profiles from modifying liqueurs
    Object.values(libraryData.modifying_liqueurs).forEach((category: any) => {
      Object.entries(category).forEach(([key, liqueur]: [string, any]) => {
          this.ingredientProfiles.set(key, {
            id: key,
            name: liqueur.name,
            category: 'liqueur',
            subcategory: 'modifier',
            flavor_profile: {
              primary: liqueur.flavor_profile,
              secondary: [],
              tertiary: [],
              intensity: {
                overall: 6,
                sweet: 8,
                sour: 3,
                bitter: 2,
                spicy: 4,
                aromatic: 7
              }
            },
            pairings: liqueur.best_pairings || [],
            substitutions: [],
            best_uses: [],
            seasonal: false,
            regional: [],
            notes: liqueur.description || ''
          });
      });
    });
  }

  private async loadTemplates() {
    try {
      // Load enhanced cocktail library for templates
      const response = await fetch(DATA_PATHS.SOPHISTICATED_COCKTAIL_LIBRARY);
      const data = await response.json();
      
      // Create templates from the cocktail library
      data.cocktails.forEach((cocktail: any) => {
        const template: CocktailTemplate = {
          id: cocktail.id,
          name: cocktail.name,
          type: cocktail.base_spirit,
          description: cocktail.description,
          base_structure: this.createBaseStructureFromCocktail(cocktail),
          build_type: cocktail.build_type,
          glassware: cocktail.glassware,
          garnish: cocktail.garnish,
          variations: []
        };
        this.templates.set(template.id, template);
      });
    } catch (error) {
      console.error('Error loading cocktail templates:', error);
    }
  }

  private createBaseStructureFromCocktail(cocktail: any) {
    const structure = [];
    
    // Find base spirit
    const baseIngredient = cocktail.ingredients.find((ing: any) => ing.role === 'base');
    if (baseIngredient) {
      structure.push({
        role: 'base' as const,
        required: true,
        ingredient_type: cocktail.base_spirit,
        proportion: { min: 1.5, max: 2.5, default: 2.0 },
        alternatives: [cocktail.base_spirit],
        flavor_profile: ['base']
      });
    }

    // Find modifier
    const modifierIngredient = cocktail.ingredients.find((ing: any) => ing.role === 'modifier');
    if (modifierIngredient) {
      structure.push({
        role: 'modifier' as const,
        required: true,
        ingredient_type: 'liqueur',
        proportion: { min: 0.5, max: 1.0, default: 0.75 },
        alternatives: cocktail.modifying_liqueurs || [],
        flavor_profile: ['modifier']
      });
    }

    // Find acid
    const acidIngredient = cocktail.ingredients.find((ing: any) => ing.role === 'acid');
    if (acidIngredient) {
      structure.push({
        role: 'citrus' as const,
        required: true,
        ingredient_type: 'citrus',
        proportion: { min: 0.5, max: 1.0, default: 0.75 },
        alternatives: ['lime', 'lemon', 'grapefruit'],
        flavor_profile: ['citrus', 'acid']
      });
    }

    return structure;
  }

  /**
   * Generate a cocktail recipe from available ingredients
   */
  async generateRecipe(request: RecipeGenerationRequest): Promise<GeneratedRecipe | null> {
    const { availableIngredients, templateId, preferences } = request;

    // Select appropriate template
    const template = templateId 
      ? this.templates.get(templateId)
      : this.selectBestTemplate(availableIngredients, preferences);

    if (!template) {
      console.error('No suitable template found');
      return null;
    }

    // Map ingredients to template roles
    const ingredientMapping = this.mapIngredientsToRoles(
      availableIngredients, 
      template.base_structure
    );

    if (!this.validateIngredientMapping(ingredientMapping, template)) {
      console.error('Invalid ingredient mapping');
      return null;
    }

    // Calculate proportions
    const proportions = this.calculateProportions(ingredientMapping, template);

    // Generate recipe
    const recipe = this.buildRecipe(template, ingredientMapping, proportions);

    // Calculate flavor balance
    recipe.balance_profile = this.calculateFlavorBalance(ingredientMapping);

    // Generate substitutions
    recipe.substitutions = this.generateSubstitutions(ingredientMapping);

    return recipe;
  }

  /**
   * Select the best template based on available ingredients
   */
  private selectBestTemplate(
    availableIngredients: string[], 
    preferences?: any
  ): CocktailTemplate | null {
    let bestTemplate: CocktailTemplate | null = null;
    let bestScore = 0;

    for (const template of this.templates.values()) {
      const score = this.calculateTemplateScore(template, availableIngredients, preferences);
      if (score > bestScore) {
        bestScore = score;
        bestTemplate = template;
      }
    }

    return bestTemplate;
  }

  /**
   * Calculate how well a template matches available ingredients
   */
  private calculateTemplateScore(
    template: CocktailTemplate, 
    availableIngredients: string[], 
    preferences?: any
  ): number {
    let score = 0;
    let requiredRoles = 0;

    for (const role of template.base_structure) {
      if (role.required) {
        requiredRoles++;
        const matchingIngredients = this.findMatchingIngredients(
          availableIngredients, 
          role
        );
        if (matchingIngredients.length > 0) {
          score += 100;
        }
      }
    }

    // Bonus for preference matching
    if (preferences?.spiritType && template.type === preferences.spiritType) {
      score += 50;
    }

    return score / requiredRoles;
  }

  /**
   * Find ingredients that match a specific role
   */
  private findMatchingIngredients(
    availableIngredients: string[], 
    role: any
  ): string[] {
    return availableIngredients.filter(ingredientId => {
      const profile = this.ingredientProfiles.get(ingredientId);
      if (!profile) return false;

      // Check ingredient type match
      if (role.ingredient_type && !profile.category.includes(role.ingredient_type)) {
        return false;
      }

      // Check flavor profile match
      if (role.flavor_profile) {
        const hasMatchingFlavor = role.flavor_profile.some((flavor: string) =>
          profile.flavor_profile.primary.includes(flavor) ||
          profile.flavor_profile.secondary.includes(flavor)
        );
        if (!hasMatchingFlavor) return false;
      }

      return true;
    });
  }

  /**
   * Map available ingredients to template roles
   */
  private mapIngredientsToRoles(
    availableIngredients: string[], 
    baseStructure: any[]
  ): Map<string, string> {
    const mapping = new Map<string, string>();

    for (const role of baseStructure) {
      const matchingIngredients = this.findMatchingIngredients(
        availableIngredients, 
        role
      );
      
      if (matchingIngredients.length > 0) {
        // Select the best matching ingredient
        const bestIngredient = this.selectBestIngredient(
          matchingIngredients, 
          role
        );
        mapping.set(role.role, bestIngredient);
      }
    }

    return mapping;
  }

  /**
   * Select the best ingredient for a role
   */
  private selectBestIngredient(ingredients: string[], _role: any): string {
    // For now, return the first ingredient
    // In a more sophisticated system, this would consider:
    // - Flavor intensity matching
    // - User preferences
    // - Seasonal availability
    return ingredients[0];
  }

  /**
   * Validate that all required ingredients are mapped
   */
  private validateIngredientMapping(
    mapping: Map<string, string>, 
    template: CocktailTemplate
  ): boolean {
    for (const role of template.base_structure) {
      if (role.required && !mapping.has(role.role)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Calculate optimal proportions for ingredients
   */
  private calculateProportions(
    mapping: Map<string, string>, 
    template: CocktailTemplate
  ): Map<string, number> {
    const proportions = new Map<string, number>();

    for (const role of template.base_structure) {
      const ingredientId = mapping.get(role.role);
      if (ingredientId) {
        const profile = this.ingredientProfiles.get(ingredientId);
        if (profile) {
          // Calculate proportion based on ingredient intensity and role
          let proportion = role.proportion.default;
          
          // Adjust based on ingredient intensity
          const intensity = profile.flavor_profile.intensity.overall;
          if (intensity > 7) {
            proportion *= 0.8; // Reduce strong ingredients
          } else if (intensity < 4) {
            proportion *= 1.2; // Increase mild ingredients
          }

          proportions.set(ingredientId, proportion);
        }
      }
    }

    return proportions;
  }

  /**
   * Build the complete recipe
   */
  private buildRecipe(
    template: CocktailTemplate,
    mapping: Map<string, string>,
    proportions: Map<string, number>
  ): GeneratedRecipe {
    const ingredients: string[] = [];

    // Build ingredient list with proportions
    for (const [, ingredientId] of mapping) {
      const proportion = proportions.get(ingredientId) || 1;
      const profile = this.ingredientProfiles.get(ingredientId);
      
      if (profile) {
        const proportionStr = this.formatProportion(proportion);
        let ingredientName = profile.name;
        
        // Replace generic amaro with specific amaro based on base spirit
        if (mapping.has('base')) {
          const baseSpiritId = mapping.get('base');
          const baseProfile = this.ingredientProfiles.get(baseSpiritId || '');
          if (baseProfile) {
            ingredientName = this.replaceGenericAmaro(ingredientName, baseProfile.category);
          }
        }
        
        ingredients.push(`${proportionStr} ${ingredientName}`);
      }
    }

    // Generate recipe name
    const name = this.generateRecipeName(template, mapping);

    return {
      id: `generated-${Date.now()}`,
      name,
      template_id: template.id,
      generated: true,
      ingredients,
      balance_profile: {
        sweet: 0,
        sour: 0,
        bitter: 0,
        spicy: 0,
        aromatic: 0,
        alcoholic: 0
      },
      complexity_score: this.calculateComplexityScore(template, mapping),
      seasonal_notes: [],
      substitutions: [],
      glassware: template.glassware,
      garnish: template.garnish,
      build_type: template.build_type
    };
  }

  /**
   * Format proportion for display
   */
  private formatProportion(proportion: number): string {
    if (proportion >= 1) {
      return `${proportion}oz`;
    } else {
      return `${Math.round(proportion * 100)}ml`;
    }
  }

  /**
   * Generate a creative recipe name
   */
  private generateRecipeName(
    template: CocktailTemplate,
    mapping: Map<string, string>
  ): string {
    const baseSpirit = mapping.get('base');
    const modifier = mapping.get('modifier');
    
    if (baseSpirit && modifier) {
      const spiritProfile = this.ingredientProfiles.get(baseSpirit);
      const modifierProfile = this.ingredientProfiles.get(modifier);
      
      if (spiritProfile && modifierProfile) {
        // Use sophisticated naming for generated recipes too
        const spiritName = spiritProfile.name.toLowerCase();
        const modifierName = modifierProfile.name.toLowerCase();
        
        // Determine flavor family based on modifier
        let flavorFamily = 'mystical';
        if (modifierName.includes('citrus') || modifierName.includes('lemon') || modifierName.includes('lime')) {
          flavorFamily = 'citrus';
        } else if (modifierName.includes('herb') || modifierName.includes('mint') || modifierName.includes('basil')) {
          flavorFamily = 'herbal';
        } else if (modifierName.includes('flower') || modifierName.includes('elderflower') || modifierName.includes('rose')) {
          flavorFamily = 'floral';
        } else if (modifierName.includes('spice') || modifierName.includes('cinnamon') || modifierName.includes('ginger')) {
          flavorFamily = 'spicy';
        } else if (modifierName.includes('tropical') || modifierName.includes('coconut') || modifierName.includes('passion')) {
          flavorFamily = 'tropical';
        }
        
        return this.generateSophisticatedCustomName(spiritName, flavorFamily, modifierName);
      }
    }
    
    return `Custom ${template.name}`;
  }

  /**
   * Calculate recipe complexity score
   */
  private calculateComplexityScore(
    template: CocktailTemplate,
    mapping: Map<string, string>
  ): number {
    let score = 3; // Base complexity
    
    score += template.base_structure.length; // More ingredients = more complex
    score += mapping.size; // More roles filled = more complex
    
    return Math.min(score, 10);
  }

  /**
   * Calculate flavor balance of the recipe
   */
  private calculateFlavorBalance(mapping: Map<string, string>): FlavorBalance {
    const balance: FlavorBalance = {
      sweet: 0,
      sour: 0,
      bitter: 0,
      spicy: 0,
      aromatic: 0,
      alcoholic: 0
    };

    for (const [, ingredientId] of mapping) {
      const profile = this.ingredientProfiles.get(ingredientId);
      if (profile) {
        const intensity = profile.flavor_profile.intensity;
        
        balance.sweet += intensity.sweet;
        balance.sour += intensity.sour;
        balance.bitter += intensity.bitter;
        balance.spicy += intensity.spicy;
        balance.aromatic += intensity.aromatic;
        balance.alcoholic += intensity.overall;
      }
    }

    // Normalize to 0-10 scale
    const ingredientCount = mapping.size;
    if (ingredientCount > 0) {
      balance.sweet = Math.round(balance.sweet / ingredientCount);
      balance.sour = Math.round(balance.sour / ingredientCount);
      balance.bitter = Math.round(balance.bitter / ingredientCount);
      balance.spicy = Math.round(balance.spicy / ingredientCount);
      balance.aromatic = Math.round(balance.aromatic / ingredientCount);
      balance.alcoholic = Math.round(balance.alcoholic / ingredientCount);
    }

    return balance;
  }

  /**
   * Generate substitution suggestions
   */
  private generateSubstitutions(mapping: Map<string, string>): Substitution[] {
    const substitutions: Substitution[] = [];

    for (const [, ingredientId] of mapping) {
      const profile = this.ingredientProfiles.get(ingredientId);
      if (profile && profile.substitutions) {
        profile.substitutions.forEach(subId => {
          const subProfile = this.ingredientProfiles.get(subId);
          if (subProfile) {
            substitutions.push({
              original: profile.name,
              substitute: subProfile.name,
              ratio: 1.0,
              notes: `Similar flavor profile with ${subProfile.flavor_profile.primary.join(', ')} notes`,
              compatibility: 85
            });
          }
        });
      }
    }

    return substitutions;
  }

  /**
   * Get available templates
   */
  getAvailableTemplates(): CocktailTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get ingredient profile by ID
   */
  getIngredientProfile(id: string): IngredientProfile | undefined {
    return this.ingredientProfiles.get(id);
  }

  /**
   * Get all ingredient profiles
   */
  getAllIngredientProfiles(): IngredientProfile[] {
    return Array.from(this.ingredientProfiles.values());
  }

  /**
   * Select the best amaro based on the base spirit and cocktail context
   */
  private selectBestAmaro(baseSpirit: string, _cocktailContext: any = {}): string {
    // Default selections based on base spirit
    const spiritPreferences: Record<string, string[]> = {
      'mezcal': ['Fernet Branca', 'Amaro Averna', 'Amaro Nonino'],
      'tequila': ['Amaro Lucano', 'Amaro Ramazzotti', 'Amaro Sibilla'],
      'gin': ['Aperol', 'Campari', 'Amaro Lucano'],
      'vodka': ['Aperol', 'Cappelletti Aperitivo', 'Amaro Montenegro'],
      'whiskey': ['Amaro Nonino', 'Fernet Branca', 'Amaro Averna'],
      'bourbon': ['Amaro Nonino', 'Amaro Averna', 'Fernet Branca'],
      'brandy': ['Amaro Nonino', 'Amaro Montenegro', 'Amaro Averna'],
      'rum': ['Amaro Averna', 'Amaro Sibilla', 'Fernet Branca'],
      'cognac': ['Amaro Nonino', 'Amaro Montenegro', 'Punt e Mes']
    };

    const preferredAmaros = spiritPreferences[baseSpirit] || spiritPreferences['gin'];
    
    // Return a random amaro from the preferred list for variety
    return preferredAmaros[Math.floor(Math.random() * preferredAmaros.length)];
  }

  /**
   * Replace generic amaro references with specific amaros
   */
  private replaceGenericAmaro(ingredient: string, baseSpirit: string): string {
    if (ingredient.toLowerCase().includes('amaro') && !SPECIFIC_AMAROS.some(amaro => ingredient.includes(amaro))) {
      const specificAmaro = this.selectBestAmaro(baseSpirit);
      return ingredient.replace(/amaro/gi, specificAmaro);
    }
    return ingredient;
  }

  /**
   * Generate cocktails based on Flavor Journey selections
   */
  async generateFromFlavorJourney(selectedIngredients: any): Promise<GeneratedRecipe[]> {
    const cocktails: GeneratedRecipe[] = [];
    
    try {
      // Load the enhanced cocktail library
      const response = await fetch(DATA_PATHS.SOPHISTICATED_COCKTAIL_LIBRARY);
      
      if (!response.ok) {
        throw new Error(`Failed to load cocktail library: ${response.status}`);
      }
      
      const libraryData = await response.json();
      
      const matchingCocktails = libraryData.cocktails.filter((cocktail: any) => {
        const baseSpiritMatch = cocktail.base_spirit === selectedIngredients.baseSpirit;
        
        // Check for flavor family match (e.g., "citrus" family matches "citrus" tag)
        const flavorFamilyMatch = selectedIngredients.flavorFamily && 
          cocktail.tags.some((tag: string) => 
            tag.toLowerCase() === selectedIngredients.flavorFamily.toLowerCase()
          );
        
        // Check for specific flavor match (e.g., "lemon" specific flavor matches "lemon" tag)
        const specificFlavorMatch = selectedIngredients.specificFlavor && 
          cocktail.tags.some((tag: string) => 
            tag.toLowerCase() === selectedIngredients.specificFlavor.toLowerCase()
          );
        
        // Return true if base spirit matches AND (flavor family OR specific flavor matches)
        return baseSpiritMatch && (flavorFamilyMatch || specificFlavorMatch);
      });

      // Filter out recently shown cocktails for more variety
      const availableCocktails = matchingCocktails.filter((cocktail: any) => 
        !this.recentlyShownFlavorJourney.has(cocktail.id)
      );
      
      // If we've shown too many recently, use all cocktails for some repetition
      const cocktailsToUse = availableCocktails.length > 8 ? availableCocktails : matchingCocktails;
      
      // Enhanced randomization with multiple shuffle passes
      const shuffledCocktails = [...cocktailsToUse].sort(() => Math.random() - 0.5)
                                                   .sort(() => Math.random() - 0.5);
      const selectedCocktails = shuffledCocktails.slice(0, 12);
      
      // Convert matching cocktails to GeneratedRecipe format
      selectedCocktails.forEach((cocktail: any) => {
        // Track this cocktail as recently shown
        this.addToRecentlyShownFlavorJourney(cocktail.id);
        const recipe: GeneratedRecipe = {
          id: cocktail.id,
          name: cocktail.name,
          template_id: cocktail.id,
          generated: true,
          ingredients: cocktail.ingredients.map((ing: any) => {
            const ingredientName = this.replaceGenericAmaro(ing.name, cocktail.base_spirit);
            return `${ing.amount} ${ingredientName}`;
          }),
          balance_profile: {
            sweet: cocktail.flavor_profile.sweet || 5,
            sour: cocktail.flavor_profile.sour || 5,
            bitter: cocktail.flavor_profile.bitter || 3,
            spicy: cocktail.flavor_profile.spicy || 4,
            aromatic: cocktail.flavor_profile.aromatic || 6,
            alcoholic: cocktail.flavor_profile.alcoholic || 7
          },
          complexity_score: cocktail.difficulty === 'easy' ? 3 : cocktail.difficulty === 'intermediate' ? 6 : 9,
          seasonal_notes: cocktail.seasonal_notes || [],
          substitutions: [],
          glassware: cocktail.glassware,
          garnish: cocktail.garnish,
          build_type: cocktail.build_type
        };
        
        cocktails.push(recipe);
      });

      // If no exact matches, create a custom cocktail based on selections
      if (cocktails.length === 0) {
        const customCocktail = this.createCustomCocktail(selectedIngredients);
        if (customCocktail) {
          cocktails.push(customCocktail);
        }
      }

    } catch (error) {
      console.error('Error generating cocktails from flavor journey:', error);
    }

    return cocktails;
  }

  /**
   * Generate a sophisticated name for custom cocktails
   */
  private generateSophisticatedCustomName(_baseSpirit: string, flavorFamily: string, specificFlavor?: string): string {
    // Sophisticated naming themes based on the naming system
    const namingThemes = {
      mystical: ["The Oracle's", "The Alchemist's", "The Enchanter's", "The Mystic's", "The Seer's", "The Prophet's", "The Sage's", "The Shaman's"],
      romantic: ["Venus's", "Cupid's", "Aphrodite's", "The Lover's", "The Beloved's", "The Enchanted", "The Serenade", "The Embrace"],
      literary: ["The Poet's", "The Bard's", "The Scholar's", "The Philosopher's", "The Writer's", "The Dreamer's", "The Visionary's", "The Muse's"],
      geographical: ["The Venetian", "The Parisian", "The Tokyo", "The London", "The Havana", "The Manhattan", "The Brooklyn", "The Queens"],
      seasonal: ["Spring's", "Summer's", "Autumn's", "Winter's", "The Equinox", "The Solstice", "The Harvest", "The Bloom"],
      celestial: ["The Moon's", "The Star's", "The Comet's", "The Aurora's", "The Eclipse", "The Constellation", "The Galaxy", "The Cosmos"],
      elemental: ["The Fire", "The Water", "The Earth", "The Air", "The Storm", "The Thunder", "The Lightning", "The Rainbow"],
      historical: ["The Ancient", "The Medieval", "The Renaissance", "The Victorian", "The Art Deco", "The Jazz Age", "The Golden Age", "The Classic"]
    };

    const suffixes = [
      "Elixir", "Dream", "Vision", "Secret", "Mystery", "Charm", "Spell", "Magic", 
      "Essence", "Nectar", "Ambrosia", "Potion", "Brew", "Concoction", "Creation", 
      "Masterpiece", "Treasure", "Gem", "Jewel", "Crown", "Scepter", "Wand", "Key", 
      "Door", "Portal", "Gateway", "Bridge", "Path", "Journey", "Adventure", "Quest", 
      "Discovery", "Revelation", "Awakening", "Transformation", "Evolution", "Revolution"
    ];

    // Select theme based on flavor family and base spirit
    let selectedTheme = 'mystical'; // default
    
    if (flavorFamily === 'citrus') {
      selectedTheme = 'celestial';
    } else if (flavorFamily === 'herbal') {
      selectedTheme = 'mystical';
    } else if (flavorFamily === 'floral') {
      selectedTheme = 'romantic';
    } else if (flavorFamily === 'spicy') {
      selectedTheme = 'elemental';
    } else if (flavorFamily === 'tropical') {
      selectedTheme = 'geographical';
    }

    // Special handling for specific flavors
    if (specificFlavor) {
      if (specificFlavor.toLowerCase().includes('cinnamon')) {
        selectedTheme = 'historical';
      } else if (specificFlavor.toLowerCase().includes('vanilla')) {
        selectedTheme = 'romantic';
      } else if (specificFlavor.toLowerCase().includes('smoke')) {
        selectedTheme = 'elemental';
      }
    }

    // Select random prefix and suffix
    const themePrefixes = namingThemes[selectedTheme as keyof typeof namingThemes];
    const prefix = themePrefixes[Math.floor(Math.random() * themePrefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    return `${prefix} ${suffix}`;
  }

  /**
   * Create a custom cocktail based on Flavor Journey selections
   */
  private createCustomCocktail(selectedIngredients: any): GeneratedRecipe | null {
    const baseSpirit = selectedIngredients.baseSpirit;
    const flavorFamily = selectedIngredients.flavorFamily;
    const specificFlavor = selectedIngredients.specificFlavor;

    if (!baseSpirit || !flavorFamily) return null;

    // Generate a sophisticated cocktail name using the naming system
    const cocktailName = this.generateSophisticatedCustomName(baseSpirit, flavorFamily, specificFlavor);

    // Create a more readable spirit name for ingredients
    const spiritName = baseSpirit.charAt(0).toUpperCase() + baseSpirit.slice(1);

    // Create ingredients based on flavor family and specific selections
    let ingredients: string[] = [];
    let glassware = "coupe";
    let garnish = ["citrus-twist"];
    let buildType = "shaken";
    let balanceProfile = {
      sweet: 6,
      sour: 6,
      bitter: 3,
      spicy: 4,
      aromatic: 7,
      alcoholic: 7
    };

    // Customize based on flavor family
    switch (flavorFamily) {
      case 'citrus':
        ingredients = [
          `2oz ${spiritName}`,
          `0.75oz Fresh ${specificFlavor || 'lemon'} juice`,
          `0.5oz ${specificFlavor || 'lemon'} liqueur`,
          `0.5oz Simple syrup`,
          `0.25oz Triple sec`
        ];
        garnish = [`${specificFlavor || 'lemon'}-twist`];
        balanceProfile = { sweet: 5, sour: 8, bitter: 2, spicy: 3, aromatic: 6, alcoholic: 7 };
        break;
        
      case 'herbal':
        const herbalAmaro = this.selectBestAmaro(baseSpirit);
        ingredients = [
          `2oz ${spiritName}`,
          `0.75oz ${herbalAmaro}`,
          `0.5oz Fresh lime juice`,
          `0.5oz Simple syrup`,
          `0.25oz Green Chartreuse`
        ];
        buildType = "shaken";
        garnish = [`${specificFlavor || 'herb'}-sprig`];
        balanceProfile = { sweet: 4, sour: 6, bitter: 5, spicy: 4, aromatic: 8, alcoholic: 7 };
        break;
        
      case 'floral':
        ingredients = [
          `2oz ${spiritName}`,
          `0.75oz St-Germain`,
          `0.5oz Fresh lemon juice`,
          `0.5oz Simple syrup`,
          `0.25oz Rose water`
        ];
        garnish = ["edible-flower"];
        balanceProfile = { sweet: 7, sour: 5, bitter: 3, spicy: 2, aromatic: 9, alcoholic: 6 };
        break;
        
      case 'spicy':
        ingredients = [
          `2oz ${spiritName}`,
          `0.75oz Fresh lime juice`,
          `0.5oz Simple syrup`,
          `0.25oz Jalapeño simple syrup`,
          `2 dashes Angostura bitters`
        ];
        garnish = ["jalapeño-slice"];
        balanceProfile = { sweet: 5, sour: 6, bitter: 4, spicy: 8, aromatic: 5, alcoholic: 7 };
        break;
        
      case 'tropical':
        ingredients = [
          `2oz ${spiritName}`,
          `0.75oz Fresh ${specificFlavor || 'passion-fruit'} juice`,
          `0.5oz Coconut cream`,
          `0.5oz Simple syrup`,
          `0.25oz Lime juice`
        ];
        garnish = ["pineapple-wedge", "cherry"];
        balanceProfile = { sweet: 8, sour: 6, bitter: 2, spicy: 3, aromatic: 6, alcoholic: 6 };
        break;
        
      default:
        ingredients = [
          `2oz ${spiritName}`,
          `0.75oz Fresh citrus juice`,
          `0.5oz Simple syrup`,
          `0.25oz Triple sec`
        ];
    }

    return {
      id: `custom-${Date.now()}`,
      name: cocktailName,
      template_id: 'custom-template',
      generated: true,
      ingredients,
      balance_profile: balanceProfile,
      complexity_score: 5,
      seasonal_notes: [`Custom ${flavorFamily} creation tailored to your taste`],
      substitutions: [],
      glassware,
      garnish,
      build_type: buildType
    };
  }
}

// Export singleton instance
export const cocktailBuildEngine = new CocktailBuildEngine();
