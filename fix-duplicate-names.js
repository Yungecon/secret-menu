// Script to fix duplicate cocktail names by generating unique variations
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sophisticated naming variations for duplicates
const namingVariations = {
  // Seasonal variations
  seasonal: ['Spring', 'Summer', 'Autumn', 'Winter', 'Equinox', 'Solstice'],
  
  // Time-based variations
  temporal: ['Dawn', 'Dusk', 'Midnight', 'Twilight', 'Sunrise', 'Sunset'],
  
  // Elemental variations
  elemental: ['Fire', 'Water', 'Earth', 'Air', 'Storm', 'Thunder', 'Lightning'],
  
  // Mystical variations
  mystical: ['Oracle', 'Prophet', 'Sage', 'Mystic', 'Enchanter', 'Alchemist'],
  
  // Geographical variations
  geographical: ['Parisian', 'Venetian', 'Tokyo', 'London', 'Havana', 'Manhattan'],
  
  // Royal variations
  royal: ['Crown', 'Scepter', 'Throne', 'Majesty', 'Royal', 'Imperial'],
  
  // Color variations
  color: ['Golden', 'Silver', 'Crimson', 'Azure', 'Emerald', 'Platinum'],
  
  // Size variations
  size: ['Grand', 'Petite', 'Supreme', 'Elegant', 'Refined', 'Exquisite']
};

function generateUniqueName(originalName, baseSpirit, index) {
  // Extract the base name without common prefixes
  let baseName = originalName;
  const prefixes = ['The ', 'A ', 'An '];
  
  for (const prefix of prefixes) {
    if (baseName.startsWith(prefix)) {
      baseName = baseName.substring(prefix.length);
      break;
    }
  }
  
  // Generate variations based on the cocktail's characteristics
  const variations = [];
  
  // Add seasonal variation
  const seasonal = namingVariations.seasonal[index % namingVariations.seasonal.length];
  variations.push(`${seasonal}'s ${baseName}`);
  
  // Add elemental variation
  const elemental = namingVariations.elemental[index % namingVariations.elemental.length];
  variations.push(`The ${elemental} ${baseName}`);
  
  // Add geographical variation
  const geographical = namingVariations.geographical[index % namingVariations.geographical.length];
  variations.push(`The ${geographical} ${baseName}`);
  
  // Add mystical variation
  const mystical = namingVariations.mystical[index % namingVariations.mystical.length];
  variations.push(`${mystical}'s ${baseName}`);
  
  // Add color variation
  const color = namingVariations.color[index % namingVariations.color.length];
  variations.push(`The ${color} ${baseName}`);
  
  // Add temporal variation
  const temporal = namingVariations.temporal[index % namingVariations.temporal.length];
  variations.push(`${temporal}'s ${baseName}`);
  
  // Add royal variation
  const royal = namingVariations.royal[index % namingVariations.royal.length];
  variations.push(`The ${royal} ${baseName}`);
  
  // Add size variation
  const size = namingVariations.size[index % namingVariations.size.length];
  variations.push(`The ${size} ${baseName}`);
  
  // Add base spirit variation
  const spiritVariations = {
    'vodka': 'Crystal',
    'gin': 'Juniper',
    'whiskey': 'Oak',
    'rum': 'Caribbean',
    'tequila': 'Agave',
    'cognac': 'Champagne',
    'brandy': 'Vintage',
    'mezcal': 'Smoky',
    'pisco': 'Peruvian',
    'aquavit': 'Nordic',
    'armagnac': 'Gascon',
    'shochu': 'Japanese'
  };
  
  const spiritName = spiritVariations[baseSpirit] || 'Premium';
  variations.push(`The ${spiritName} ${baseName}`);
  
  // Return the first variation that doesn't conflict
  return variations[0];
}

