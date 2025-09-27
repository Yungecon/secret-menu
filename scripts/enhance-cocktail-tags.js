#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the cocktail data
const cocktailPath = path.join(__dirname, '../src/assets/data/secret_menu_mvp_cocktails.json');
const cocktails = JSON.parse(fs.readFileSync(cocktailPath, 'utf8'));

console.log(`Processing ${cocktails.length} cocktails...`);

// Enhancement rules
const enhanceCocktail = (cocktail) => {
  const ingredients = cocktail.ingredients.join(' ').toLowerCase();
  const style = cocktail.style.toLowerCase();
  const spirit = cocktail.base_spirit_category.toLowerCase();
  
  // Add sweet tags
  if (ingredients.includes('simple syrup') || 
      ingredients.includes('honey') || 
      ingredients.includes('agave') ||
      ingredients.includes('vanilla') ||
      ingredients.includes('cream') ||
      ingredients.includes('chocolate') ||
      ingredients.includes('baileys') ||
      ingredients.includes('amaretto')) {
    if (!cocktail.flavor_tags.includes('sweet')) {
      cocktail.flavor_tags.push('sweet');
    }
  }
  
  // Add bitter tags
  if (ingredients.includes('bitters') || 
      ingredients.includes('campari') || 
      ingredients.includes('aperol') ||
      ingredients.includes('amaro') ||
      ingredients.includes('fernet') ||
      spirit.includes('whiskey') ||
      spirit.includes('scotch')) {
    if (!cocktail.flavor_tags.includes('bitter')) {
      cocktail.flavor_tags.push('bitter');
    }
  }
  
  // Add balanced tags for cocktails that aren't extremely sweet or bitter
  if (!cocktail.flavor_tags.includes('sweet') && 
      !cocktail.flavor_tags.includes('bitter') &&
      !cocktail.flavor_tags.includes('balanced')) {
    cocktail.flavor_tags.push('balanced');
  }
  
  // Add stone fruit tags
  if (ingredients.includes('cherry') || 
      ingredients.includes('brandied cherry') ||
      ingredients.includes('peach') ||
      ingredients.includes('apricot') ||
      spirit.includes('brandy') ||
      spirit.includes('cognac')) {
    if (!cocktail.flavor_tags.includes('stone')) {
      cocktail.flavor_tags.push('stone');
    }
  }
  
  // Add tropical tags
  if (ingredients.includes('pineapple') || 
      ingredients.includes('coconut') ||
      ingredients.includes('mango') ||
      spirit.includes('rum') ||
      spirit.includes('cachaca')) {
    if (!cocktail.flavor_tags.includes('tropical')) {
      cocktail.flavor_tags.push('tropical');
    }
  }
  
  // Add medium tags for shaken cocktails
  if (cocktail.build_type === 'Shaken' && 
      !cocktail.flavor_tags.includes('light') &&
      !cocktail.flavor_tags.includes('boozy')) {
    if (!cocktail.flavor_tags.includes('medium')) {
      cocktail.flavor_tags.push('medium');
    }
  }
  
  // Add modern tags for contemporary styles
  if (style.includes('collins') || 
      style.includes('fizz') || 
      style.includes('mule') ||
      style.includes('spritz')) {
    if (!cocktail.flavor_tags.includes('modern')) {
      cocktail.flavor_tags.push('modern');
    }
  }
  
  // Add classic tags for traditional styles
  if (style.includes('old fashioned') || 
      style.includes('manhattan') || 
      style.includes('martini') ||
      style.includes('sour')) {
    if (!cocktail.flavor_tags.includes('classic')) {
      cocktail.flavor_tags.push('classic');
    }
  }
  
  // Add experimental tags for unique styles
  if (style.includes('smash') || 
      style.includes('daisy') ||
      cocktail.flavor_tags.includes('herbal') ||
      cocktail.flavor_tags.includes('seasonal')) {
    if (!cocktail.flavor_tags.includes('experimental')) {
      cocktail.flavor_tags.push('experimental');
    }
  }
  
  return cocktail;
};

// Process all cocktails
let enhancedCount = 0;
const enhancedCocktails = cocktails.map(cocktail => {
  const originalTagCount = cocktail.flavor_tags.length;
  const enhanced = enhanceCocktail(cocktail);
  if (enhanced.flavor_tags.length > originalTagCount) {
    enhancedCount++;
  }
  return enhanced;
});

console.log(`Enhanced ${enhancedCount} cocktails with additional tags`);

// Write back to file
fs.writeFileSync(cocktailPath, JSON.stringify(enhancedCocktails, null, 2));
console.log('Cocktail database updated successfully!');

// Print statistics
const tagStats = {};
enhancedCocktails.forEach(cocktail => {
  cocktail.flavor_tags.forEach(tag => {
    tagStats[tag] = (tagStats[tag] || 0) + 1;
  });
});

console.log('\nTag distribution:');
Object.entries(tagStats).sort((a, b) => b[1] - a[1]).forEach(([tag, count]) => {
  console.log(`  ${tag}: ${count}`);
});