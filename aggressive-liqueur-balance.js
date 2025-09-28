// Aggressive script to properly balance liqueur distribution
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Stone fruit liqueurs
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

// Target distribution - much more balanced
const targetDistribution = {
  // Stone fruits (high priority)
  "peach-liqueur": 30,
  "apricot-liqueur": 30,
  "cherry-liqueur": 30,
  "nectarine-liqueur": 25,
  "mango-liqueur": 25,
  "lychee-liqueur": 20,
  "rambutan-liqueur": 15,
  "durian-liqueur": 10,
  
  // Existing liqueurs (reduced)
  "passion-fruit-liqueur": 15,
  "sake": 15,
  "benedictine": 15,
  "kahlua": 15,
  "midori": 15,
  "rose-liqueur": 15,
  "chartreuse": 15,
  "campari": 15,
  "aperol": 15,
  "plum-wine": 10,
  "baileys": 10,
  "st-germain": 10,
  "grand-marnier": 10,
  "cointreau": 10,
  "coconut-liqueur": 10,
  "chambord": 10,
  "hibiscus-liqueur": 10
};

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

function getWeightedRandomLiqueur() {
  const totalWeight = Object.values(targetDistribution).reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const [liqueur, weight] of Object.entries(targetDistribution)) {
    random -= weight;
    if (random <= 0) {
      return liqueur;
    }
  }
  
  return "peach-liqueur"; // fallback
}

async function aggressiveLiqueurBalance() {
  try {
    console.log('🍑 Aggressively balancing liqueur distribution...\n');
    
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
        const target = targetDistribution[liqueur] || 0;
        const status = count <= target ? '✅' : '❌';
        console.log(`  ${status} ${liqueur}: ${count} (target: ${target})`);
      });
    
    // Track changes
    const changes = [];
    const newCounts = {};
    
    // Initialize new counts
    Object.keys(targetDistribution).forEach(liqueur => {
      newCounts[liqueur] = 0;
    });
    
    // Process each cocktail
    cocktails.forEach((cocktail, cocktailIndex) => {
      const newLiqueurs = [];
      
      // For each cocktail, assign liqueurs based on target distribution
      cocktail.modifying_liqueurs.forEach((liqueur, liqueurIndex) => {
        // Check if we can keep this liqueur
        const currentCount = newCounts[liqueur] || 0;
        const targetCount = targetDistribution[liqueur] || 0;
        
        if (currentCount < targetCount) {
          // Keep this liqueur
          newLiqueurs.push(liqueur);
          newCounts[liqueur] = (newCounts[liqueur] || 0) + 1;
        } else {
          // Replace with a weighted random liqueur
          const replacement = getWeightedRandomLiqueur();
          newLiqueurs.push(replacement);
          newCounts[replacement] = (newCounts[replacement] || 0) + 1;
          
          changes.push({
            cocktail: cocktail.name,
            original: liqueur,
            replacement: replacement
          });
        }
      });
      
      // If we removed all liqueurs, add a stone fruit one
      if (newLiqueurs.length === 0) {
        const newLiqueur = getWeightedRandomLiqueur();
        newLiqueurs.push(newLiqueur);
        newCounts[newLiqueur] = (newCounts[newLiqueur] || 0) + 1;
        
        changes.push({
          cocktail: cocktail.name,
          original: "none",
          replacement: newLiqueur
        });
      }
      
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
    const backupPath = path.join(__dirname, 'public', 'sophisticated_cocktail_library_backup5.json');
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
        const target = targetDistribution[liqueur] || 0;
        const status = count <= target ? '✅' : '❌';
        console.log(`  ${status} ${liqueur}: ${count}/${target}`);
      });
    
    // Count stone fruit usage
    const stoneFruitCount = Object.entries(newCounts)
      .filter(([liqueur]) => stoneFruitLiqueurs.includes(liqueur))
      .reduce((sum, [, count]) => sum + count, 0);
    
    console.log('\n🎯 Summary:');
    console.log('============');
    console.log(`✅ Made ${changes.length} liqueur replacements`);
    console.log(`🍑 Total stone fruit liqueur usage: ${stoneFruitCount} cocktails`);
    console.log(`📊 Balanced distribution across ${Object.keys(targetDistribution).length} liqueur types`);
    
    console.log('\n🍑 Stone Fruit Distribution:');
    stoneFruitLiqueurs.forEach(liqueur => {
      const count = newCounts[liqueur] || 0;
      const target = targetDistribution[liqueur] || 0;
      const status = count <= target ? '✅' : '❌';
      console.log(`  ${status} ${getLiqueurName(liqueur)}: ${count}/${target}`);
    });
    
    console.log('\n📋 Sample Changes:');
    changes.slice(0, 15).forEach(change => {
      console.log(`  - "${change.cocktail}": ${change.original} → ${change.replacement}`);
    });
    
  } catch (error) {
    console.error('❌ Error balancing liqueur distribution:', error.message);
  }
}

// Run the balancer
aggressiveLiqueurBalance();
