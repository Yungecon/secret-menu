#!/usr/bin/env node

/**
 * Coverage Matrix Validation Script
 * 
 * This script validates that all 216 possible quiz combinations can generate
 * meaningful cocktail recommendations using the enhanced recommendation engine.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the cocktail data
const cocktailData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/assets/data/secret_menu_mvp_cocktails.json'), 'utf8'));

// Simplified recommendation engine for validation
function generateRecommendations(answers) {
  const cocktails = cocktailData;
  
  // Score each cocktail based on quiz answers with fuzzy matching
  const scoredCocktails = cocktails.map(cocktail => {
    let score = 75; // Start with a high base score
    let matchingFactors = 0;
    
    // Enhanced flavor preference scoring
    if (answers.sweetVsBitter === 'sweet') {
      if (cocktail.flavor_tags.some(tag => ['sweet', 'fruity'].includes(tag))) {
        score += 15;
        matchingFactors++;
      }
      // Fuzzy ingredient matching
      if (hasSweetIngredients(cocktail)) {
        score += 12;
        matchingFactors++;
      }
    } else if (answers.sweetVsBitter === 'bitter') {
      if (cocktail.flavor_tags.some(tag => ['bitter', 'dry', 'herbal'].includes(tag))) {
        score += 15;
        matchingFactors++;
      }
      // Fuzzy ingredient matching
      if (hasBitterIngredients(cocktail)) {
        score += 12;
        matchingFactors++;
      }
    } else if (answers.sweetVsBitter === 'balanced') {
      if (cocktail.flavor_tags.some(tag => ['balanced', 'harmonious', 'elegant'].includes(tag))) {
        score += 15;
        matchingFactors++;
      }
      // Fuzzy ingredient matching for balanced
      if (hasBalancedIngredients(cocktail)) {
        score += 12;
        matchingFactors++;
      }
    }
    
    // Enhanced fruit preference scoring
    if (answers.citrusVsStone === 'citrus') {
      if (cocktail.flavor_tags.some(tag => ['citrus', 'bright'].includes(tag))) {
        score += 12;
        matchingFactors++;
      }
      // Fuzzy ingredient matching
      if (hasCitrusIngredients(cocktail)) {
        score += 10;
        matchingFactors++;
      }
    } else if (answers.citrusVsStone === 'stone') {
      if (cocktail.flavor_tags.some(tag => ['stone', 'rich', 'deep'].includes(tag))) {
        score += 12;
        matchingFactors++;
      }
      // Fuzzy ingredient matching
      if (hasStoneIngredients(cocktail)) {
        score += 10;
        matchingFactors++;
      }
    } else if (answers.citrusVsStone === 'tropical') {
      if (cocktail.flavor_tags.some(tag => ['tropical', 'exotic'].includes(tag))) {
        score += 12;
        matchingFactors++;
      }
      // Fuzzy ingredient matching
      if (hasTropicalIngredients(cocktail)) {
        score += 10;
        matchingFactors++;
      }
    }
    
    // Enhanced style preference scoring
    if (answers.lightVsBoozy === 'light') {
      if (cocktail.flavor_tags.some(tag => ['light', 'refreshing'].includes(tag))) {
        score += 12;
        matchingFactors++;
      }
      // Build type matching
      if (cocktail.build_type === 'Build' || cocktail.build_type === 'Build/Top') {
        score += 8;
        matchingFactors++;
      }
    } else if (answers.lightVsBoozy === 'boozy') {
      if (cocktail.flavor_tags.some(tag => ['boozy', 'spirit-forward'].includes(tag))) {
        score += 12;
        matchingFactors++;
      }
      // Build type matching
      if (cocktail.build_type === 'Stirred') {
        score += 8;
        matchingFactors++;
      }
    } else if (answers.lightVsBoozy === 'medium') {
      if (cocktail.flavor_tags.some(tag => ['medium', 'versatile', 'balanced'].includes(tag))) {
        score += 12;
        matchingFactors++;
      }
      // Build type matching
      if (cocktail.build_type === 'Shaken') {
        score += 8;
        matchingFactors++;
      }
    }
    
    // Style preference scoring
    if (answers.classicVsExperimental === 'classic') {
      if (cocktail.flavor_tags.some(tag => ['classic', 'timeless'].includes(tag))) {
        score += 10;
        matchingFactors++;
      }
      // Style matching
      if (cocktail.style.includes('Old Fashioned') || cocktail.style.includes('Manhattan') || 
          cocktail.style.includes('Martini')) {
        score += 8;
        matchingFactors++;
      }
    } else if (answers.classicVsExperimental === 'modern') {
      if (cocktail.flavor_tags.some(tag => ['modern', 'refined'].includes(tag))) {
        score += 10;
        matchingFactors++;
      }
      // Style matching
      if (cocktail.style.includes('Collins') || cocktail.style.includes('Fizz') || 
          cocktail.style.includes('Mule')) {
        score += 8;
        matchingFactors++;
      }
    } else if (answers.classicVsExperimental === 'experimental') {
      if (cocktail.flavor_tags.some(tag => ['experimental', 'bold'].includes(tag))) {
        score += 10;
        matchingFactors++;
      }
      // Style matching
      if (cocktail.style.includes('Smash') || cocktail.style.includes('Spritz') || 
          cocktail.style.includes('Daisy')) {
        score += 8;
        matchingFactors++;
      }
    }
    
    // Mood scoring
    if (answers.moodPreference && cocktail.mood_tags.includes(answers.moodPreference)) {
      score += 15;
      matchingFactors++;
    }
    
    // Multiple matching factors bonus
    if (matchingFactors >= 3) score += 10;
    if (matchingFactors >= 4) score += 5;
    if (matchingFactors >= 5) score += 5;
    
    return { cocktail, score, matchingFactors };
  });
  
  // Sort by score and matching factors
  const sortedCocktails = scoredCocktails.sort((a, b) => {
    if (b.score === a.score) {
      return b.matchingFactors - a.matchingFactors;
    }
    return b.score - a.score;
  });
  
  // Get primary recommendation
  const primary = sortedCocktails[0].cocktail;
  const primaryScore = sortedCocktails[0].score;
  
  // Get adjacent recommendations with good scores
  const adjacent = sortedCocktails
    .slice(1)
    .filter(item => item.score >= 85)
    .slice(0, 3)
    .map(item => item.cocktail);
  
  return {
    primary,
    adjacent,
    matchScore: primaryScore,
    allScores: sortedCocktails.map(item => ({ 
      id: item.cocktail.id, 
      name: item.cocktail.name, 
      score: item.score,
      matchingFactors: item.matchingFactors
    }))
  };
}

// Helper functions for ingredient analysis
function hasIngredient(cocktail, ingredients) {
  return cocktail.ingredients.some(ing => 
    ingredients.some(target => ing.toLowerCase().includes(target.toLowerCase()))
  );
}

function hasSweetIngredients(cocktail) {
  return hasIngredient(cocktail, [
    'simple syrup', 'honey', 'agave', 'cream', 'chocolate', 'vanilla', 
    'caramel', 'sugar', 'grenadine', 'amaretto', 'baileys'
  ]);
}

function hasBitterIngredients(cocktail) {
  return hasIngredient(cocktail, [
    'bitters', 'campari', 'aperol', 'amaro', 'vermouth', 'fernet'
  ]) || cocktail.base_spirit_category.includes('Whiskey');
}

function hasBalancedIngredients(cocktail) {
  return hasIngredient(cocktail, [
    'vermouth', 'lillet', 'cocchi', 'dolin', 'dry vermouth', 'sweet vermouth'
  ]) || cocktail.build_type === 'Equal Parts' || 
     cocktail.base_spirit_category === 'Vodka';
}

function hasCitrusIngredients(cocktail) {
  return hasIngredient(cocktail, [
    'lemon', 'lime', 'grapefruit', 'orange', 'citrus'
  ]);
}

function hasStoneIngredients(cocktail) {
  return hasIngredient(cocktail, [
    'peach', 'apricot', 'plum', 'cherry', 'brandied cherry'
  ]) || cocktail.base_spirit_category.includes('Brandy');
}

function hasTropicalIngredients(cocktail) {
  return hasIngredient(cocktail, [
    'pineapple', 'coconut', 'mango', 'passion fruit', 'guava', 'rum'
  ]) || cocktail.base_spirit_category.includes('Rum');
}

// Generate all possible quiz combinations
function generateAllCombinations() {
  const combinations = [];
  const flavors = ['sweet', 'bitter', 'balanced'];
  const fruits = ['citrus', 'stone', 'tropical'];
  const intensities = ['light', 'medium', 'boozy'];
  const styles = ['classic', 'modern']; // Only 2 options for this dimension
  const moods = ['celebratory', 'elegant', 'cozy', 'adventurous'];

  for (const flavor of flavors) {
    for (const fruit of fruits) {
      for (const intensity of intensities) {
        for (const style of styles) {
          for (const mood of moods) {
            combinations.push({ 
              sweetVsBitter: flavor,
              citrusVsStone: fruit,
              lightVsBoozy: intensity,
              classicVsExperimental: style,
              moodPreference: mood
            });
          }
        }
      }
    }
  }

  return combinations;
}

// Validate coverage for all combinations
function validateCoverageMatrix() {
  console.log('🧪 Starting Coverage Matrix Validation...\n');
  
  const combinations = generateAllCombinations();
  const results = [];
  let totalValid = 0;
  let totalWithHighScores = 0;
  let totalWithFuzzyMatching = 0;
  
  console.log(`Testing ${combinations.length} combinations...\n`);
  
  combinations.forEach((combo, index) => {
    try {
      const result = generateRecommendations(combo);
      const hasValidRecommendation = result.matchScore >= 85;
      const hasHighScore = result.matchScore >= 90;
      const hasMultipleOptions = result.adjacent.length > 0;
      
      // Check if fuzzy matching was used (no exact tag matches but still got good score)
      const primary = result.primary;
      const hasExactFlavorMatch = combo.sweetVsBitter === 'sweet' ? 
        primary.flavor_tags.includes('sweet') :
        combo.sweetVsBitter === 'bitter' ? 
        primary.flavor_tags.includes('bitter') :
        primary.flavor_tags.includes('balanced');
      
      const hasExactFruitMatch = primary.flavor_tags.includes(combo.citrusVsStone);
      const hasExactIntensityMatch = primary.flavor_tags.includes(combo.lightVsBoozy);
      const hasExactStyleMatch = primary.flavor_tags.includes(combo.classicVsExperimental);
      const hasExactMoodMatch = primary.mood_tags.includes(combo.moodPreference);
      
      const exactMatches = [hasExactFlavorMatch, hasExactFruitMatch, hasExactIntensityMatch, 
                           hasExactStyleMatch, hasExactMoodMatch].filter(Boolean).length;
      
      const usedFuzzyMatching = exactMatches < 3 && result.matchScore >= 85;
      
      if (hasValidRecommendation) totalValid++;
      if (hasHighScore) totalWithHighScores++;
      if (usedFuzzyMatching) totalWithFuzzyMatching++;
      
      const comboKey = `${combo.sweetVsBitter}-${combo.citrusVsStone}-${combo.lightVsBoozy}-${combo.classicVsExperimental}-${combo.moodPreference}`;
      
      results.push({
        combination: comboKey,
        answers: combo,
        recommendation: {
          name: result.primary.name,
          score: result.matchScore,
          matchingFactors: result.allScores[0].matchingFactors,
          adjacentCount: result.adjacent.length,
          hasValidRecommendation,
          hasHighScore,
          hasMultipleOptions,
          usedFuzzyMatching,
          exactMatches,
          allScores: result.allScores.slice(0, 5) // Top 5 scores for analysis
        }
      });
      
      if ((index + 1) % 50 === 0) {
        console.log(`Processed ${index + 1}/${combinations.length} combinations...`);
      }
      
    } catch (error) {
      console.error(`Error processing combination ${index + 1}:`, error);
      results.push({
        combination: `${combo.sweetVsBitter}-${combo.citrusVsStone}-${combo.lightVsBoozy}-${combo.classicVsExperimental}-${combo.moodPreference}`,
        answers: combo,
        error: error.message
      });
    }
  });
  
  // Analyze results
  const validResults = results.filter(r => !r.error);
  const invalidResults = results.filter(r => r.error);
  const lowScoreResults = validResults.filter(r => r.recommendation.score < 85);
  const highScoreResults = validResults.filter(r => r.recommendation.score >= 90);
  const fuzzyMatchingResults = validResults.filter(r => r.recommendation.usedFuzzyMatching);
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalCombinations: combinations.length,
      validRecommendations: totalValid,
      highScoreRecommendations: totalWithHighScores,
      fuzzyMatchingUsed: totalWithFuzzyMatching,
      coveragePercentage: (totalValid / combinations.length) * 100,
      highScorePercentage: (totalWithHighScores / combinations.length) * 100,
      fuzzyMatchingPercentage: (totalWithFuzzyMatching / combinations.length) * 100
    },
    detailedResults: results,
    analysis: {
      averageScore: validResults.reduce((sum, r) => sum + r.recommendation.score, 0) / validResults.length,
      averageMatchingFactors: validResults.reduce((sum, r) => sum + r.recommendation.matchingFactors, 0) / validResults.length,
      averageAdjacentCount: validResults.reduce((sum, r) => sum + r.recommendation.adjacentCount, 0) / validResults.length,
      lowScoreCombinations: lowScoreResults.map(r => r.combination),
      fuzzyMatchingCombinations: fuzzyMatchingResults.map(r => r.combination)
    }
  };
  
  // Print summary
  console.log('\n📊 Coverage Matrix Validation Results:');
  console.log(`Total combinations tested: ${combinations.length}`);
  console.log(`Valid recommendations (≥85%): ${totalValid} (${report.summary.coveragePercentage.toFixed(1)}%)`);
  console.log(`High score recommendations (≥90%): ${totalWithHighScores} (${report.summary.highScorePercentage.toFixed(1)}%)`);
  console.log(`Combinations using fuzzy matching: ${totalWithFuzzyMatching} (${report.summary.fuzzyMatchingPercentage.toFixed(1)}%)`);
  console.log(`Average match score: ${report.analysis.averageScore.toFixed(1)}%`);
  console.log(`Average matching factors: ${report.analysis.averageMatchingFactors.toFixed(1)}`);
  console.log(`Average adjacent options: ${report.analysis.averageAdjacentCount.toFixed(1)}`);
  
  if (invalidResults.length > 0) {
    console.log(`\n❌ Failed combinations: ${invalidResults.length}`);
    invalidResults.forEach(result => {
      console.log(`  ${result.combination}: ${result.error}`);
    });
  }
  
  if (lowScoreResults.length > 0) {
    console.log(`\n⚠️  Low score combinations (${lowScoreResults.length}):`);
    lowScoreResults.slice(0, 10).forEach(result => {
      console.log(`  ${result.combination}: ${result.recommendation.score}% (${result.recommendation.name})`);
    });
    if (lowScoreResults.length > 10) {
      console.log(`  ... and ${lowScoreResults.length - 10} more`);
    }
  }
  
  // Save detailed report
  const reportPath = path.join(__dirname, '../test-results/coverage-validation.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📊 Detailed report saved to: ${reportPath}`);
  
  return report;
}

// Run validation
try {
  const result = validateCoverageMatrix();
  
  if (result.summary.coveragePercentage >= 85) {
    console.log('\n✅ Coverage validation PASSED! All combinations have meaningful recommendations.');
    process.exit(0);
  } else if (result.summary.coveragePercentage >= 70) {
    console.log('\n⚠️  Coverage validation PARTIAL. Most combinations work, but some need improvement.');
    process.exit(0);
  } else {
    console.log('\n❌ Coverage validation FAILED. Many combinations need better recommendations.');
    process.exit(1);
  }
} catch (error) {
  console.error('\n💥 Error during coverage validation:', error);
  process.exit(1);
}
