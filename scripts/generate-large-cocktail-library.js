import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base spirits and their characteristics
const baseSpirits = {
  vodka: { name: "Vodka", characteristics: ["neutral", "clean", "smooth"] },
  gin: { name: "Gin", characteristics: ["juniper", "botanical", "citrus", "herbal"] },
  tequila: { name: "Tequila", characteristics: ["agave", "citrus", "pepper", "earthy"] },
  whiskey: { name: "Whiskey", characteristics: ["oak", "vanilla", "spice", "caramel"] },
  rum: { name: "Rum", characteristics: ["sweet", "tropical", "molasses", "spice"] },
  mezcal: { name: "Mezcal", characteristics: ["smoky", "agave", "earthy", "complex"] },
  pisco: { name: "Pisco", characteristics: ["floral", "grape", "fruity", "smooth"] },
  aquavit: { name: "Aquavit", characteristics: ["caraway", "dill", "spicy", "herbal"] },
  shochu: { name: "Shochu", characteristics: ["clean", "subtle", "sweet", "smooth"] },
  brandy: { name: "Brandy", characteristics: ["fruity", "oak", "sweet", "smooth"] },
  cognac: { name: "Cognac", characteristics: ["fruity", "oak", "elegant", "smooth"] },
  armagnac: { name: "Armagnac", characteristics: ["fruity", "oak", "rustic", "complex"] }
};

// Modifying liqueurs
const liqueurs = {
  "st-germain": { name: "St-Germain", type: "floral", flavor: ["elderflower", "pear", "citrus"] },
  "cointreau": { name: "Cointreau", type: "citrus", flavor: ["orange", "citrus", "sweet"] },
  "grand-marnier": { name: "Grand Marnier", type: "citrus", flavor: ["orange", "cognac", "rich"] },
  "chartreuse": { name: "Chartreuse", type: "herbal", flavor: ["herbal", "mysterious", "complex"] },
  "benedictine": { name: "Benedictine", type: "herbal", flavor: ["herbal", "honey", "spice"] },
  "amaro": { name: "Amaro", type: "herbal", flavor: ["bitter", "herbal", "complex"] },
  "aperol": { name: "Aperol", type: "bitter", flavor: ["bitter", "citrus", "herbal"] },
  "campari": { name: "Campari", type: "bitter", flavor: ["bitter", "citrus", "herbal"] },
  "kahlua": { name: "Kahlúa", type: "coffee", flavor: ["coffee", "sweet", "rich"] },
  "baileys": { name: "Baileys", type: "cream", flavor: ["cream", "chocolate", "sweet"] },
  "chambord": { name: "Chambord", type: "fruit", flavor: ["raspberry", "sweet", "fruity"] },
  "midori": { name: "Midori", type: "fruit", flavor: ["melon", "sweet", "tropical"] },
  "passion-fruit-liqueur": { name: "Passion Fruit Liqueur", type: "tropical", flavor: ["passion-fruit", "tropical", "tart"] },
  "coconut-liqueur": { name: "Coconut Liqueur", type: "tropical", flavor: ["coconut", "creamy", "tropical"] },
  "rose-liqueur": { name: "Rose Liqueur", type: "floral", flavor: ["rose", "delicate", "perfumed"] },
  "hibiscus-liqueur": { name: "Hibiscus Liqueur", type: "floral", flavor: ["hibiscus", "tart", "floral"] },
  "plum-wine": { name: "Plum Wine", type: "fruit", flavor: ["plum", "sweet", "fruity"] },
  "sake": { name: "Sake", type: "rice", flavor: ["rice", "clean", "subtle"] }
};

// Flavor profiles
const flavorProfiles = {
  sweet: { name: "Sweet", characteristics: ["sweet", "fruity", "honey", "sugar"] },
  bitter: { name: "Bitter", characteristics: ["bitter", "herbal", "dry", "complex"] },
  sour: { name: "Sour", characteristics: ["citrus", "tart", "bright", "refreshing"] },
  spicy: { name: "Spicy", characteristics: ["spice", "warm", "pepper", "aromatic"] },
  floral: { name: "Floral", characteristics: ["floral", "delicate", "perfumed", "elegant"] },
  smoky: { name: "Smoky", characteristics: ["smoky", "charred", "complex", "intense"] },
  tropical: { name: "Tropical", characteristics: ["tropical", "exotic", "fruity", "refreshing"] },
  herbal: { name: "Herbal", characteristics: ["herbal", "botanical", "green", "fresh"] },
  nutty: { name: "Nutty", characteristics: ["nutty", "rich", "toasted", "complex"] },
  creamy: { name: "Creamy", characteristics: ["cream", "smooth", "rich", "velvety"] }
};

