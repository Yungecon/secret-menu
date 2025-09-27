import { IngredientMatrix, BartenderRecommendation } from '../types';

export interface IngredientFilter {
  spiritType?: string;
  pricePoint?: 'budget' | 'medium' | 'high' | 'premium';
  season?: 'spring' | 'summer' | 'fall' | 'winter';
  upsellPotential?: 'low' | 'medium' | 'high' | 'very-high';
  inventoryPriority?: 'very_high' | 'high' | 'medium' | 'low';
}

export interface IngredientSearchResult {
  ingredient: any;
  relevanceScore: number;
  matchReasons: string[];
  suggestedCocktails: string[];
}

export interface SeasonalRecommendation {
  season: string;
  featuredIngredients: any[];
  recommendedCocktails: string[];
  description: string;
}

export class IngredientSpotlightService {
  private ingredientMatrix: IngredientMatrix | null = null;

  constructor() {
    this.loadIngredientMatrix();
  }

  private async loadIngredientMatrix() {
    try {
      const response = await fetch('/src/assets/data/ingredient_matrix.json');
      this.ingredientMatrix = await response.json();
    } catch (error) {
      console.error('Error loading ingredient matrix:', error);
    }
  }

  /**
   * Search ingredients by various criteria
   */
  async searchIngredients(query: string, filters?: IngredientFilter): Promise<IngredientSearchResult[]> {
    if (!this.ingredientMatrix) {
      return [];
    }

    const results: IngredientSearchResult[] = [];
    const queryLower = query.toLowerCase();

    // Search through all spirit categories
    for (const [, spiritData] of Object.entries(this.ingredientMatrix.ingredient_matrix.spirits)) {
      for (const ingredient of spiritData.ingredients) {
        if (this.matchesQuery(ingredient, queryLower) && this.matchesFilters(ingredient, filters)) {
          results.push({
            ingredient,
            relevanceScore: this.calculateRelevanceScore(ingredient, queryLower, filters),
            matchReasons: this.getMatchReasons(ingredient, queryLower, filters),
            suggestedCocktails: ingredient.best_for || []
          });
        }
      }
    }

    // Search through liqueurs
    for (const [, liqueurData] of Object.entries(this.ingredientMatrix.ingredient_matrix.liqueurs)) {
      for (const ingredient of liqueurData.ingredients) {
        if (this.matchesQuery(ingredient, queryLower) && this.matchesFilters(ingredient, filters)) {
          results.push({
            ingredient,
            relevanceScore: this.calculateRelevanceScore(ingredient, queryLower, filters),
            matchReasons: this.getMatchReasons(ingredient, queryLower, filters),
            suggestedCocktails: ingredient.best_for || []
          });
        }
      }
    }

    // Search through mixers
    for (const [, mixerData] of Object.entries(this.ingredientMatrix.ingredient_matrix.mixers)) {
      for (const ingredient of mixerData.ingredients) {
        if (this.matchesQuery(ingredient, queryLower) && this.matchesFilters(ingredient, filters)) {
          results.push({
            ingredient,
            relevanceScore: this.calculateRelevanceScore(ingredient, queryLower, filters),
            matchReasons: this.getMatchReasons(ingredient, queryLower, filters),
            suggestedCocktails: ingredient.best_for || []
          });
        }
      }
    }

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Get ingredients by spirit category
   */
  async getIngredientsBySpirit(spiritType: string): Promise<any[]> {
    if (!this.ingredientMatrix) {
      return [];
    }

    const spiritData = this.ingredientMatrix.ingredient_matrix.spirits[spiritType as keyof typeof this.ingredientMatrix.ingredient_matrix.spirits];
    return spiritData ? spiritData.ingredients : [];
  }

  /**
   * Get seasonal spotlight recommendations
   */
  async getSeasonalSpotlight(season: string): Promise<SeasonalRecommendation | null> {
    if (!this.ingredientMatrix) {
      return null;
    }

    const seasonalData = this.ingredientMatrix.seasonal_spotlights[`${season}_2024` as keyof typeof this.ingredientMatrix.seasonal_spotlights];
    if (!seasonalData) {
      return null;
    }

    // Get full ingredient details
    const featuredIngredients = await Promise.all(
      seasonalData.featured.map(async (ingredientId: string) => {
        const searchResults = await this.searchIngredients(ingredientId);
        return searchResults[0]?.ingredient;
      })
    );

    return {
      season,
      featuredIngredients: featuredIngredients.filter(Boolean),
      recommendedCocktails: seasonalData.cocktails,
      description: seasonalData.description
    };
  }

  /**
   * Get bartender recommendations
   */
  async getBartenderRecommendations(): Promise<BartenderRecommendation[]> {
    if (!this.ingredientMatrix) {
      return [];
    }

    return this.ingredientMatrix.bartender_recommendations.signature_drinks;
  }

  /**
   * Get upsell opportunities
   */
  async getUpsellOpportunities(baseIngredient: string): Promise<any[]> {
    if (!this.ingredientMatrix) {
      return [];
    }

    const upsells = this.ingredientMatrix.bartender_recommendations.upsell_opportunities;
    return upsells.filter(upsell => upsell.base === baseIngredient);
  }

  /**
   * Get ingredients by inventory priority
   */
  async getIngredientsByInventoryPriority(priority: string): Promise<any[]> {
    if (!this.ingredientMatrix) {
      return [];
    }

    const priorityIngredients = this.ingredientMatrix.inventory_priorities[priority as keyof typeof this.ingredientMatrix.inventory_priorities];
    if (!priorityIngredients) {
      return [];
    }

    const results = [];
    for (const ingredientId of priorityIngredients) {
      const searchResults = await this.searchIngredients(ingredientId);
      if (searchResults.length > 0) {
        results.push(searchResults[0].ingredient);
      }
    }

    return results;
  }

  /**
   * Get ingredients by price point
   */
  async getIngredientsByPricePoint(pricePoint: string): Promise<any[]> {
    if (!this.ingredientMatrix) {
      return [];
    }

    const priceIngredients = this.ingredientMatrix.filtering_categories.by_price_point[pricePoint as keyof typeof this.ingredientMatrix.filtering_categories.by_price_point];
    if (!priceIngredients) {
      return [];
    }

    const results = [];
    for (const ingredientId of priceIngredients) {
      const searchResults = await this.searchIngredients(ingredientId);
      if (searchResults.length > 0) {
        results.push(searchResults[0].ingredient);
      }
    }

    return results;
  }

  /**
   * Check if ingredient matches search query
   */
  private matchesQuery(ingredient: any, query: string): boolean {
    if (!query) return true;

    const searchableFields = [
      ingredient.name,
      ingredient.id,
      ...(ingredient.flavor_profile || []),
      ...(ingredient.best_for || []),
      ingredient.tier,
      ingredient.subcategory
    ];

    return searchableFields.some(field => 
      field && field.toString().toLowerCase().includes(query)
    );
  }

  /**
   * Check if ingredient matches filters
   */
  private matchesFilters(ingredient: any, filters?: IngredientFilter): boolean {
    if (!filters) return true;

    if (filters.pricePoint && ingredient.price_point !== filters.pricePoint) {
      return false;
    }

    if (filters.upsellPotential && ingredient.upsell_potential !== filters.upsellPotential) {
      return false;
    }

    if (filters.inventoryPriority && ingredient.inventory_priority !== filters.inventoryPriority) {
      return false;
    }

    if (filters.season && !ingredient.seasonal) {
      // For seasonal filter, check if ingredient is featured in that season
      // This would require checking the seasonal_spotlights data
      // For now, we'll allow non-seasonal ingredients to pass through
    }

    return true;
  }

  /**
   * Calculate relevance score for search results
   */
  private calculateRelevanceScore(ingredient: any, query: string, filters?: IngredientFilter): number {
    let score = 0;

    // Name match gets highest score
    if (ingredient.name.toLowerCase().includes(query)) {
      score += 100;
    }

    // ID match gets high score
    if (ingredient.id.toLowerCase().includes(query)) {
      score += 80;
    }

    // Flavor profile match
    if (ingredient.flavor_profile?.some((flavor: string) => flavor.toLowerCase().includes(query))) {
      score += 60;
    }

    // Best uses match
    if (ingredient.best_for?.some((use: string) => use.toLowerCase().includes(query))) {
      score += 40;
    }

    // Filter bonuses
    if (filters?.pricePoint && ingredient.price_point === filters.pricePoint) {
      score += 20;
    }

    if (filters?.upsellPotential && ingredient.upsell_potential === filters.upsellPotential) {
      score += 15;
    }

    if (filters?.inventoryPriority && ingredient.inventory_priority === filters.inventoryPriority) {
      score += 10;
    }

    return score;
  }

  /**
   * Get reasons why ingredient matched
   */
  private getMatchReasons(ingredient: any, query: string, filters?: IngredientFilter): string[] {
    const reasons: string[] = [];

    if (ingredient.name.toLowerCase().includes(query)) {
      reasons.push('Name matches');
    }

    if (ingredient.flavor_profile?.some((flavor: string) => flavor.toLowerCase().includes(query))) {
      reasons.push('Flavor profile matches');
    }

    if (ingredient.best_for?.some((use: string) => use.toLowerCase().includes(query))) {
      reasons.push('Recommended for matching cocktails');
    }

    if (filters?.pricePoint && ingredient.price_point === filters.pricePoint) {
      reasons.push(`Price point: ${filters.pricePoint}`);
    }

    if (filters?.upsellPotential && ingredient.upsell_potential === filters.upsellPotential) {
      reasons.push(`Upsell potential: ${filters.upsellPotential}`);
    }

    return reasons;
  }

  /**
   * Get all available spirit categories
   */
  getSpiritCategories(): string[] {
    if (!this.ingredientMatrix) {
      return [];
    }

    return Object.keys(this.ingredientMatrix.ingredient_matrix.spirits);
  }

  /**
   * Get all available price points
   */
  getPricePoints(): string[] {
    return ['budget', 'medium', 'high', 'premium'];
  }

  /**
   * Get all available seasons
   */
  getSeasons(): string[] {
    return ['spring', 'summer', 'fall', 'winter'];
  }

  /**
   * Get all available upsell potentials
   */
  getUpsellPotentials(): string[] {
    return ['low', 'medium', 'high', 'very-high'];
  }

  /**
   * Get all available inventory priorities
   */
  getInventoryPriorities(): string[] {
    return ['very_high', 'high', 'medium', 'low'];
  }

  /**
   * Get ingredient statistics for analytics
   */
  getIngredientStats(): any {
    if (!this.ingredientMatrix) {
      return {};
    }

    const stats = {
      totalIngredients: 0,
      byCategory: {} as any,
      byPricePoint: {} as any,
      byUpsellPotential: {} as any,
      byInventoryPriority: {} as any
    };

    // Count ingredients in each spirit category
    for (const [spiritType, spiritData] of Object.entries(this.ingredientMatrix.ingredient_matrix.spirits)) {
      stats.byCategory[spiritType] = spiritData.ingredients.length;
      stats.totalIngredients += spiritData.ingredients.length;

      // Count by price point
      spiritData.ingredients.forEach((ingredient: any) => {
        stats.byPricePoint[ingredient.price_point] = (stats.byPricePoint[ingredient.price_point] || 0) + 1;
        stats.byUpsellPotential[ingredient.upsell_potential] = (stats.byUpsellPotential[ingredient.upsell_potential] || 0) + 1;
        stats.byInventoryPriority[ingredient.inventory_priority] = (stats.byInventoryPriority[ingredient.inventory_priority] || 0) + 1;
      });
    }

    // Count liqueurs and mixers
    for (const [liqueurType, liqueurData] of Object.entries(this.ingredientMatrix.ingredient_matrix.liqueurs)) {
      stats.byCategory[liqueurType] = liqueurData.ingredients.length;
      stats.totalIngredients += liqueurData.ingredients.length;
    }

    for (const [mixerType, mixerData] of Object.entries(this.ingredientMatrix.ingredient_matrix.mixers)) {
      stats.byCategory[mixerType] = mixerData.ingredients.length;
      stats.totalIngredients += mixerData.ingredients.length;
    }

    return stats;
  }
}

// Export singleton instance
export const ingredientSpotlightService = new IngredientSpotlightService();
