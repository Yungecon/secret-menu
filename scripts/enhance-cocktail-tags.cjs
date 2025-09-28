const fs = require('fs');

function enhanceCocktailDatabase() {
  try {
    console.log('Loading cocktail database...');
    const data = JSON.parse(fs.readFileSync('public/sophisticated_cocktail_library.json', 'utf8'));
    
    console.log(`Enhancing ${data.cocktails.length} cocktails...`);
    
    data.cocktails.forEach((cocktail, index) => {
      // Add enhanced flavor profile
      if (!cocktail.enhanced_flavor_profile) {
        cocktail.enhanced_flavor_profile = {
          primary: 'balanced',
          secondary: 'harmonious',
          intensity: 6,
          sweetness: 5,
          bitterness: 5,
          acidity: 5,
          aromatic: 6,
          tags: ['balanced', 'harmonious']
        };
      }

      // Add comprehensive tags
      if (!cocktail.comprehensive_tags) {
        cocktail.comprehensive_tags = [
          ...(cocktail.tags || []),
          'sophisticated',
          'refined'
        ];
      }

      if (index % 100 === 0) {
        console.log(`Enhanced ${index + 1} cocktails...`);
      }
    });

    // Write enhanced database
    fs.writeFileSync('public/sophisticated_cocktail_library.json', JSON.stringify(data, null, 2));
    fs.writeFileSync('dist/sophisticated_cocktail_library.json', JSON.stringify(data, null, 2));
    
    console.log('✅ Enhanced cocktail database!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

enhanceCocktailDatabase();
