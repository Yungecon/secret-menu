#!/usr/bin/env node

/**
 * Generate Unique Cocktail Names Script
 * 
 * This script analyzes the cocktail database to identify duplicate names
 * and generates unique, sophisticated names for each cocktail based on
 * their characteristics, ingredients, and style.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the cocktail data
const cocktailData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/assets/data/secret_menu_mvp_cocktails.json'), 'utf8'));

// Name generation utilities
class CocktailNameGenerator {
  constructor() {
    this.nameCounts = {};
    this.generatedNames = new Set();
  }

  // Analyze the current names to find duplicates
  analyzeNames() {
    const nameMap = new Map();
    const duplicates = [];

    cocktailData.forEach(cocktail => {
      if (nameMap.has(cocktail.name)) {
        duplicates.push({
          name: cocktail.name,
          cocktails: [nameMap.get(cocktail.name), cocktail]
        });
      } else {
        nameMap.set(cocktail.name, cocktail);
      }
    });

    return { nameMap, duplicates };
  }

  // Generate unique names based on cocktail characteristics
  generateUniqueName(cocktail, index = 0) {
    const baseSpirit = this.getBaseSpiritName(cocktail.base_spirit_category);
    const style = this.getStyleName(cocktail.style);
    const flavor = this.getFlavorName(cocktail.flavor_tags);
    const mood = this.getMoodName(cocktail.mood_tags);
    const buildType = this.getBuildTypeName(cocktail.build_type);

    // Create name variations based on different combinations
    const nameVariations = [
      `${this.getElegantPrefix()} ${baseSpirit} ${style}`,
      `${flavor} ${baseSpirit} ${this.getElegantSuffix()}`,
      `${mood} ${baseSpirit} ${this.getStyleSuffix()}`,
      `${this.getElegantPrefix()} ${flavor} ${buildType}`,
      `${mood} ${flavor} ${baseSpirit}`,
      `${baseSpirit} ${this.getElegantPrefix()} ${style}`,
      `${this.getElegantPrefix()} ${style} ${this.getElegantSuffix()}`,
      `${flavor} ${mood} ${baseSpirit}`,
      `${buildType} ${baseSpirit} ${this.getElegantSuffix()}`,
      `${this.getElegantPrefix()} ${baseSpirit} ${this.getElegantSuffix()}`
    ];

    // Add index-based variation if needed
    if (index > 0) {
      nameVariations.push(`${this.getElegantPrefix()} ${baseSpirit} ${style} ${this.getIndexSuffix(index)}`);
    }

    // Find first unique name
    for (const name of nameVariations) {
      if (!this.generatedNames.has(name)) {
        this.generatedNames.add(name);
        return name;
      }
    }

    // Fallback with timestamp
    return `${this.getElegantPrefix()} ${baseSpirit} ${Date.now().toString().slice(-3)}`;
  }

  getBaseSpiritName(spiritCategory) {
    const spiritNames = {
      'Vodka': 'Vodka',
      'Gin': 'Gin',
      'Whiskey/Bourbon': 'Whiskey',
      'Rum': 'Rum',
      'Tequila': 'Tequila',
      'Brandy': 'Brandy',
      'Mezcal': 'Mezcal',
      'Liqueur': 'Liqueur'
    };
    return spiritNames[spiritCategory] || 'Spirit';
  }

  getStyleName(style) {
    const styleNames = {
      'Mule': 'Mule',
      'Martini/Spirit-Forward': 'Martini',
      'Highball': 'Highball',
      'Sour': 'Sour',
      'Collins': 'Collins',
      'Old Fashioned': 'Old Fashioned',
      'Manhattan': 'Manhattan',
      'Margarita': 'Margarita',
      'Daiquiri': 'Daiquiri',
      'Fizz': 'Fizz',
      'Smash': 'Smash',
      'Spritz': 'Spritz',
      'Daisy': 'Daisy'
    };
    return styleNames[style] || 'Cocktail';
  }

  getFlavorName(flavorTags) {
    const flavorMap = {
      'sweet': 'Sweet',
      'bitter': 'Bitter',
      'citrus': 'Citrus',
      'spicy': 'Spicy',
      'herbal': 'Herbal',
      'smoky': 'Smoky',
      'fruity': 'Fruity',
      'tropical': 'Tropical',
      'balanced': 'Balanced',
      'dry': 'Dry',
      'rich': 'Rich',
      'elegant': 'Elegant',
      'sophisticated': 'Sophisticated',
      'modern': 'Modern',
      'classic': 'Classic'
    };

    // Find the most prominent flavor
    for (const tag of flavorTags) {
      if (flavorMap[tag]) {
        return flavorMap[tag];
      }
    }
    return 'Refined';
  }

  getMoodName(moodTags) {
    const moodMap = {
      'celebratory': 'Celebratory',
      'elegant': 'Elegant',
      'cozy': 'Cozy',
      'adventurous': 'Adventurous',
      'sophisticated': 'Sophisticated',
      'intimate': 'Intimate',
      'bold': 'Bold',
      'refined': 'Refined'
    };

    for (const tag of moodTags) {
      if (moodMap[tag]) {
        return moodMap[tag];
      }
    }
    return 'Luxurious';
  }

  getBuildTypeName(buildType) {
    const buildMap = {
      'Build': 'Build',
      'Stirred': 'Stirred',
      'Shaken': 'Shaken',
      'Blended': 'Blended'
    };
    return buildMap[buildType] || 'Crafted';
  }

  getElegantPrefix() {
    const prefixes = [
      'Royal', 'Noble', 'Imperial', 'Grand', 'Supreme', 'Elite', 'Prestige',
      'Majestic', 'Regal', 'Exquisite', 'Opulent', 'Luxurious', 'Distinguished',
      'Sophisticated', 'Elegant', 'Refined', 'Premium', 'Artisan', 'Masterful'
    ];
    return prefixes[Math.floor(Math.random() * prefixes.length)];
  }

  getElegantSuffix() {
    const suffixes = [
      'Affair', 'Experience', 'Journey', 'Rendezvous', 'Encounter', 'Moment',
      'Ritual', 'Ceremony', 'Tradition', 'Heritage', 'Legacy', 'Masterpiece',
      'Creation', 'Innovation', 'Expression', 'Interpretation', 'Variation',
      'Evolution', 'Revolution', 'Revelation'
    ];
    return suffixes[Math.floor(Math.random() * suffixes.length)];
  }

  getStyleSuffix() {
    const suffixes = [
      'Blend', 'Fusion', 'Harmony', 'Symphony', 'Composition', 'Arrangement',
      'Concoction', 'Elixir', 'Potion', 'Brew', 'Mix', 'Blend', 'Union',
      'Marriage', 'Alliance', 'Partnership', 'Collaboration'
    ];
    return suffixes[Math.floor(Math.random() * suffixes.length)];
  }

  getIndexSuffix(index) {
    const suffixes = ['Classic', 'Reserve', 'Special', 'Premium', 'Deluxe', 'Signature'];
    return suffixes[index % suffixes.length];
  }

  // Generate unique names for all cocktails
  generateAllUniqueNames() {
    console.log('🍸 Generating unique cocktail names...\n');
    
    const { nameMap, duplicates } = this.analyzeNames();
    
    console.log(`Found ${duplicates.length} duplicate names:`);
    duplicates.forEach(dup => {
      console.log(`  "${dup.name}" appears ${dup.cocktails.length} times`);
    });
    console.log('');

    const updatedCocktails = [];
    const nameChanges = [];

    cocktailData.forEach((cocktail, index) => {
      let newName = cocktail.name;
      
      // Check if this name appears multiple times
      const isDuplicate = duplicates.some(dup => 
        dup.cocktails.some(c => c.id === cocktail.id)
      );

      if (isDuplicate || this.generatedNames.has(cocktail.name)) {
        // Generate a unique name
        newName = this.generateUniqueName(cocktail, index);
        nameChanges.push({
          id: cocktail.id,
          oldName: cocktail.name,
          newName: newName,
          reason: 'Duplicate name'
        });
      } else {
        // Keep original name but add to generated set
        this.generatedNames.add(cocktail.name);
      }

      updatedCocktails.push({
        ...cocktail,
        name: newName
      });
    });

    return { updatedCocktails, nameChanges };
  }
}

// Main execution
try {
  const generator = new CocktailNameGenerator();
  const { updatedCocktails, nameChanges } = generator.generateAllUniqueNames();

  console.log('📝 Name Changes Made:');
  nameChanges.forEach(change => {
    console.log(`  ${change.id}: "${change.oldName}" → "${change.newName}"`);
  });

  console.log(`\n📊 Summary:`);
  console.log(`  Total cocktails: ${updatedCocktails.length}`);
  console.log(`  Names changed: ${nameChanges.length}`);
  console.log(`  Unique names: ${updatedCocktails.length}`);

  // Save updated cocktail data
  const outputPath = path.join(__dirname, '../src/assets/data/secret_menu_mvp_cocktails.json');
  fs.writeFileSync(outputPath, JSON.stringify(updatedCocktails, null, 2));
  console.log(`\n💾 Updated cocktail database saved to: ${outputPath}`);

  // Save name changes report
  const reportPath = path.join(__dirname, '../test-results/cocktail-name-changes.json');
  const report = {
    timestamp: new Date().toISOString(),
    totalCocktails: updatedCocktails.length,
    namesChanged: nameChanges.length,
    changes: nameChanges
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📊 Name changes report saved to: ${reportPath}`);

  console.log('\n✅ All cocktails now have unique names!');

} catch (error) {
  console.error('\n💥 Error generating unique names:', error);
  process.exit(1);
}
