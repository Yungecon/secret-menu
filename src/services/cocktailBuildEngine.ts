import { Cocktail, CocktailTemplate, IngredientProfile, FlavorBalance } from '../types';

export interface RecipeGenerationRequest {
  availableIngredients: string[];
  templateId?: string;
  preferences?: {
    spiritType?: string;
    flavorProfile?: string[];
    sweetness?: number;
    strength?: number;
  };
}

export interface GeneratedRecipe {
  id: string;
  name: string;
  template_id: string;
  generated: boolean;
  ingredients: string[];
  instructions: string[];
  balance_profile: FlavorBalance;
  complexity_score: number;
  seasonal_notes: string[];
  substitutions: Substitution[];
  glassware: string;
  garnish: string[];
  build_type: string;
}

export interface Substitution {
  original: string;
  substitute: string;
  ratio: number;
  notes: string;
  compatibility: number;
}

export interface FlavorBalance {
  sweet: number;
  sour: number;
  bitter: number;
  spicy: number;
  aromatic: number;
  alcoholic: number;
}

export class CocktailBuildEngine {
  private ingredientProfiles: Map<string, IngredientProfile> = new Map();
  private templates: Map<string, CocktailTemplate> = new Map();

  constructor() {
    this.loadIngredientProfiles();
    this.loadTemplates();
  }

  private async loadIngredientProfiles() {
    try {
      const response = await fetch('/src/assets/data/ingredient_flavor_profiles.json');
      const data = await response.json();
      
      data.ingredients.forEach((ingredient: IngredientProfile) => {
        this.ingredientProfiles.set(ingredient.id, ingredient);
      });
    } catch (error) {
      console.error('Error loading ingredient profiles:', error);
    }
  }

  private async loadTemplates() {
    try {
      const response = await fetch('/src/assets/data/cocktail_templates.json');
      const data = await response.json();
      
      data.templates.forEach((template: CocktailTemplate) => {
        this.templates.set(template.id, template);
      });
    } catch (error) {
      console.error('Error loading cocktail templates:', error);
    }
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
  private selectBestIngredient(ingredients: string[], role: any): string {
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
    for (const [role, ingredientId] of mapping) {
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

    for (const [role, ingredientId] of mapping) {
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

    for (const [role, ingredientId] of mapping) {
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
}

// Export singleton instance
export const cocktailBuildEngine = new CocktailBuildEngine();
