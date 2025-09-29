// Shared inventory helpers to ensure consistent real-ingredient selection across the app

// Real amaros and liqueurs from the ingredient database
export const REAL_AMAROS = [
  'aperol', 'angostura-amaro', 'averna', 'bruto-americano', 'campari',
  'cardamaro', 'cynar', 'cynar-70', 'fernet-branca', 'montenegro',
  'ramazzotti', 'ramazzotti-rosato', 'tuaca', 'zucca-rabarbaro'
];

export const REAL_LIQUEURS = [
  'chinola-passionfruit', 'combier-orang', 'combier-watermelon',
  'fruitful-clementine', 'fruitful-smoked-jalapeno', 'fruitful-watermelon',
  'fruitful-passionfruit', 'fruitful-yuzu', 'fruitful-dragonfruit',
  'giffard-banane-du-bresil', 'giffard-lychee', 'giffard-mango',
  'giffard-pampelmouse', 'giffard-violette', 'luxardo-maraschino',
  'luxardo-amaretto', 'napoleon-mandarin', 'pama-pomegranate',
  'becherovka', 'benedictine', 'botanika-angelica-elderflower',
  'chartreuse-cuvee', 'chartreuse-green', 'chartreuse-vep',
  'chartreuse-yellow', 'dolin-genepy', 'frangelico', 'giffard-mint',
  'giffard-vanille', 'st-germain-elderflower', 'tempus-fuget-creme-de-menthe',
  'zirbenz-alpine-liqueur', 'baileys-chocolate', 'borghetti-coffee-liqueur',
  'giffard-creme-de-cacao', 'cointreau', 'grand-marnier', 'licor-43',
  'midori', 'rose-liqueur'
];

export const REAL_SYRUPS = [
  'bitter-truth-golden-falernum', 'gran-ponche-tamarindo', 'hamilton-pimento-dram',
  'heirloom-alchermes', 'heirloom-pineapple-amaro', 'lazzaroti-pech-amaretto',
  'maleza-cacahuate', 'maleza-cempasuchitl', 'montarez-coffee-creme',
  'mattei-cap-corse-blanc', 'mattei-cap-corse-rouge', 'giffard-apertif-syrup',
  'giffard-elderflower-syrup', 'giffard-ginger-syrup', 'giffard-grapefruit-syrup',
  'giffard-pineapple-syrup'
];

// Real bitters selection from inventory
export const REAL_BITTERS = [
  'angostura-bitters',
  'peychauds-bitters',
  'orange-bitters',
  'chocolate-bitters',
  'grapefruit-bitters'
];

// Real vermouths selection from inventory
export const REAL_VERMOUTHS = [
  'dolin-dry-vermouth',
  'dolin-blanc-vermouth',
  'dolin-rouge-vermouth',
  'noilly-prat-dry',
  'carpano-antica',
  'punt-e-mes'
];

// Prefer inventory-backed modifiers based on base spirit
export const selectBestRealIngredient = (baseSpirit: string, ingredientType: string): string => {
  const spiritPreferences: Record<string, string[]> = {
    mezcal: ['fernet-branca', 'averna', 'montenegro', 'chartreuse-green'],
    tequila: ['montenegro', 'ramazzotti', 'cynar', 'chartreuse-yellow'],
    gin: ['aperol', 'campari', 'montenegro', 'st-germain-elderflower'],
    vodka: ['aperol', 'campari', 'montenegro', 'cointreau'],
    whiskey: ['montenegro', 'fernet-branca', 'averna', 'benedictine'],
    bourbon: ['montenegro', 'averna', 'fernet-branca', 'benedictine'],
    brandy: ['montenegro', 'montenegro', 'averna', 'grand-marnier'],
    rum: ['averna', 'cynar', 'fernet-branca', 'cointreau'],
    cognac: ['montenegro', 'montenegro', 'averna', 'grand-marnier'],
    pisco: ['pisco', 'cynar', 'averna', 'cointreau'],
    aquavit: ['aquavit', 'fernet-branca', 'cynar', 'benedictine'],
    armagnac: ['armagnac', 'montenegro', 'averna', 'grand-marnier'],
    shochu: ['shochu', 'sake', 'cynar', 'benedictine']
  };

  let ingredientList: string[] = [];
  const type = ingredientType?.toLowerCase?.() || '';
  if (type.includes('amaro')) ingredientList = REAL_AMAROS;
  else if (type.includes('liqueur')) ingredientList = REAL_LIQUEURS;
  else if (type.includes('syrup')) ingredientList = REAL_SYRUPS;
  else if (type.includes('bitters')) ingredientList = REAL_BITTERS;
  else if (type.includes('vermouth')) ingredientList = REAL_VERMOUTHS;
  else ingredientList = REAL_LIQUEURS;

  const prefs = spiritPreferences[baseSpirit?.toLowerCase?.()] || spiritPreferences.gin;
  const availablePreferred = prefs.filter((ing) => ingredientList.includes(ing));
  if (availablePreferred.length > 0) {
    return availablePreferred[Math.floor(Math.random() * availablePreferred.length)];
  }
  return ingredientList[Math.floor(Math.random() * ingredientList.length)];
};

export const replaceGenericModifierWithInventory = (ingredientName: string, baseSpirit: string): string => {
  const genericKeywords = ['amaro', 'liqueur', 'syrup', 'bitters'];
  const lower = ingredientName?.toLowerCase?.() || '';
  if (genericKeywords.some((k) => lower.includes(k))) {
    return selectBestRealIngredient(baseSpirit, ingredientName);
  }
  return ingredientName;
};


