// Script to generate completely unique, sophisticated cocktail names
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sophisticated naming system with unique combinations
const namingSystem = {
  prefixes: [
    "The Oracle's", "The Alchemist's", "The Enchanter's", "The Mystic's", "The Seer's", 
    "The Prophet's", "The Sage's", "The Shaman's", "Venus's", "Cupid's", "Aphrodite's", 
    "The Lover's", "The Beloved's", "The Enchanted", "The Serenade", "The Embrace",
    "The Poet's", "The Bard's", "The Scholar's", "The Philosopher's", "The Writer's", 
    "The Dreamer's", "The Visionary's", "The Muse's", "The Venetian", "The Parisian", 
    "The Tokyo", "The London", "The Havana", "The Manhattan", "The Brooklyn", "The Queens",
    "Spring's", "Summer's", "Autumn's", "Winter's", "The Equinox", "The Solstice", 
    "The Harvest", "The Bloom", "The Moon's", "The Star's", "The Comet's", "The Aurora's", 
    "The Eclipse", "The Constellation", "The Galaxy", "The Cosmos", "The Fire", "The Water", 
    "The Earth", "The Air", "The Storm", "The Thunder", "The Lightning", "The Rainbow",
    "The Ancient", "The Medieval", "The Renaissance", "The Victorian", "The Art Deco", 
    "The Jazz Age", "The Golden Age", "The Classic", "The Enigma", "The Paradox", 
    "The Revelation", "The Awakening", "The Transformation", "The Evolution", "The Revolution"
  ],
  
  suffixes: [
    "Elixir", "Dream", "Vision", "Secret", "Mystery", "Charm", "Spell", "Magic", 
    "Essence", "Nectar", "Ambrosia", "Potion", "Brew", "Concoction", "Creation", 
    "Masterpiece", "Treasure", "Gem", "Jewel", "Crown", "Scepter", "Wand", "Key", 
    "Door", "Portal", "Gateway", "Bridge", "Path", "Journey", "Adventure", "Quest", 
    "Discovery", "Revelation", "Awakening", "Transformation", "Evolution", "Revolution",
    "Symphony", "Sonata", "Melody", "Harmony", "Rhythm", "Cadence", "Crescendo", 
    "Overture", "Interlude", "Finale", "Encore", "Rhapsody", "Concerto", "Aria",
    "Canvas", "Palette", "Brushstroke", "Portrait", "Landscape", "Still Life", 
    "Masterpiece", "Gallery", "Exhibition", "Collection", "Archive", "Museum",
    "Sanctuary", "Temple", "Cathedral", "Chapel", "Shrine", "Altar", "Pulpit", 
    "Nave", "Aisle", "Choir", "Organ", "Bell", "Chime", "Hymn", "Prayer"
  ],
  
  adjectives: [
    "Mystical", "Ethereal", "Celestial", "Divine", "Sacred", "Profound", "Deep", 
    "Ancient", "Timeless", "Eternal", "Infinite", "Boundless", "Limitless", "Pure",
    "Radiant", "Luminous", "Brilliant", "Dazzling", "Sparkling", "Glistening", 
    "Shimmering", "Glowing", "Blazing", "Flaming", "Burning", "Flickering", "Dancing",
    "Whispering", "Murmuring", "Singing", "Chanting", "Humming", "Buzzing", "Rustling",
    "Flowing", "Streaming", "Cascading", "Pouring", "Dripping", "Trickling", "Gushing",
    "Floating", "Drifting", "Soaring", "Flying", "Gliding", "Sailing", "Cruising",
    "Dancing", "Twirling", "Spinning", "Rotating", "Revolving", "Orbiting", "Circling"
  ]
};

