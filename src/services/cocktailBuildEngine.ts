import { 
  CocktailTemplate, 
  IngredientProfile, 
  FlavorBalance, 
  RecipeGenerationRequest,
  GeneratedRecipe,
  Substitution
} from '../types';
import { DATA_PATHS } from '../constants';

export class CocktailBuildEngine {
  private ingredientProfiles: Map<string, IngredientProfile> = new Map();
  private templates: Map<string, CocktailTemplate> = new Map();

  constructor() {
    this.loadIngredientProfiles();
    this.loadTemplates();
  }

  private async loadIngredientProfiles() {
    try {
      // Load enhanced cocktail library instead of basic profiles
      const response = await fetch(DATA_PATHS.ENHANCED_COCKTAIL_LIBRARY);
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
      const response = await fetch(DATA_PATHS.ENHANCED_COCKTAIL_LIBRARY);
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
          instructions: cocktail.instructions,
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
    const instructions = [...template.instructions];

    // Build ingredient list with proportions
    for (const [, ingredientId] of mapping) {
      const proportion = proportions.get(ingredientId) || 1;
      const profile = this.ingredientProfiles.get(ingredientId);
      
      if (profile) {
        const proportionStr = this.formatProportion(proportion);
        ingredients.push(`${proportionStr} ${profile.name}`);
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
      instructions,
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
        return `${modifierProfile.name} ${spiritProfile.name} ${template.name}`;
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
   * Generate cocktails based on Flavor Journey selections
   */
  async generateFromFlavorJourney(selectedIngredients: any): Promise<GeneratedRecipe[]> {
    const cocktails: GeneratedRecipe[] = [];
    
    try {
      // Load the enhanced cocktail library
      const response = await fetch(DATA_PATHS.ENHANCED_COCKTAIL_LIBRARY);
      
      if (!response.ok) {
        throw new Error(`Failed to load cocktail library: ${response.status}`);
      }
      
      const libraryData = await response.json();
      
      const matchingCocktails = libraryData.cocktails.filter((cocktail: any) => {
        const baseSpiritMatch = cocktail.base_spirit === selectedIngredients.baseSpirit;
        const flavorMatch = cocktail.tags.some((tag: string) => 
          selectedIngredients.flavorFamily && 
          selectedIngredients.flavorFamily.toLowerCase().includes(tag)
        );
        
        return baseSpiritMatch || flavorMatch;
      });

      // Convert matching cocktails to GeneratedRecipe format
      matchingCocktails.slice(0, 3).forEach((cocktail: any) => {
        const recipe: GeneratedRecipe = {
          id: cocktail.id,
          name: cocktail.name,
          template_id: cocktail.id,
          generated: true,
          ingredients: cocktail.ingredients.map((ing: any) => `${ing.amount} ${ing.name}`),
          instructions: cocktail.instructions,
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
   * Create a custom cocktail based on Flavor Journey selections
   */
  private createCustomCocktail(selectedIngredients: any): GeneratedRecipe | null {
    const baseSpirit = selectedIngredients.baseSpirit;
    const flavorFamily = selectedIngredients.flavorFamily;
    const specificFlavor = selectedIngredients.specificFlavor;

    if (!baseSpirit || !flavorFamily) return null;

    // Create a custom cocktail name
    const cocktailName = `${specificFlavor || flavorFamily} ${baseSpirit} Creation`;

    // Create basic ingredients based on selections
    const ingredients = [
      `2oz ${baseSpirit.charAt(0).toUpperCase() + baseSpirit.slice(1)}`,
      `0.75oz ${specificFlavor || flavorFamily} liqueur`,
      `0.75oz Fresh citrus juice`,
      `0.5oz Simple syrup`
    ];

    return {
      id: `custom-${Date.now()}`,
      name: cocktailName,
      template_id: 'custom-template',
      generated: true,
      ingredients,
      instructions: [
        "Combine all ingredients in a shaker with ice",
        "Shake vigorously for 15 seconds",
        "Double strain into a chilled coupe glass",
        "Garnish as desired"
      ],
      balance_profile: {
        sweet: 6,
        sour: 6,
        bitter: 3,
        spicy: 4,
        aromatic: 7,
        alcoholic: 7
      },
      complexity_score: 5,
      seasonal_notes: ["Custom creation based on your preferences"],
      substitutions: [],
      glassware: "coupe",
      garnish: ["citrus-twist"],
      build_type: "shaken"
    };
  }
}

// Export singleton instance
export const cocktailBuildEngine = new CocktailBuildEngine();
