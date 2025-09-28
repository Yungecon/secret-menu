// Script to balance liqueur distribution and add stone fruit variety
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// New stone fruit liqueurs to add
const newStoneFruitLiqueurs = [
  {
    id: "peach-liqueur",
    name: "Peach Liqueur",
    category: "liqueur",
    flavor_profile: {
      primary: ["peach", "stone-fruit"],
      secondary: ["sweet", "fruity"],
      tertiary: ["floral", "honey"]
    }
  },
  {
    id: "apricot-liqueur", 
    name: "Apricot Liqueur",
    category: "liqueur",
    flavor_profile: {
      primary: ["apricot", "stone-fruit"],
      secondary: ["sweet", "tart"],
      tertiary: ["floral", "honey"]
    }
  },
  {
    id: "cherry-liqueur",
    name: "Cherry Liqueur", 
    category: "liqueur",
    flavor_profile: {
      primary: ["cherry", "stone-fruit"],
      secondary: ["sweet", "tart"],
      tertiary: ["almond", "bitter"]
    }
  },
  {
    id: "nectarine-liqueur",
    name: "Nectarine Liqueur",
    category: "liqueur", 
    flavor_profile: {
      primary: ["nectarine", "stone-fruit"],
      secondary: ["sweet", "fruity"],
      tertiary: ["floral", "honey"]
    }
  },
  {
    id: "mango-liqueur",
    name: "Mango Liqueur",
    category: "liqueur",
    flavor_profile: {
      primary: ["mango", "tropical"],
      secondary: ["sweet", "fruity"],
      tertiary: ["tart", "floral"]
    }
  },
  {
    id: "lychee-liqueur",
    name: "Lychee Liqueur",
    category: "liqueur",
    flavor_profile: {
      primary: ["lychee", "tropical"],
      secondary: ["sweet", "floral"],
      tertiary: ["rose", "delicate"]
    }
  },
  {
    id: "rambutan-liqueur",
    name: "Rambutan Liqueur", 
    category: "liqueur",
    flavor_profile: {
      primary: ["rambutan", "tropical"],
      secondary: ["sweet", "fruity"],
      tertiary: ["floral", "honey"]
    }
  },
  {
    id: "durian-liqueur",
    name: "Durian Liqueur",
    category: "liqueur",
    flavor_profile: {
      primary: ["durian", "tropical"],
      secondary: ["sweet", "creamy"],
      tertiary: ["pungent", "complex"]
    }
  }
];

// Target distribution (max occurrences per liqueur)
const targetDistribution = {
  "plum-wine": 15,           // Reduce from 54 to 15
  "passion-fruit-liqueur": 20, // Reduce from 61 to 20
  "sake": 20,                 // Reduce from 60 to 20
  "benedictine": 20,          // Reduce from 60 to 20
  "kahlua": 20,               // Reduce from 58 to 20
  "midori": 20,               // Reduce from 57 to 20
  "rose-liqueur": 20,         // Reduce from 55 to 20
  "chartreuse": 20,           // Reduce from 54 to 20
  "campari": 20,              // Reduce from 52 to 20
  "aperol": 20,               // Reduce from 51 to 20
  "baileys": 15,              // Reduce from 48 to 15
  "st-germain": 15,           // Reduce from 46 to 15
  "grand-marnier": 15,        // Reduce from 46 to 15
  "cointreau": 15,            // Reduce from 46 to 15
  "coconut-liqueur": 15,      // Reduce from 46 to 15
  "chambord": 15,             // Reduce from 39 to 15
  "hibiscus-liqueur": 15,     // Reduce from 39 to 15
  // New stone fruit liqueurs
  "peach-liqueur": 25,
  "apricot-liqueur": 25,
  "cherry-liqueur": 25,
  "nectarine-liqueur": 20,
  "mango-liqueur": 20,
  "lychee-liqueur": 15,
  "rambutan-liqueur": 10,
  "durian-liqueur": 5
};

function getRandomStoneFruitLiqueur() {
  const weights = {
    "peach-liqueur": 25,
    "apricot-liqueur": 25, 
    "cherry-liqueur": 25,
    "nectarine-liqueur": 20,
    "mango-liqueur": 20,
    "lychee-liqueur": 15,
    "rambutan-liqueur": 10,
    "durian-liqueur": 5
  };
  
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const [liqueur, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) {
      return liqueur;
    }
  }
  
  return "peach-liqueur"; // fallback
}

function getRandomReplacementLiqueur(excludeLiqueurs = []) {
  const availableLiqueurs = Object.keys(targetDistribution).filter(
    liqueur => !excludeLiqueurs.includes(liqueur)
  );
  
  return availableLiqueurs[Math.floor(Math.random() * availableLiqueurs.length)];
}