async function fixDuplicateNames() {
  try {
    console.log('🔧 Fixing duplicate cocktail names...\n');
    
    // Read the sophisticated cocktail library
    const libraryPath = path.join(__dirname, 'public', 'sophisticated_cocktail_library.json');
    const libraryData = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
    
    const cocktails = libraryData.cocktails;
    console.log(`📊 Processing ${cocktails.length} cocktails...\n`);
    
    // Track name usage
    const nameCounts = {};
    const nameToIndices = {};
    
    // First pass: identify duplicates
    cocktails.forEach((cocktail, index) => {
      const name = cocktail.name;
      if (nameCounts[name]) {
        nameCounts[name]++;
        nameToIndices[name].push(index);
      } else {
        nameCounts[name] = 1;
        nameToIndices[name] = [index];
      }
    });
    
    // Find duplicates
    const duplicates = Object.entries(nameCounts).filter(([name, count]) => count > 1);
    console.log(`🔍 Found ${duplicates.length} duplicate names to fix:\n`);
    
    // Fix duplicates
    let fixedCount = 0;
    const changes = [];
    
    duplicates.forEach(([duplicateName, count]) => {
      const indices = nameToIndices[duplicateName];
      console.log(`📝 Fixing "${duplicateName}" (appears ${count} times):`);
      
      // Keep the first occurrence, rename the rest
      indices.slice(1).forEach((index, i) => {
        const cocktail = cocktails[index];
        const originalName = cocktail.name;
        const newName = generateUniqueName(originalName, cocktail.base_spirit, i + 1);
        
        // Ensure the new name is unique
        let finalName = newName;
        let counter = 1;
        while (nameCounts[finalName]) {
          finalName = `${newName} ${counter}`;
          counter++;
        }
        
        // Update the cocktail
        cocktail.name = finalName;
        
        // Update tracking
        nameCounts[originalName]--;
        nameCounts[finalName] = 1;
        
        changes.push({
          index: index + 1,
          original: originalName,
          new: finalName,
          baseSpirit: cocktail.base_spirit
        });
        
        console.log(`  - Cocktail ${index + 1}: "${originalName}" → "${finalName}"`);
        fixedCount++;
      });
      console.log('');
    });
    
    // Verify no duplicates remain
    const finalNameCounts = {};
    cocktails.forEach(cocktail => {
      const name = cocktail.name;
      finalNameCounts[name] = (finalNameCounts[name] || 0) + 1;
    });
    
    const remainingDuplicates = Object.entries(finalNameCounts).filter(([name, count]) => count > 1);
    
    if (remainingDuplicates.length === 0) {
      console.log('✅ All duplicates fixed! No remaining duplicates found.\n');
    } else {
      console.log(`⚠️  ${remainingDuplicates.length} duplicates still remain:\n`);
      remainingDuplicates.forEach(([name, count]) => {
        console.log(`  - "${name}" (${count} times)`);
      });
    }
    
    // Save the updated library
    const updatedLibrary = {
      ...libraryData,
      cocktails: cocktails
    };
    
    // Create backup
    const backupPath = path.join(__dirname, 'public', 'sophisticated_cocktail_library_backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(libraryData, null, 2));
    console.log(`💾 Backup created: ${backupPath}`);
    
    // Save updated library
    fs.writeFileSync(libraryPath, JSON.stringify(updatedLibrary, null, 2));
    console.log(`💾 Updated library saved: ${libraryPath}`);
    
    // Summary
    console.log('\n🎯 Summary:');
    console.log('============');
    console.log(`✅ Fixed ${fixedCount} duplicate names`);
    console.log(`📊 Total cocktails: ${cocktails.length}`);
    console.log(`🔢 Unique names: ${Object.keys(finalNameCounts).length}`);
    console.log(`📈 Uniqueness rate: ${Math.round((Object.keys(finalNameCounts).length / cocktails.length) * 100)}%`);
    
    // Show some examples of changes
    if (changes.length > 0) {
      console.log('\n📋 Example Changes:');
      console.log('===================');
      changes.slice(0, 10).forEach(change => {
        console.log(`- "${change.original}" → "${change.new}" (${change.baseSpirit})`);
      });
      if (changes.length > 10) {
        console.log(`... and ${changes.length - 10} more changes`);
      }
    }
    
    console.log('\n🎉 Duplicate names fixed successfully!');
    console.log('💡 Your cocktail library now has completely unique names.');
    
  } catch (error) {
    console.error('❌ Error fixing duplicates:', error.message);
  }
}

// Run the fix
fixDuplicateNames();
