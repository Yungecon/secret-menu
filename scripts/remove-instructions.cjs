const fs = require('fs');
const path = require('path');

// Function to remove instructions from cocktail objects
function removeInstructionsFromCocktail(cocktail) {
  if (cocktail.instructions) {
    delete cocktail.instructions;
  }
  return cocktail;
}

// Function to process JSON file
function processJsonFile(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read the file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Process based on file structure
    if (data.cocktails && Array.isArray(data.cocktails)) {
      // Sophisticated cocktail library format
      data.cocktails = data.cocktails.map(removeInstructionsFromCocktail);
    } else if (Array.isArray(data)) {
      // Array of cocktails
      data = data.map(removeInstructionsFromCocktail);
    } else if (data.ingredient_matrix) {
      // Ingredient matrix format - check for cocktails in nested structures
      if (data.ingredient_matrix.spirits) {
        Object.keys(data.ingredient_matrix.spirits).forEach(category => {
          if (data.ingredient_matrix.spirits[category].ingredients) {
            data.ingredient_matrix.spirits[category].ingredients = 
              data.ingredient_matrix.spirits[category].ingredients.map(removeInstructionsFromCocktail);
          }
        });
      }
      if (data.ingredient_matrix.liqueurs) {
        Object.keys(data.ingredient_matrix.liqueurs).forEach(category => {
          if (data.ingredient_matrix.liqueurs[category].ingredients) {
            data.ingredient_matrix.liqueurs[category].ingredients = 
              data.ingredient_matrix.liqueurs[category].ingredients.map(removeInstructionsFromCocktail);
          }
        });
      }
      if (data.ingredient_matrix.mixers) {
        Object.keys(data.ingredient_matrix.mixers).forEach(category => {
          if (data.ingredient_matrix.mixers[category].ingredients) {
            data.ingredient_matrix.mixers[category].ingredients = 
              data.ingredient_matrix.mixers[category].ingredients.map(removeInstructionsFromCocktail);
          }
        });
      }
    }
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Successfully processed ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// List of files to process
const filesToProcess = [
  'public/sophisticated_cocktail_library.json',
  'public/complete_ingredient_database.json',
  'public/ingredient_matrix.json',
  'public/cocktail_examples_by_ingredient.json',
  'public/flavor_journey_data.json',
  'dist/sophisticated_cocktail_library.json',
  'dist/complete_ingredient_database.json',
  'dist/ingredient_matrix.json',
  'dist/cocktail_examples_by_ingredient.json',
  'dist/flavor_journey_data.json'
];

// Process all files
filesToProcess.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  if (fs.existsSync(fullPath)) {
    processJsonFile(fullPath);
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
});

console.log('🎉 Finished removing instructions from all data files!');
