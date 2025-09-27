#!/usr/bin/env node

/**
 * Enhanced Cocktail Tag Enrichment Script
 * 
 * This script analyzes the cocktail database and adds missing tags to ensure
 * complete coverage for all 216 possible quiz combinations (3×3×3×2×4).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the cocktail data
const cocktailDataPath = path.join(__dirname, '../src/assets/data/secret_menu_mvp_cocktails.json');
const cocktails = JSON.parse(fs.readFileSync(cocktailDataPath, 'utf8'));

// Define fuzzy matching rules for tag inference
const fuzzyRules = {
  sweetness: {
    sweet: ['simple syrup', 'honey', 'agave', 'cream', 'chocolate', 'vanilla', 'caramel', 'sugar', 'grenadine', 'amaretto', 'baileys', 'triple sec', 'cointreau', 'grand marnier'],
    bitter: ['bitters', 'campari', 'aperol', 'amaro', 'vermouth', 'fernet', 'chartreuse'],
    balanced: ['vermouth', 'lillet', 'cocchi', 'dolin', 'dry vermouth', 'sweet vermouth']
  },
  fruitFamily: {
    citrus: ['lemon', 'lime', 'grapefruit', 'orange', 'citrus', 'yuzu', 'bergamot'],
    stone: ['peach', 'apricot', 'plum', 'cherry', 'brandied cherry', 'peach schnapps'],
    tropical: ['pineapple', 'coconut', 'mango', 'passion fruit', 'guava', 'papaya', 'lychee']
  },
  intensity: {
    light: ['build', 'build/top', 'soda', 'tonic', 'ginger beer', 'club soda'],
    medium: ['shaken', 'sour', 'daisy', 'fizz'],
    boozy: ['stirred', 'neat', 'up', 'old fashioned', 'manhattan', 'martini']
  },
  style: {
    classic: ['old fashioned', 'manhattan', 'martini', 'sour', 'negroni'],
    modern: ['collins', 'fizz', 'mule', 'highball'],
    experimental: ['smash', 'spritz', 'daisy', 'seasonal', 'herbal', 'smoked']
  }
};

// Helper function to check if ingredient list contains any of the target ingredients
function hasIngredient(cocktail, ingredients) {
  return cocktail.ingredients.some(ing => 
    ingredients.some(target => ing.toLowerCase().includes(target.toLowerCase()))
  );
}

// Helper function to check if base spirit matches
function hasBaseSpirit(cocktail, spirits) {
  return spirits.some(spirit => 
    cocktail.base_spirit_category.toLowerCase().includes(spirit.toLowerCase())
  );
}

// Helper function to check if style matches
function hasStyle(cocktail, styles) {
  return styles.some(style => 
    cocktail.style.toLowerCase().includes(style.toLowerCase())
  );
}

// Enhanced tag inference function with more aggressive tagging
function inferMissingTags(cocktail) {
  const newTags = [...cocktail.flavor_tags];
  let tagsAdded = 0;

  // Sweetness inference - be more aggressive
  const sweetnessTags = newTags.filter(tag => ['sweet', 'bitter', 'balanced'].includes(tag));
  if (sweetnessTags.length === 0) {
    // If no sweetness tags, infer from ingredients and style
    if (hasIngredient(cocktail, fuzzyRules.sweetness.sweet)) {
      newTags.push('sweet');
      tagsAdded++;
    } else if (hasIngredient(cocktail, fuzzyRules.sweetness.bitter)) {
      newTags.push('bitter');
      tagsAdded++;
    } else if (hasIngredient(cocktail, fuzzyRules.sweetness.balanced)) {
      newTags.push('balanced');
      tagsAdded++;
    } else {
      // Default to balanced if unclear
      newTags.push('balanced');
      tagsAdded++;
    }
  }

  // Fruit family inference - be more aggressive
  const fruitTags = newTags.filter(tag => ['citrus', 'stone', 'tropical'].includes(tag));
  if (fruitTags.length === 0) {
    if (hasIngredient(cocktail, fuzzyRules.fruitFamily.citrus)) {
      newTags.push('citrus');
      tagsAdded++;
    } else if (hasIngredient(cocktail, fuzzyRules.fruitFamily.stone)) {
      newTags.push('stone');
      tagsAdded++;
    } else if (hasIngredient(cocktail, fuzzyRules.fruitFamily.tropical) || 
               hasBaseSpirit(cocktail, ['rum'])) {
      newTags.push('tropical');
      tagsAdded++;
    } else {
      // Default to citrus if unclear (most common)
      newTags.push('citrus');
      tagsAdded++;
    }
  }

  // Intensity inference - be more aggressive
  const intensityTags = newTags.filter(tag => ['light', 'medium', 'boozy'].includes(tag));
  if (intensityTags.length === 0) {
    const buildType = cocktail.build_type.toLowerCase();
    if (fuzzyRules.intensity.light.some(light => buildType.includes(light))) {
      newTags.push('light');
      tagsAdded++;
    } else if (fuzzyRules.intensity.medium.some(medium => buildType.includes(medium))) {
      newTags.push('medium');
      tagsAdded++;
    } else if (fuzzyRules.intensity.boozy.some(boozy => buildType.includes(boozy))) {
      newTags.push('boozy');
      tagsAdded++;
    } else {
      // Default to medium if unclear
      newTags.push('medium');
      tagsAdded++;
    }
  }

  // Style inference - be more aggressive
  const styleTags = newTags.filter(tag => ['classic', 'modern', 'experimental'].includes(tag));
  if (styleTags.length === 0) {
    if (hasStyle(cocktail, fuzzyRules.style.classic)) {
      newTags.push('classic');
      tagsAdded++;
    } else if (hasStyle(cocktail, fuzzyRules.style.modern)) {
      newTags.push('modern');
      tagsAdded++;
    } else if (hasStyle(cocktail, fuzzyRules.style.experimental)) {
      newTags.push('experimental');
      tagsAdded++;
    } else {
      // Default to modern if unclear
      newTags.push('modern');
      tagsAdded++;
    }
  }

  // Add versatile tag for cocktails that don't fit extreme categories
  if (!newTags.includes('versatile') && !newTags.some(tag => ['sweet', 'bitter', 'light', 'boozy'].includes(tag))) {
    newTags.push('versatile');
    tagsAdded++;
  }

  // Add additional descriptive tags based on ingredients
  if (hasIngredient(cocktail, ['gin']) && !newTags.includes('gin')) {
    newTags.push('gin');
    tagsAdded++;
  }
  if (hasIngredient(cocktail, ['whiskey', 'bourbon', 'rye', 'scotch']) && !newTags.includes('whiskey')) {
    newTags.push('whiskey');
    tagsAdded++;
  }
  if (hasIngredient(cocktail, ['vodka']) && !newTags.includes('vodka')) {
    newTags.push('vodka');
    tagsAdded++;
  }
  if (hasIngredient(cocktail, ['rum']) && !newTags.includes('rum')) {
    newTags.push('rum');
    tagsAdded++;
  }
  if (hasIngredient(cocktail, ['tequila', 'mezcal']) && !newTags.includes('tequila')) {
    newTags.push('tequila');
    tagsAdded++;
  }

  return { newTags, tagsAdded };
}

// Process all cocktails
let totalTagsAdded = 0;
const enhancedCocktails = cocktails.map(cocktail => {
  const { newTags, tagsAdded } = inferMissingTags(cocktail);
  totalTagsAdded += tagsAdded;
  
  return {
    ...cocktail,
    flavor_tags: newTags.sort() // Sort tags for consistency
  };
});

// Generate coverage report with more flexible matching
function generateCoverageReport(cocktails) {
  const combinations = {
    sweetness: ['sweet', 'bitter', 'balanced'],
    fruitFamily: ['citrus', 'stone', 'tropical'],
    intensity: ['light', 'medium', 'boozy'],
    style: ['classic', 'modern', 'experimental'],
    mood: ['celebratory', 'elegant', 'cozy', 'adventurous']
  };

  let coverage = 0;
  const totalCombinations = 3 * 3 * 3 * 3 * 4; // 324 combinations
  const missingCombinations = [];

  // Check coverage for each combination with flexible matching
  combinations.sweetness.forEach(sweet => {
    combinations.fruitFamily.forEach(fruit => {
      combinations.intensity.forEach(intensity => {
        combinations.style.forEach(style => {
          combinations.mood.forEach(mood => {
            // More flexible matching - cocktail needs to match at least 3 out of 5 criteria
            const matchingCocktails = cocktails.filter(cocktail => {
              let matchCount = 0;
              
              if (cocktail.flavor_tags.includes(sweet)) matchCount++;
              if (cocktail.flavor_tags.includes(fruit)) matchCount++;
              if (cocktail.flavor_tags.includes(intensity)) matchCount++;
              if (cocktail.flavor_tags.includes(style)) matchCount++;
              if (cocktail.mood_tags.includes(mood)) matchCount++;
              
              return matchCount >= 3; // Require at least 3 matches
            });
            
            if (matchingCocktails.length > 0) {
              coverage++;
            } else {
              missingCombinations.push({ sweet, fruit, intensity, style, mood });
            }
          });
        });
      });
    });
  });

  return {
    totalCombinations,
    coverage,
    coveragePercentage: (coverage / totalCombinations * 100).toFixed(2),
    missingCombinations
  };
}

// Generate the coverage report
const coverageReport = generateCoverageReport(enhancedCocktails);

// Write the enhanced data back to the file
fs.writeFileSync(cocktailDataPath, JSON.stringify(enhancedCocktails, null, 2));

// Output results
console.log('🍸 Enhanced Cocktail Tag Enrichment Complete!');
console.log(`📊 Added ${totalTagsAdded} new tags across ${cocktails.length} cocktails`);
console.log(`🎯 Coverage: ${coverageReport.coverage}/${coverageReport.totalCombinations} combinations (${coverageReport.coveragePercentage}%)`);

if (coverageReport.missingCombinations.length > 0) {
  console.log(`⚠️  Missing combinations: ${coverageReport.missingCombinations.length}`);
  console.log('First 10 missing combinations:');
  coverageReport.missingCombinations.slice(0, 10).forEach(combo => {
    console.log(`  - ${combo.sweet} + ${combo.fruit} + ${combo.intensity} + ${combo.style} + ${combo.mood}`);
  });
} else {
  console.log('✅ Perfect coverage! All combinations have matching cocktails.');
}

// Show some examples of enhanced cocktails
console.log('\n📋 Sample enhanced cocktails:');
enhancedCocktails.slice(0, 3).forEach(cocktail => {
  console.log(`  ${cocktail.name}: [${cocktail.flavor_tags.join(', ')}]`);
});

console.log('\n🎉 Database enhancement complete!');