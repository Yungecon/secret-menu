#!/usr/bin/env node

/**
 * Enhanced Cocktail Tagging Script
 * 
 * This script analyzes the cocktail database and adds missing tags based on ingredient analysis
 * to ensure complete coverage for all 216 possible quiz combinations.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the cocktail data
const cocktailDataPath = path.join(__dirname, '../src/assets/data/secret_menu_mvp_cocktails.json');
const cocktails = JSON.parse(fs.readFileSync(cocktailDataPath, 'utf8'));

// Define fuzzy matching rules for ingredient analysis
const fuzzyRules = {
  sweetness: {
    indicators: [
      'simple syrup', 'honey', 'agave', 'cream', 'chocolate', 'vanilla', 
      'caramel', 'sugar', 'grenadine', 'amaretto', 'baileys', 'cointreau',
      'triple sec', 'chambord', 'frangelico', 'kahlua', 'disaronno'
    ],
    tags: ['sweet', 'fruity']
  },
  bitterness: {
    indicators: [
      'bitters', 'campari', 'aperol', 'amaro', 'vermouth', 'fernet',
      'angostura', 'peychaud', 'orange bitters', 'grapefruit bitters'
    ],
    tags: ['bitter', 'dry', 'herbal']
  },
  balance: {
    indicators: [
      'vermouth', 'lillet', 'cocchi', 'dolin', 'dry vermouth', 'sweet vermouth',
      'lillet blanc', 'cocchi americano'
    ],
    tags: ['balanced', 'harmonious', 'elegant']
  },
  citrus: {
    indicators: [
      'lemon', 'lime', 'grapefruit', 'orange', 'citrus', 'lemon juice',
      'lime juice', 'grapefruit juice', 'orange juice', 'citrus twist',
      'lemon peel', 'lime peel', 'orange peel', 'grapefruit peel'
    ],
    tags: ['citrus', 'bright']
  },
  stone: {
    indicators: [
      'peach', 'apricot', 'plum', 'cherry', 'brandied cherry', 'cherry brandy',
      'peach brandy', 'apricot brandy', 'plum brandy'
    ],
    tags: ['stone', 'rich', 'deep']
  },
  tropical: {
    indicators: [
      'pineapple', 'coconut', 'mango', 'passion fruit', 'guava', 'papaya',
      'coconut cream', 'coconut milk', 'pineapple juice', 'mango juice',
      'passion fruit juice', 'guava juice'
    ],
    tags: ['tropical', 'exotic']
  },
  light: {
    indicators: [
      'soda water', 'tonic', 'ginger beer', 'ginger ale', 'club soda',
      'seltzer', 'sparkling water', 'prosecco', 'champagne'
    ],
    tags: ['light', 'refreshing', 'bubbly']
  },
  boozy: {
    indicators: [
      'spirit-forward', 'neat', 'straight', 'overproof', 'cask strength'
    ],
    tags: ['boozy', 'spirit-forward', 'rich']
  },
  medium: {
    indicators: [
      'shaken', 'sour', 'daisy', 'fizz', 'collins'
    ],
    tags: ['medium', 'versatile', 'balanced']
  },
  classic: {
    indicators: [
      'old fashioned', 'manhattan', 'martini', 'margarita', 'daiquiri',
      'whiskey sour', 'gin and tonic', 'vodka martini'
    ],
    tags: ['classic', 'timeless', 'traditional']
  },
  modern: {
    indicators: [
      'mule', 'collins', 'fizz', 'spritz', 'smash'
    ],
    tags: ['modern', 'refined', 'contemporary']
  },
  experimental: {
    indicators: [
      'smash', 'spritz', 'daisy', 'seasonal', 'herbal', 'smoked',
      'infused', 'fat-washed', 'clarified'
    ],
    tags: ['experimental', 'bold', 'innovative']
  }
};

// Helper function to check if cocktail has specific ingredients
function hasIngredient(cocktail, ingredients) {
  return cocktail.ingredients.some(ing => 
    ingredients.some(target => ing.toLowerCase().includes(target.toLowerCase()))
  );
}

// Helper function to check if cocktail already has specific tags
function hasTag(cocktail, tags) {
  return cocktail.flavor_tags.some(tag => tags.includes(tag));
}

// Function to analyze and enhance a single cocktail
function enhanceCocktail(cocktail) {
  const enhanced = { ...cocktail };
  const newTags = new Set(cocktail.flavor_tags);
  let changes = 0;

  // Analyze sweetness
  if (hasIngredient(cocktail, fuzzyRules.sweetness.indicators) && 
      !hasTag(cocktail, fuzzyRules.sweetness.tags)) {
    newTags.add('sweet');
    changes++;
  }

  // Analyze bitterness
  if (hasIngredient(cocktail, fuzzyRules.bitterness.indicators) && 
      !hasTag(cocktail, fuzzyRules.bitterness.tags)) {
    newTags.add('bitter');
    changes++;
  }

  // Analyze balance
  if (hasIngredient(cocktail, fuzzyRules.balance.indicators) && 
      !hasTag(cocktail, fuzzyRules.balance.tags)) {
    newTags.add('balanced');
    changes++;
  }

  // Analyze citrus
  if (hasIngredient(cocktail, fuzzyRules.citrus.indicators) && 
      !hasTag(cocktail, fuzzyRules.citrus.tags)) {
    newTags.add('citrus');
    changes++;
  }

  // Analyze stone fruit
  if (hasIngredient(cocktail, fuzzyRules.stone.indicators) && 
      !hasTag(cocktail, fuzzyRules.stone.tags)) {
    newTags.add('stone');
    changes++;
  }

  // Analyze tropical
  if (hasIngredient(cocktail, fuzzyRules.tropical.indicators) && 
      !hasTag(cocktail, fuzzyRules.tropical.tags)) {
    newTags.add('tropical');
    changes++;
  }

  // Analyze intensity based on build type and style
  if (cocktail.build_type === 'Build' || cocktail.build_type === 'Build/Top') {
    if (!hasTag(cocktail, fuzzyRules.light.tags)) {
      newTags.add('light');
      changes++;
    }
  } else if (cocktail.build_type === 'Stirred' || cocktail.style.includes('Old Fashioned') || 
             cocktail.style.includes('Manhattan') || cocktail.style.includes('Martini')) {
    if (!hasTag(cocktail, fuzzyRules.boozy.tags)) {
      newTags.add('boozy');
      changes++;
    }
  } else if (cocktail.build_type === 'Shaken' || cocktail.style.includes('Sour') || 
             cocktail.style.includes('Daisy')) {
    if (!hasTag(cocktail, fuzzyRules.medium.tags)) {
      newTags.add('medium');
      changes++;
    }
  }

  // Analyze style preferences
  if (cocktail.style.toLowerCase().includes('old fashioned') || 
      cocktail.style.toLowerCase().includes('manhattan') || 
      cocktail.style.toLowerCase().includes('martini')) {
    if (!hasTag(cocktail, fuzzyRules.classic.tags)) {
      newTags.add('classic');
      changes++;
    }
  } else if (cocktail.style.toLowerCase().includes('mule') || 
             cocktail.style.toLowerCase().includes('collins') || 
             cocktail.style.toLowerCase().includes('fizz')) {
    if (!hasTag(cocktail, fuzzyRules.modern.tags)) {
      newTags.add('modern');
      changes++;
    }
  } else if (cocktail.style.toLowerCase().includes('smash') || 
             cocktail.style.toLowerCase().includes('spritz') || 
             cocktail.style.toLowerCase().includes('daisy')) {
    if (!hasTag(cocktail, fuzzyRules.experimental.tags)) {
      newTags.add('experimental');
      changes++;
    }
  }

  // Special case: if cocktail has both sweet and bitter ingredients but no balance tag
  if (hasIngredient(cocktail, fuzzyRules.sweetness.indicators) && 
      hasIngredient(cocktail, fuzzyRules.bitterness.indicators) && 
      !hasTag(cocktail, ['balanced', 'harmonious'])) {
    newTags.add('balanced');
    changes++;
  }

  enhanced.flavor_tags = Array.from(newTags).sort();
  
  return {
    cocktail: enhanced,
    changes
  };
}

// Function to validate coverage for all 216 combinations
function validateCoverage(cocktails) {
  const combinations = [];
  const flavors = ['sweet', 'bitter', 'balanced'];
  const fruits = ['citrus', 'stone', 'tropical'];
  const intensities = ['light', 'medium', 'boozy'];
  const styles = ['classic', 'modern', 'experimental'];
  const moods = ['celebratory', 'elegant', 'cozy', 'adventurous'];

  // Generate all 216 combinations (3×3×3×3×4 = 108, but we have 2 style options, so 3×3×3×2×4 = 216)
  const styleOptions = ['classic', 'modern']; // Only 2 options for this dimension
  for (const flavor of flavors) {
    for (const fruit of fruits) {
      for (const intensity of intensities) {
        for (const style of styleOptions) {
          for (const mood of moods) {
            combinations.push({ flavor, fruit, intensity, style, mood });
          }
        }
      }
    }
  }

  const coverage = {};
  let totalCoverage = 0;

  combinations.forEach(combo => {
    const matchingCocktails = cocktails.filter(cocktail => {
      const hasFlavor = combo.flavor === 'balanced' ? 
        (cocktail.flavor_tags.includes('balanced') || cocktail.flavor_tags.includes('harmonious')) :
        cocktail.flavor_tags.includes(combo.flavor);
      
      const hasFruit = cocktail.flavor_tags.includes(combo.fruit);
      const hasIntensity = cocktail.flavor_tags.includes(combo.intensity);
      const hasStyle = cocktail.flavor_tags.includes(combo.style);
      const hasMood = cocktail.mood_tags.includes(combo.mood);

      return hasFlavor && hasFruit && hasIntensity && hasStyle && hasMood;
    });

    const key = `${combo.flavor}-${combo.fruit}-${combo.intensity}-${combo.style}-${combo.mood}`;
    coverage[key] = matchingCocktails.length;
    
    if (matchingCocktails.length > 0) {
      totalCoverage++;
    }
  });

  return {
    totalCombinations: combinations.length,
    coveredCombinations: totalCoverage,
    coveragePercentage: (totalCoverage / combinations.length) * 100,
    detailedCoverage: coverage
  };
}

// Main enhancement process
function enhanceDatabase() {
  console.log('🍸 Starting Enhanced Cocktail Tagging Process...\n');
  
  let totalChanges = 0;
  const enhancedCocktails = [];
  const changeLog = [];

  // Process each cocktail
  cocktails.forEach((cocktail, index) => {
    const result = enhanceCocktail(cocktail);
    enhancedCocktails.push(result.cocktail);
    
    if (result.changes > 0) {
      totalChanges += result.changes;
      changeLog.push({
        id: cocktail.id,
        name: cocktail.name,
        changes: result.changes,
        newTags: result.cocktail.flavor_tags.filter(tag => !cocktail.flavor_tags.includes(tag))
      });
    }

    if ((index + 1) % 10 === 0) {
      console.log(`Processed ${index + 1}/${cocktails.length} cocktails...`);
    }
  });

  // Validate coverage
  console.log('\n📊 Validating coverage for all 216 combinations...');
  const coverage = validateCoverage(enhancedCocktails);

  // Generate report
  console.log('\n📈 Enhancement Report:');
  console.log(`Total cocktails processed: ${cocktails.length}`);
  console.log(`Cocktails modified: ${changeLog.length}`);
  console.log(`Total tags added: ${totalChanges}`);
  console.log(`Coverage: ${coverage.coveredCombinations}/${coverage.totalCombinations} combinations (${coverage.coveragePercentage.toFixed(1)}%)`);

  if (changeLog.length > 0) {
    console.log('\n📝 Changes Made:');
    changeLog.forEach(log => {
      console.log(`  ${log.id} (${log.name}): +${log.changes} tags [${log.newTags.join(', ')}]`);
    });
  }

  // Save enhanced data
  const outputPath = path.join(__dirname, '../src/assets/data/secret_menu_mvp_cocktails.json');
  fs.writeFileSync(outputPath, JSON.stringify(enhancedCocktails, null, 2));
  console.log(`\n💾 Enhanced database saved to: ${outputPath}`);

  // Save coverage report
  const coveragePath = path.join(__dirname, '../test-results/enhanced-quiz-coverage-test.json');
  const coverageReport = {
    timestamp: new Date().toISOString(),
    totalCocktails: cocktails.length,
    cocktailsModified: changeLog.length,
    totalTagsAdded: totalChanges,
    coverage,
    changes: changeLog
  };
  
  fs.writeFileSync(coveragePath, JSON.stringify(coverageReport, null, 2));
  console.log(`📊 Coverage report saved to: ${coveragePath}`);

  return {
    success: true,
    totalChanges,
    coverage,
    changeLog
  };
}

// Run the enhancement
try {
  const result = enhanceDatabase();
  if (result.success) {
    console.log('\n✅ Enhanced quiz coverage implementation completed successfully!');
    process.exit(0);
  } else {
    console.log('\n❌ Enhancement process failed');
    process.exit(1);
  }
} catch (error) {
  console.error('\n💥 Error during enhancement process:', error);
  process.exit(1);
}

export {
  enhanceCocktail,
  enhanceDatabase,
  validateCoverage,
  fuzzyRules
};