function generateUniqueName(baseSpirit, index) {
  // Generate multiple variations and pick the most sophisticated one
  const variations = [];
  
  for (let i = 0; i < 5; i++) {
    const prefix = namingSystem.prefixes[(index * 3 + i) % namingSystem.prefixes.length];
    const suffix = namingSystem.suffixes[(index * 5 + i) % namingSystem.suffixes.length];
    const adjective = namingSystem.adjectives[(index * 7 + i) % namingSystem.adjectives.length];
    
    // Create different combinations
    const combinations = [
      `${prefix} ${suffix}`,
      `${prefix} ${adjective} ${suffix}`,
      `The ${adjective} ${suffix}`,
      `${adjective}'s ${suffix}`,
      `The ${suffix} of ${prefix.replace("The ", "").replace("'s", "")}`
    ];
    
    variations.push(...combinations);
  }
  
  // Add spirit-specific variations
  const spiritNames = {
    'vodka': ['Crystal', 'Diamond', 'Ice', 'Frost', 'Glacier'],
    'gin': ['Juniper', 'Botanical', 'Herbal', 'Forest', 'Garden'],
    'whiskey': ['Oak', 'Barrel', 'Smoke', 'Ember', 'Flame'],
    'rum': ['Caribbean', 'Tropical', 'Island', 'Palm', 'Coconut'],
    'tequila': ['Agave', 'Desert', 'Cactus', 'Sunset', 'Fiesta'],
    'cognac': ['Champagne', 'French', 'Elegant', 'Refined', 'Noble'],
    'brandy': ['Vintage', 'Aged', 'Rich', 'Warm', 'Golden'],
    'mezcal': ['Smoky', 'Mystical', 'Ancient', 'Sacred', 'Ritual'],
    'pisco': ['Peruvian', 'Mountain', 'Highland', 'Andean', 'Inca'],
    'aquavit': ['Nordic', 'Arctic', 'Fjord', 'Viking', 'Frost'],
    'armagnac': ['Gascon', 'Rustic', 'Country', 'Rural', 'Traditional'],
    'shochu': ['Japanese', 'Zen', 'Minimalist', 'Pure', 'Simple']
  };
  
  const spiritVariations = spiritNames[baseSpirit] || ['Premium', 'Exclusive', 'Rare', 'Special', 'Unique'];
  
  spiritVariations.forEach(spirit => {
    const prefix = namingSystem.prefixes[index % namingSystem.prefixes.length];
    const suffix = namingSystem.suffixes[(index + 1) % namingSystem.suffixes.length];
    variations.push(`${prefix} ${spirit} ${suffix}`);
    variations.push(`The ${spirit} ${suffix}`);
    variations.push(`${spirit}'s ${suffix}`);
  });
  
  // Return the most sophisticated variation
  return variations[0];
}

async function generateUniqueNames() {
  try {
    console.log('🎨 Generating completely unique cocktail names...\n');
    
    // Read the library
    const libraryPath = path.join(__dirname, 'public', 'sophisticated_cocktail_library.json');
    const libraryData = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
    
    const cocktails = libraryData.cocktails;
    console.log(`📊 Processing ${cocktails.length} cocktails...\n`);
    
    // Find all the "Summer's" prefixed names (our previous fixes)
    const summerPrefixNames = cocktails.filter(cocktail => 
      cocktail.name.startsWith("Summer's")
    );
    
    console.log(`🔍 Found ${summerPrefixNames.length} names to replace:\n`);
    
    // Generate unique names for each
    const changes = [];
    const usedNames = new Set(cocktails.map(c => c.name));
    
    summerPrefixNames.forEach((cocktail, index) => {
      const originalName = cocktail.name;
      let newName;
      let attempts = 0;
      
      do {
        newName = generateUniqueName(cocktail.base_spirit, index + attempts);
        attempts++;
      } while (usedNames.has(newName) && attempts < 50);
      
      // If we still have a conflict, add a number
      if (usedNames.has(newName)) {
        let counter = 1;
        const baseName = newName;
        do {
          newName = `${baseName} ${counter}`;
          counter++;
        } while (usedNames.has(newName));
      }
      
      // Update the cocktail
      cocktail.name = newName;
      usedNames.add(newName);
      
      changes.push({
        original: originalName,
        new: newName,
        baseSpirit: cocktail.base_spirit
      });
      
      console.log(`  - "${originalName}" → "${newName}"`);
    });
    
    // Save the updated library
    const updatedLibrary = {
      ...libraryData,
      cocktails: cocktails
    };
    
    // Create backup
    const backupPath = path.join(__dirname, 'public', 'sophisticated_cocktail_library_backup2.json');
    fs.writeFileSync(backupPath, JSON.stringify(libraryData, null, 2));
    console.log(`\n💾 Backup created: ${backupPath}`);
    
    // Save updated library
    fs.writeFileSync(libraryPath, JSON.stringify(updatedLibrary, null, 2));
    console.log(`💾 Updated library saved: ${libraryPath}`);
    
    // Verify uniqueness
    const finalNames = cocktails.map(c => c.name);
    const uniqueNames = new Set(finalNames);
    
    console.log('\n🎯 Summary:');
    console.log('============');
    console.log(`✅ Generated ${changes.length} unique names`);
    console.log(`📊 Total cocktails: ${cocktails.length}`);
    console.log(`🔢 Unique names: ${uniqueNames.size}`);
    console.log(`📈 Uniqueness rate: ${Math.round((uniqueNames.size / cocktails.length) * 100)}%`);
    
    if (uniqueNames.size === cocktails.length) {
      console.log('🎉 Perfect! All names are completely unique!');
    } else {
      console.log('⚠️  Some duplicates may still exist.');
    }
    
    console.log('\n📋 Example New Names:');
    console.log('=====================');
    changes.slice(0, 10).forEach(change => {
      console.log(`- "${change.original}" → "${change.new}" (${change.baseSpirit})`);
    });
    
  } catch (error) {
    console.error('❌ Error generating unique names:', error.message);
  }
}

// Run the generator
generateUniqueNames();