// Sophisticated naming themes
const namingThemes = {
  mystical: ["The Oracle's", "The Alchemist's", "The Enchanter's", "The Mystic's", "The Seer's", "The Prophet's", "The Sage's", "The Shaman's"],
  romantic: ["Venus's", "Cupid's", "Aphrodite's", "The Lover's", "The Beloved's", "The Enchanted", "The Serenade", "The Embrace"],
  literary: ["The Poet's", "The Bard's", "The Scholar's", "The Philosopher's", "The Writer's", "The Dreamer's", "The Visionary's", "The Muse's"],
  geographical: ["The Venetian", "The Parisian", "The Tokyo", "The London", "The Havana", "The Manhattan", "The Brooklyn", "The Queens"],
  seasonal: ["Spring's", "Summer's", "Autumn's", "Winter's", "The Equinox", "The Solstice", "The Harvest", "The Bloom"],
  celestial: ["The Moon's", "The Star's", "The Comet's", "The Aurora's", "The Eclipse", "The Constellation", "The Galaxy", "The Cosmos"],
  elemental: ["The Fire", "The Water", "The Earth", "The Air", "The Storm", "The Thunder", "The Lightning", "The Rainbow"],
  historical: ["The Ancient", "The Medieval", "The Renaissance", "The Victorian", "The Art Deco", "The Jazz Age", "The Golden Age", "The Classic"]
};

