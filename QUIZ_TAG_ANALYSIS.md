# Quiz Button Tag Analysis & Enhancement Plan

## Current Quiz Button Mappings

### 1. Sweet vs Bitter Question
**Quiz Options:**
- `sweet` → tags: `['sweet', 'luxurious']`
- `bitter` → tags: `['bitter', 'sophisticated']` 
- `balanced` → tags: `['balanced', 'harmonious']`

**Current Database Mapping Issues:**
- Only 19 cocktails have `flavor_profile` objects
- Most cocktails rely on basic `tags` array with limited flavor descriptors
- Sweet ingredients detection is basic (simple syrup, sugar, honey)
- No sophisticated bitter ingredient recognition

### 2. Citrus vs Stone Fruit Question
**Quiz Options:**
- `citrus` → tags: `['citrus', 'bright']`
- `stone` → tags: `['stone', 'rich']`
- `tropical` → tags: `['tropical', 'exotic']`

**Current Database Mapping Issues:**
- Limited citrus ingredient recognition
- No stone fruit ingredient mapping
- Tropical ingredients not properly categorized

### 3. Light vs Boozy Question
**Quiz Options:**
- `light` → tags: `['light', 'refreshing']`
- `boozy` → tags: `['boozy', 'spirit-forward']`
- `medium` → tags: `['medium', 'versatile']`

**Current Database Mapping Issues:**
- Build type mapping is inconsistent
- Alcohol content not properly scored
- Mixing method doesn't always correlate with intensity

### 4. Classic vs Experimental Question
**Quiz Options:**
- `classic` → tags: `['classic', 'timeless']`
- `modern` → tags: `['modern', 'refined']`
- `experimental` → tags: `['experimental', 'bold']`

**Current Database Mapping Issues:**
- No style classification in database
- Difficulty level doesn't map to classic/experimental
- No innovation/creativity scoring

### 5. Mood Preference Question
**Quiz Options:**
- `celebratory` → tags: `['celebratory', 'joyful']`
- `elegant` → tags: `['elegant', 'refined']`
- `cozy` → tags: `['cozy', 'intimate']`
- `adventurous` → tags: `['adventurous', 'playful']`

**Current Database Mapping Issues:**
- No mood tags in database
- Seasonal notes are limited
- No atmosphere/occasion mapping

## Enhancement Recommendations

### 1. Enhanced Cocktail Database Structure
```json
{
  "id": "cocktail-1",
  "name": "Cupid's Scepter",
  "enhanced_tags": {
    "flavor_profile": {
      "primary": "sweet",
      "secondary": "herbal",
      "intensity": 7,
      "sweetness": 8,
      "bitterness": 3,
      "acidity": 6,
      "aromatic": 7
    },
    "mood_tags": ["romantic", "elegant", "intimate"],
    "style_tags": ["classic", "sophisticated"],
    "occasion_tags": ["date-night", "special-celebration", "evening"],
    "complexity_tags": ["accessible", "refined"],
    "ingredient_categories": {
      "spirits": ["brandy"],
      "liqueurs": ["plum-wine"],
      "citrus": ["lemon-juice"],
      "sweeteners": ["simple-syrup"],
      "herbs": ["mint"],
      "modifiers": ["citrus", "herbal"]
    }
  }
}
```

### 2. Improved Recommendation Logic
- Weight quiz answers more heavily in scoring
- Add fuzzy matching for ingredient categories
- Implement mood-based filtering
- Add occasion-based recommendations
- Enhance spirit diversity within flavor profiles

### 3. Tag Retrieval Optimization
- Create tag index for faster lookups
- Implement tag combination scoring
- Add tag synonym mapping
- Create tag hierarchy (primary/secondary tags)

## Priority Implementation Order
1. ✅ Add comprehensive flavor profiles to all cocktails
2. ✅ Enhance ingredient categorization system
3. ✅ Improve mood and occasion tagging
4. ✅ Optimize recommendation engine tag matching
5. ✅ Test and validate improved retrieval accuracy