async function balanceLiqueurDistribution() {
  try {
    console.log('🍑 Balancing liqueur distribution and adding stone fruit variety...\n');
    
    // Read the library
    const libraryPath = path.join(__dirname, 'public', 'sophisticated_cocktail_library.json');
    const libraryData = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
    
    const cocktails = libraryData.cocktails;
    console.log(`📊 Processing ${cocktails.length} cocktails...\n`);
    
    // Count current distribution
    const currentDistribution = {};
    cocktails.forEach(cocktail => {
      cocktail.modifying_liqueurs.forEach(liqueur => {
        currentDistribution[liqueur] = (currentDistribution[liqueur] || 0) + 1;
      });
    });
    
    console.log('📈 Current Distribution:');
    Object.entries(currentDistribution)
      .sort(([,a], [,b]) => b - a)
      .forEach(([liqueur, count]) => {
        console.log(`  ${liqueur}: ${count} cocktails`);
      });
    
    console.log('\n🎯 Target Distribution:');
    Object.entries(targetDistribution)
      .sort(([,a], [,b]) => b - a)
      .forEach(([liqueur, count]) => {
        console.log(`  ${liqueur}: ${count} cocktails`);
      });
    
    // Track changes
    const changes = [];
    const liqueurCounts = {};
    
    // Initialize counts
    Object.keys(targetDistribution).forEach(liqueur => {
      liqueurCounts[liqueur] = 0;
    });
    
    // Process each cocktail
    cocktails.forEach((cocktail, index) => {
      const newLiqueurs = [];
      
      cocktail.modifying_liqueurs.forEach(liqueur => {
        const currentCount = liqueurCounts[liqueur] || 0;
        const targetCount = targetDistribution[liqueur] || 0;
        
        if (currentCount < targetCount) {
          // Keep this liqueur
          newLiqueurs.push(liqueur);
          liqueurCounts[liqueur] = (liqueurCounts[liqueur] || 0) + 1;
        } else {
          // Replace with a stone fruit liqueur
          const replacement = getRandomStoneFruitLiqueur();
          newLiqueurs.push(replacement);
          liqueurCounts[replacement] = (liqueurCounts[replacement] || 0) + 1;
          
          changes.push({
            cocktail: cocktail.name,
            original: liqueur,
            replacement: replacement
          });
        }
      });
      
      // If we removed all liqueurs, add a stone fruit one
      if (newLiqueurs.length === 0) {
        const newLiqueur = getRandomStoneFruitLiqueur();
        newLiqueurs.push(newLiqueur);
        liqueurCounts[newLiqueur] = (liqueurCounts[newLiqueur] || 0) + 1;
        
        changes.push({
          cocktail: cocktail.name,
          original: "none",
          replacement: newLiqueur
        });
      }
      
      cocktail.modifying_liqueurs = newLiqueurs;
    });
    
    // Update ingredient details for new liqueurs
    cocktails.forEach(cocktail => {
      cocktail.ingredients.forEach(ingredient => {
        if (ingredient.id && ingredient.id.includes('liqueur')) {
          const liqueurId = ingredient.id;
          const newLiqueur = newStoneFruitLiqueurs.find(nl => nl.id === liqueurId);
          
          if (newLiqueur) {
            ingredient.name = newLiqueur.name;
            ingredient.notes = `${newLiqueur.name} for complexity`;
          }
        }
      });
    });
    
    // Save the updated library
    const updatedLibrary = {
      ...libraryData,
      cocktails: cocktails
    };
    
    // Create backup
    const backupPath = path.join(__dirname, 'public', 'sophisticated_cocktail_library_backup3.json');
    fs.writeFileSync(backupPath, JSON.stringify(libraryData, null, 2));
    console.log(`\n💾 Backup created: ${backupPath}`);
    
    // Save updated library
    fs.writeFileSync(libraryPath, JSON.stringify(updatedLibrary, null, 2));
    console.log(`💾 Updated library saved: ${libraryPath}`);
    
    // Show final distribution
    console.log('\n📊 Final Distribution:');
    Object.entries(liqueurCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([liqueur, count]) => {
        const target = targetDistribution[liqueur] || 0;
        const status = count <= target ? '✅' : '⚠️';
        console.log(`  ${status} ${liqueur}: ${count}/${target}`);
      });
    
    console.log('\n🎯 Summary:');
    console.log('============');
    console.log(`✅ Made ${changes.length} liqueur replacements`);
    console.log(`🍑 Added ${newStoneFruitLiqueurs.length} new stone fruit liqueurs`);
    console.log(`📊 Balanced distribution across ${Object.keys(targetDistribution).length} liqueur types`);
    
    console.log('\n🍑 New Stone Fruit Liqueurs Added:');
    newStoneFruitLiqueurs.forEach(liqueur => {
      console.log(`  - ${liqueur.name} (${liqueur.id})`);
    });
    
    console.log('\n📋 Sample Changes:');
    changes.slice(0, 10).forEach(change => {
      console.log(`  - "${change.cocktail}": ${change.original} → ${change.replacement}`);
    });
    
  } catch (error) {
    console.error('❌ Error balancing liqueur distribution:', error.message);
  }
}

// Run the balancer
balanceLiqueurDistribution();