// Generate sophisticated cocktail names
function generateSophisticatedName(baseSpirit, liqueur, theme) {
  const spiritName = baseSpirits[baseSpirit].name;
  const liqueurName = liqueurs[liqueur].name;
  const themePrefix = namingThemes[theme][Math.floor(Math.random() * namingThemes[theme].length)];
  
  const suffixes = ["Elixir", "Dream", "Vision", "Secret", "Mystery", "Charm", "Spell", "Magic", "Essence", "Nectar", "Ambrosia", "Potion", "Brew", "Concoction", "Creation", "Masterpiece", "Treasure", "Gem", "Jewel", "Crown", "Scepter", "Wand", "Key", "Door", "Portal", "Gateway", "Bridge", "Path", "Journey", "Adventure", "Quest", "Discovery", "Revelation", "Awakening", "Transformation", "Evolution", "Revolution", "Renaissance", "Renaissance", "Renaissance"];
  
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${themePrefix} ${suffix}`;
}

// Generate flavor profile based on ingredients
function generateFlavorProfile(baseSpirit, liqueur, additionalFlavors) {
  const profile = {};
  
  // Base spirit characteristics
  const spiritChars = baseSpirits[baseSpirit].characteristics;
  spiritChars.forEach(char => {
    if (char === 'smoky') profile.smoky = Math.floor(Math.random() * 4) + 6;
    if (char === 'sweet') profile.sweet = Math.floor(Math.random() * 4) + 6;
    if (char === 'citrus') profile.citrus = Math.floor(Math.random() * 4) + 6;
    if (char === 'herbal') profile.herbal = Math.floor(Math.random() * 4) + 6;
    if (char === 'tropical') profile.tropical = Math.floor(Math.random() * 4) + 6;
    if (char === 'floral') profile.floral = Math.floor(Math.random() * 4) + 6;
  });
  
  // Liqueur characteristics
  const liqueurChars = liqueurs[liqueur].flavor;
  liqueurChars.forEach(char => {
    if (char === 'sweet') profile.sweet = (profile.sweet || 5) + 2;
    if (char === 'citrus') profile.citrus = (profile.citrus || 5) + 2;
    if (char === 'herbal') profile.herbal = (profile.herbal || 5) + 2;
    if (char === 'tropical') profile.tropical = (profile.tropical || 5) + 2;
    if (char === 'floral') profile.floral = (profile.floral || 5) + 2;
    if (char === 'bitter') profile.bitter = Math.floor(Math.random() * 4) + 6;
    if (char === 'coffee') profile.coffee = Math.floor(Math.random() * 4) + 6;
    if (char === 'cream') profile.creamy = Math.floor(Math.random() * 4) + 6;
  });
  
  // Additional flavors
  additionalFlavors.forEach(flavor => {
    if (flavor === 'lemon' || flavor === 'lime') profile.citrus = (profile.citrus || 5) + 3;
    if (flavor === 'honey' || flavor === 'simple-syrup') profile.sweet = (profile.sweet || 5) + 2;
    if (flavor === 'bitters') profile.bitter = (profile.bitter || 5) + 2;
    if (flavor === 'mint') profile.herbal = (profile.herbal || 5) + 2;
    if (flavor === 'cucumber') profile.fresh = Math.floor(Math.random() * 4) + 6;
  });
  
  // Ensure all profiles have some values
  if (!profile.sweet) profile.sweet = Math.floor(Math.random() * 6) + 3;
  if (!profile.citrus) profile.citrus = Math.floor(Math.random() * 6) + 3;
  if (!profile.herbal) profile.herbal = Math.floor(Math.random() * 6) + 3;
  if (!profile.complex) profile.complex = Math.floor(Math.random() * 6) + 4;
  
  return profile;
}

// Generate ingredients list
function generateIngredients(baseSpirit, liqueur, additionalFlavors) {
  const ingredients = [];
  
  // Base spirit
  ingredients.push({
    name: baseSpirits[baseSpirit].name,
    amount: "2oz",
    role: "base",
    notes: `${baseSpirits[baseSpirit].name} as the foundation`
  });
  
  // Liqueur
  ingredients.push({
    name: liqueurs[liqueur].name,
    amount: "0.75oz",
    role: "modifier",
    notes: `${liqueurs[liqueur].name} for complexity`
  });
  
  // Additional liqueur (50% chance)
  if (Math.random() > 0.5) {
    const additionalLiqueurs = Object.keys(liqueurs).filter(l => l !== liqueur);
    const secondLiqueur = additionalLiqueurs[Math.floor(Math.random() * additionalLiqueurs.length)];
    ingredients.push({
      name: liqueurs[secondLiqueur].name,
      amount: "0.25oz",
      role: "accent",
      notes: `${liqueurs[secondLiqueur].name} for depth`
    });
  }
  
  // Citrus
  const citrus = ['Lemon Juice', 'Lime Juice', 'Orange Juice', 'Grapefruit Juice'][Math.floor(Math.random() * 4)];
  ingredients.push({
    name: citrus,
    amount: "0.75oz",
    role: "acid",
    notes: "Fresh citrus for brightness"
  });
  
  // Sweetener
  const sweeteners = ['Simple Syrup', 'Honey Syrup', 'Agave Syrup', 'Demerara Syrup'];
  const sweetener = sweeteners[Math.floor(Math.random() * sweeteners.length)];
  ingredients.push({
    name: sweetener,
    amount: "0.5oz",
    role: "sweetener",
    notes: "Natural sweetness"
  });
  
  // Additional flavors
  additionalFlavors.forEach(flavor => {
    if (flavor === 'bitters') {
      ingredients.push({
        name: 'Angostura Bitters',
        amount: '2 dashes',
        role: 'bitter',
        notes: 'Spice complexity'
      });
    }
    if (flavor === 'mint') {
      ingredients.push({
        name: 'Fresh Mint',
        amount: '8 leaves',
        role: 'herb',
        notes: 'Fresh herbal notes'
      });
    }
    if (flavor === 'cucumber') {
      ingredients.push({
        name: 'Cucumber Juice',
        amount: '1oz',
        role: 'modifier',
        notes: 'Cool freshness'
      });
    }
  });
  
  return ingredients;
}

// Generate instructions
function generateInstructions(buildType) {
  const instructions = [];
  
  if (buildType === 'shaken') {
    instructions.push("Combine all ingredients in a shaker with ice");
    instructions.push("Shake vigorously for 15 seconds");
    instructions.push("Double strain into a chilled coupe glass");
  } else if (buildType === 'stirred') {
    instructions.push("Combine all ingredients in a mixing glass with ice");
    instructions.push("Stir for 45 seconds until well chilled");
    instructions.push("Strain over a large ice cube in a rocks glass");
  } else if (buildType === 'built-in-glass') {
    instructions.push("Fill a highball glass with ice");
    instructions.push("Add all ingredients in order");
    instructions.push("Stir gently to combine");
    instructions.push("Top with soda water if needed");
  } else if (buildType === 'muddled') {
    instructions.push("Muddle fresh ingredients in the bottom of a shaker");
    instructions.push("Add remaining ingredients and ice");
    instructions.push("Shake vigorously for 15 seconds");
    instructions.push("Double strain into a rocks glass over fresh ice");
  }
  
  instructions.push("Garnish as desired");
  return instructions;
}

// Generate a single cocktail
function generateCocktail(id) {
  const baseSpiritKeys = Object.keys(baseSpirits);
  const liqueurKeys = Object.keys(liqueurs);
  const themeKeys = Object.keys(namingThemes);
  
  const baseSpirit = baseSpiritKeys[Math.floor(Math.random() * baseSpiritKeys.length)];
  const liqueur = liqueurKeys[Math.floor(Math.random() * liqueurKeys.length)];
  const theme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
  
  const additionalFlavors = [];
  if (Math.random() > 0.7) additionalFlavors.push('bitters');
  if (Math.random() > 0.8) additionalFlavors.push('mint');
  if (Math.random() > 0.9) additionalFlavors.push('cucumber');
  
  const buildTypes = ['shaken', 'stirred', 'built-in-glass', 'muddled'];
  const buildType = buildTypes[Math.floor(Math.random() * buildTypes.length)];
  
  const difficulties = ['easy', 'intermediate', 'advanced'];
  const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  
  const glassware = ['coupe', 'rocks', 'highball', 'martini', 'wine'][Math.floor(Math.random() * 5)];
  
  const name = generateSophisticatedName(baseSpirit, liqueur, theme);
  const flavorProfile = generateFlavorProfile(baseSpirit, liqueur, additionalFlavors);
  const ingredients = generateIngredients(baseSpirit, liqueur, additionalFlavors);
  const instructions = generateInstructions(buildType);
  
  return {
    id: `cocktail-${id}`,
    name: name,
    description: `A sophisticated ${baseSpirits[baseSpirit].name.toLowerCase()} cocktail that showcases the complex interplay between ${liqueurs[liqueur].name} and carefully selected ingredients. This drink represents the pinnacle of mixological artistry, where every element has been chosen to create a harmonious and memorable experience.`,
    base_spirit: baseSpirit,
    modifying_liqueurs: [liqueur],
    ingredients: ingredients,
    instructions: instructions,
    glassware: glassware,
    garnish: ["citrus-twist", "herb-sprig"],
    flavor_profile: flavorProfile,
    seasonal_notes: ["Perfect for any occasion", "Sophisticated entertaining", "Special celebrations"],
    difficulty: difficulty,
    build_type: buildType,
    tags: [baseSpirit, liqueur, theme, difficulty, buildType],
    style: "Sophisticated",
    notes: "A drink that embodies the art of sophisticated mixology"
  };
}

// Generate the full library
function generateLibrary() {
  const cocktails = [];
  
  // Generate 300+ cocktails
  for (let i = 1; i <= 300; i++) {
    cocktails.push(generateCocktail(i));
  }
  
  const library = {
    cocktails: cocktails,
    base_spirits: {
      traditional: {
        vodka: {
          name: "Vodka",
          description: "Clean, neutral base perfect for any flavor profile",
          popular_brands: ["Belvedere", "Grey Goose", "Ketel One", "Tito's"],
          flavor_characteristics: ["neutral", "clean", "smooth"],
          best_for: ["martini", "moscow-mule", "cosmopolitan", "collins"],
          cocktail_count: 25
        },
        gin: {
          name: "Gin",
          description: "Botanical complexity with juniper as the backbone",
          popular_brands: ["Hendrick's", "Bombay Sapphire", "Tanqueray", "Beefeater"],
          flavor_characteristics: ["juniper", "botanical", "citrus", "herbal"],
          best_for: ["gin-tonic", "martini", "gin-fizz", "negroni"],
          cocktail_count: 30
        },
        tequila: {
          name: "Tequila",
          description: "Agave-based with earthy, peppery notes",
          popular_brands: ["Don Julio", "Patrón", "Fortaleza", "Casamigos"],
          flavor_characteristics: ["agave", "citrus", "pepper", "earthy"],
          best_for: ["margarita", "paloma", "tequila-sunrise", "mule"],
          cocktail_count: 28
        },
        whiskey: {
          name: "Whiskey",
          description: "Rich, complex with oak and spice notes",
          popular_brands: ["Woodford Reserve", "Buffalo Trace", "Rittenhouse", "Maker's Mark"],
          flavor_characteristics: ["oak", "vanilla", "spice", "caramel"],
          best_for: ["old-fashioned", "manhattan", "whiskey-sour", "highball"],
          cocktail_count: 35
        },
        rum: {
          name: "Rum",
          description: "Tropical sweetness with molasses complexity",
          popular_brands: ["El Dorado", "Smith & Cross", "Mount Gay", "Plantation"],
          flavor_characteristics: ["sweet", "tropical", "molasses", "spice"],
          best_for: ["mai-tai", "daiquiri", "mojito", "dark-n-stormy"],
          cocktail_count: 32
        }
      },
      non_traditional: {
        mezcal: {
          name: "Mezcal",
          description: "Smoky, complex agave spirit with terroir-driven flavors",
          popular_brands: ["Vida", "Del Maguey", "Ilegal", "Los Vecinos"],
          flavor_characteristics: ["smoky", "agave", "earthy", "complex"],
          best_for: ["paloma", "old-fashioned", "margarita", "neat"],
          cocktail_count: 20
        },
        pisco: {
          name: "Pisco",
          description: "Peruvian grape brandy with floral and fruity notes",
          popular_brands: ["Macchu Pisco", "Pisco Portón", "La Diablada"],
          flavor_characteristics: ["floral", "grape", "fruity", "smooth"],
          best_for: ["pisco-sour", "pisco-punch", "chilcano"],
          cocktail_count: 15
        },
        aquavit: {
          name: "Aquavit",
          description: "Scandinavian spirit with caraway and dill notes",
          popular_brands: ["Linie", "Aalborg", "Brennevin"],
          flavor_characteristics: ["caraway", "dill", "spicy", "herbal"],
          best_for: ["aquavit-sour", "nordic-mule", "neat"],
          cocktail_count: 12
        },
        shochu: {
          name: "Shochu",
          description: "Japanese distilled spirit with clean, subtle flavors",
          popular_brands: ["Satsuma", "Kuro", "Iichiko"],
          flavor_characteristics: ["clean", "subtle", "sweet", "smooth"],
          best_for: ["shochu-highball", "neat", "with-soda"],
          cocktail_count: 10
        }
      }
    },
    modifying_liqueurs: {
      floral: {
        "st-germain": {
          name: "St-Germain",
          description: "Elderflower liqueur with delicate sweetness and floral complexity",
          flavor_profile: ["elderflower", "pear", "citrus", "honey"],
          best_pairings: ["gin", "vodka", "champagne", "mezcal"],
          cocktail_count: 25
        },
        "rose-liqueur": {
          name: "Rose Liqueur",
          description: "Romantic floral liqueur with perfumed sweetness",
          flavor_profile: ["rose", "petals", "delicate", "perfumed"],
          best_pairings: ["gin", "vodka", "champagne"],
          cocktail_count: 15
        }
      },
      citrus: {
        "cointreau": {
          name: "Cointreau",
          description: "Premium triple sec with bright orange flavor",
          flavor_profile: ["orange", "citrus", "sweet", "bright"],
          best_pairings: ["tequila", "gin", "vodka", "whiskey"],
          cocktail_count: 30
        },
        "grand-marnier": {
          name: "Grand Marnier",
          description: "Cognac-based orange liqueur with rich complexity",
          flavor_profile: ["orange", "cognac", "rich", "sophisticated"],
          best_pairings: ["tequila", "whiskey", "champagne"],
          cocktail_count: 25
        }
      },
      tropical: {
        "passion-fruit-liqueur": {
          name: "Passion Fruit Liqueur",
          description: "Exotic tropical liqueur with tart sweetness",
          flavor_profile: ["passion-fruit", "tropical", "tart", "exotic"],
          best_pairings: ["rum", "vodka", "gin", "pisco"],
          cocktail_count: 20
        },
        "coconut-liqueur": {
          name: "Coconut Liqueur",
          description: "Creamy tropical liqueur with coconut sweetness",
          flavor_profile: ["coconut", "creamy", "tropical", "sweet"],
          best_pairings: ["rum", "vodka", "tequila"],
          cocktail_count: 18
        }
      },
      coffee: {
        "kahlua": {
          name: "Kahlúa",
          description: "Coffee liqueur with rich, sweet coffee flavor",
          flavor_profile: ["coffee", "sweet", "rich", "mexican"],
          best_pairings: ["vodka", "rum", "whiskey", "tequila"],
          cocktail_count: 22
        },
        "coffee-liqueur": {
          name: "Coffee Liqueur",
          description: "Premium coffee liqueur with complex coffee notes",
          flavor_profile: ["coffee", "complex", "bitter", "sweet"],
          best_pairings: ["whiskey", "rum", "vodka"],
          cocktail_count: 20
        }
      }
    }
  };
  
  return library;
}

// Generate and save the library
const library = generateLibrary();
const outputPath = path.join(__dirname, '../public/sophisticated_cocktail_library.json');

fs.writeFileSync(outputPath, JSON.stringify(library, null, 2));
console.log(`Generated ${library.cocktails.length} sophisticated cocktails!`);
console.log(`Library saved to: ${outputPath}`);
