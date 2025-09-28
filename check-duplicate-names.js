// Script to check for duplicate cocktail names in the sophisticated library
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkDuplicateNames() {
  try {
    console.log('🔍 Checking for duplicate cocktail names...\n');
    
    // Read the sophisticated cocktail library
    const libraryPath = path.join(__dirname, 'public', 'sophisticated_cocktail_library.json');
    const libraryData = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
    
    const cocktails = libraryData.cocktails;
    console.log(`📊 Total cocktails in library: ${cocktails.length}\n`);
    
    // Extract all cocktail names
    const cocktailNames = cocktails.map(cocktail => cocktail.name);
    
    // Check for duplicates
    const nameCounts = {};
    const duplicates = [];
    
    cocktailNames.forEach((name, index) => {
      if (nameCounts[name]) {
        nameCounts[name].count++;
        nameCounts[name].indices.push(index);
        if (nameCounts[name].count === 2) {
          duplicates.push({
            name: name,
            count: nameCounts[name].count,
            indices: nameCounts[name].indices
          });
        }
      } else {
        nameCounts[name] = {
          count: 1,
          indices: [index]
        };
      }
    });
    
    // Report results
    console.log('📋 Duplicate Name Analysis:');
    console.log('============================');
    
    if (duplicates.length === 0) {
      console.log('✅ No duplicate names found!');
      console.log('🎉 All cocktail names are unique.');
    } else {
      console.log(`❌ Found ${duplicates.length} duplicate name(s):\n`);
      
      duplicates.forEach((duplicate, index) => {
        console.log(`${index + 1}. "${duplicate.name}"`);
        console.log(`   - Appears ${duplicate.count} times`);
        console.log(`   - At indices: ${duplicate.indices.join(', ')}`);
        
        // Show the cocktails with this name
        duplicate.indices.forEach(idx => {
          const cocktail = cocktails[idx];
          console.log(`   - Cocktail ${idx + 1}: ID="${cocktail.id}", Base="${cocktail.base_spirit}"`);
        });
        console.log('');
      });
    }
    
    // Additional analysis
    console.log('\n📊 Additional Statistics:');
    console.log('==========================');
    console.log(`- Total unique names: ${Object.keys(nameCounts).length}`);
    console.log(`- Total cocktails: ${cocktailNames.length}`);
    console.log(`- Duplicate names: ${duplicates.length}`);
    console.log(`- Uniqueness rate: ${Math.round((Object.keys(nameCounts).length / cocktailNames.length) * 100)}%`);
    
    // Check for similar names (case-insensitive)
    console.log('\n🔍 Checking for similar names (case-insensitive)...');
    const lowerCaseNames = cocktailNames.map(name => name.toLowerCase());
    const lowerCaseCounts = {};
    const similarDuplicates = [];
    
    lowerCaseNames.forEach((name, index) => {
      if (lowerCaseCounts[name]) {
        lowerCaseCounts[name].count++;
        lowerCaseCounts[name].indices.push(index);
        if (lowerCaseCounts[name].count === 2) {
          similarDuplicates.push({
            name: name,
            count: lowerCaseCounts[name].count,
            indices: lowerCaseCounts[name].indices
          });
        }
      } else {
        lowerCaseCounts[name] = {
          count: 1,
          indices: [index]
        };
      }
    });
    
    if (similarDuplicates.length === 0) {
      console.log('✅ No similar names found (case-insensitive)!');
    } else {
      console.log(`❌ Found ${similarDuplicates.length} similar name(s) (case-insensitive):\n`);
      
      similarDuplicates.forEach((duplicate, index) => {
        console.log(`${index + 1}. "${duplicate.name}"`);
        console.log(`   - Appears ${duplicate.count} times`);
        console.log(`   - At indices: ${duplicate.indices.join(', ')}`);
        
        // Show the cocktails with this name
        duplicate.indices.forEach(idx => {
          const cocktail = cocktails[idx];
          console.log(`   - Cocktail ${idx + 1}: "${cocktail.name}", ID="${cocktail.id}", Base="${cocktail.base_spirit}"`);
        });
        console.log('');
      });
    }
    
    // Summary
    console.log('\n🎯 Summary:');
    console.log('============');
    if (duplicates.length === 0 && similarDuplicates.length === 0) {
      console.log('✅ PERFECT: No duplicate or similar names found!');
      console.log('🎉 Your cocktail library has completely unique names.');
    } else {
      console.log(`⚠️  Found ${duplicates.length} exact duplicates and ${similarDuplicates.length} similar names.`);
      console.log('🔧 Consider renaming duplicates to ensure uniqueness.');
    }
    
  } catch (error) {
    console.error('❌ Error checking for duplicates:', error.message);
  }
}

// Run the check
checkDuplicateNames();
