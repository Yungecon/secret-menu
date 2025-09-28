// Script to fix liqueur overuse by replacing excess occurrences with stone fruit liqueurs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Stone fruit liqueurs to replace overused ones
const stoneFruitLiqueurs = [
  "peach-liqueur",
  "apricot-liqueur", 
  "cherry-liqueur",
  "nectarine-liqueur",
  "mango-liqueur",
  "lychee-liqueur",
  "rambutan-liqueur",
  "durian-liqueur"
];

// Target max counts for overused liqueurs
const maxCounts = {
  "plum-wine": 15,
  "passion-fruit-liqueur": 20,
  "sake": 20,
  "benedictine": 20,
  "kahlua": 20,
  "midori": 20,
  "rose-liqueur": 20,
  "chartreuse": 20,
  "campari": 20,
  "aperol": 20,
  "baileys": 15,
  "st-germain": 15,
  "grand-marnier": 15,
  "cointreau": 15,
  "coconut-liqueur": 15,
  "chambord": 15,
  "hibiscus-liqueur": 15
};

function getRandomStoneFruitLiqueur() {
  return stoneFruitLiqueurs[Math.floor(Math.random() * stoneFruitLiqueurs.length)];
}

function getLiqueurName(liqueurId) {
  const names = {
    "peach-liqueur": "Peach Liqueur",
    "apricot-liqueur": "Apricot Liqueur",
    "cherry-liqueur": "Cherry Liqueur", 
    "nectarine-liqueur": "Nectarine Liqueur",
    "mango-liqueur": "Mango Liqueur",
    "lychee-liqueur": "Lychee Liqueur",
    "rambutan-liqueur": "Rambutan Liqueur",
    "durian-liqueur": "Durian Liqueur"
  };
  return names[liqueurId] || liqueurId;
}

async function fixLiqueurOveruse() {
  try {
    console.log('🍑 Fixing liqueur overuse with stone fruit variety...\n');
    
    // Read the library
    const libraryPath = path.join(__dirname, 'public', 'sophisticated_cocktail_library.json');
    const libraryData = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
    
    const cocktails = libraryData.cocktails;
    console.log(`📊 Processing ${cocktails.length} cocktails...\n`);
    
    // Count current distribution
    const currentCounts = {};
    cocktails.forEach(cocktail => {
      cocktail.modifying_liqueurs.forEach(liqueur => {
        currentCounts[liqueur] = (currentCounts[liqueur] || 0) + 1;
      });
    });
    
    console.log('📈 Current Distribution:');
    Object.entries(currentCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([liqueur, count]) => {
        const maxCount = maxCounts[liqueur] || 999;
        const status = count > maxCount ? '❌' : '✅';
        console.log(`  ${status} ${liqueur}: ${count} (max: ${maxCount})`);
      });
    
    // Track changes
    const changes = [];
    const newCounts = { ...currentCounts };
    
    // Process each cocktail and replace overused liqueurs
    cocktails.forEach((cocktail, cocktailIndex) => {
      const newLiqueurs = [];
      
      cocktail.modifying_liqueurs.forEach(liqueur => {
        const currentCount = newCounts[liqueur] || 0;
        const maxCount = maxCounts[liqueur] || 999;
        
        if (currentCount >= maxCount) {
          // Replace with stone fruit liqueur
          const replacement = getRandomStoneFruitLiqueur();
          newLiqueurs.push(replacement);
          newCounts[replacement] = (newCounts[replacement] || 0) + 1;
          newCounts[liqueur] = Math.max(0, newCounts[liqueur] - 1);
          
          changes.push({
            cocktail: cocktail.name,
            original: liqueur,
            replacement: replacement
          });
        } else {
          // Keep the liqueur
          newLiqueurs.push(liqueur);
        }
      });
      
      cocktail.modifying_liqueurs = newLiqueurs;
      
      // Update ingredient details for any new stone fruit liqueurs
      cocktail.ingredients.forEach(ingredient => {
        if (ingredient.id && stoneFruitLiqueurs.includes(ingredient.id)) {
          ingredient.name = getLiqueurName(ingredient.id);
          ingredient.notes = `${getLiqueurName(ingredient.id)} for complexity`;
        }
      });
    });
    
    // Save the updated library
    const updatedLibrary = {
      ...libraryData,
      cocktails: cocktails
    };
    
    // Create backup
    const backupPath = path.join(__dirname, 'public', 'sophisticated_cocktail_library_backup4.json');
    fs.writeFileSync(backupPath, JSON.stringify(libraryData, null, 2));
    console.log(`\n💾 Backup created: ${backupPath}`);
    
    // Save updated library
    fs.writeFileSync(libraryPath, JSON.stringify(updatedLibrary, null, 2));
    console.log(`💾 Updated library saved: ${libraryPath}`);
    
    // Show final distribution
    console.log('\n📊 Final Distribution:');
    Object.entries(newCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([liqueur, count]) => {
        const maxCount = maxCounts[liqueur] || 999;
        const status = count <= maxCount ? '✅' : '❌';
        console.log(`  ${status} ${liqueur}: ${count} (max: ${maxCount})`);
      });
    
    console.log('\n🎯 Summary:');
    console.log('============');
    console.log(`✅ Made ${changes.length} liqueur replacements`);
    console.log(`🍑 Added ${stoneFruitLiqueurs.length} stone fruit liqueur types`);
    
    // Count stone fruit usage
    const stoneFruitCount = Object.entries(newCounts)
      .filter(([liqueur]) => stoneFruitLiqueurs.includes(liqueur))
      .reduce((sum, [, count]) => sum + count, 0);
    
    console.log(`🍑 Total stone fruit liqueur usage: ${stoneFruitCount} cocktails`);
    
    console.log('\n🍑 Stone Fruit Liqueurs Added:');
    stoneFruitLiqueurs.forEach(liqueur => {
      const count = newCounts[liqueur] || 0;
      console.log(`  - ${getLiqueurName(liqueur)}: ${count} cocktails`);
    });
    
    console.log('\n📋 Sample Changes:');
    changes.slice(0, 15).forEach(change => {
      console.log(`  - "${change.cocktail}": ${change.original} → ${change.replacement}`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing liqueur overuse:', error.message);
  }
}

// Run the fixer
fixLiqueurOveruse();
