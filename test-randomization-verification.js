// Quick Randomization Verification Script
// Run this in browser console to test randomization

console.log('🧪 Starting Cocktail App Randomization Tests...\n');

// Test 1: Main Quiz Randomization
async function testMainQuizRandomization() {
  console.log('📋 Test 1: Main Quiz Randomization');
  console.log('=====================================');
  
  const testAnswers = {
    sweetVsBitter: 'sweet',
    citrusVsStone: 'citrus',
    lightVsBoozy: 'medium',
    classicVsExperimental: 'classic',
    moodPreference: 'sophisticated'
  };
  
  const results = [];
  
  for (let i = 1; i <= 5; i++) {
    try {
      // Simulate the recommendation generation
      const response = await fetch('/api/generate-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testAnswers)
      });
      
      if (response.ok) {
        const result = await response.json();
        results.push({
          run: i,
          primary: result.primary?.name || 'Unknown',
          adjacent: result.adjacent?.map(c => c.name) || []
        });
        console.log(`Run ${i}: Primary = "${result.primary?.name || 'Unknown'}"`);
      } else {
        console.log(`Run ${i}: Failed to get recommendations`);
      }
    } catch (error) {
      console.log(`Run ${i}: Error - ${error.message}`);
    }
  }
  
  // Check uniqueness
  const primaryNames = results.map(r => r.primary);
  const uniquePrimaries = new Set(primaryNames);
  
  console.log(`\n📊 Results:`);
  console.log(`- Total runs: ${results.length}`);
  console.log(`- Unique primary cocktails: ${uniquePrimaries.size}`);
  console.log(`- Uniqueness rate: ${Math.round((uniquePrimaries.size / results.length) * 100)}%`);
  
  if (uniquePrimaries.size >= 4) {
    console.log('✅ Main Quiz Test: PASSED');
  } else {
    console.log('❌ Main Quiz Test: FAILED - Not enough unique results');
  }
  
  return results;
}

// Test 2: Flavor Journey Randomization
async function testFlavorJourneyRandomization() {
  console.log('\n📋 Test 2: Flavor Journey Randomization');
  console.log('========================================');
  
  const testSelection = {
    baseSpirit: 'vodka',
    flavorFamily: 'citrus',
    specificFlavor: 'lemon'
  };
  
  const results = [];
  
  for (let i = 1; i <= 5; i++) {
    try {
      // Simulate the Flavor Journey generation
      const response = await fetch('/api/generate-flavor-journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testSelection)
      });
      
      if (response.ok) {
        const cocktails = await response.json();
        results.push({
          run: i,
          cocktails: cocktails.map(c => c.name)
        });
        console.log(`Run ${i}: Generated ${cocktails.length} cocktails`);
        console.log(`  First 3: ${cocktails.slice(0, 3).map(c => c.name).join(', ')}`);
      } else {
        console.log(`Run ${i}: Failed to get cocktails`);
      }
    } catch (error) {
      console.log(`Run ${i}: Error - ${error.message}`);
    }
  }
  
  // Check uniqueness
  const allCocktailNames = results.flatMap(r => r.cocktails);
  const uniqueCocktails = new Set(allCocktailNames);
  
  console.log(`\n📊 Results:`);
  console.log(`- Total runs: ${results.length}`);
  console.log(`- Total cocktails generated: ${allCocktailNames.length}`);
  console.log(`- Unique cocktails: ${uniqueCocktails.size}`);
  console.log(`- Uniqueness rate: ${Math.round((uniqueCocktails.size / allCocktailNames.length) * 100)}%`);
  
  if (uniqueCocktails.size >= allCocktailNames.length * 0.8) {
    console.log('✅ Flavor Journey Test: PASSED');
  } else {
    console.log('❌ Flavor Journey Test: FAILED - Not enough unique results');
  }
  
  return results;
}

// Test 3: Slot Machine Randomization
async function testSlotMachineRandomization() {
  console.log('\n📋 Test 3: Slot Machine Randomization');
  console.log('=====================================');
  
  const testSlotResult = {
    flavor: 'citrus',
    mood: 'elegant',
    style: 'classic'
  };
  
  const results = [];
  
  for (let i = 1; i <= 5; i++) {
    try {
      // Simulate the slot machine generation
      const response = await fetch('/api/generate-slot-machine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testSlotResult)
      });
      
      if (response.ok) {
        const result = await response.json();
        results.push({
          run: i,
          primary: result.primary?.name || 'Unknown',
          adjacent: result.adjacent?.map(c => c.name) || []
        });
        console.log(`Run ${i}: Primary = "${result.primary?.name || 'Unknown'}"`);
      } else {
        console.log(`Run ${i}: Failed to get recommendations`);
      }
    } catch (error) {
      console.log(`Run ${i}: Error - ${error.message}`);
    }
  }
  
  // Check uniqueness
  const primaryNames = results.map(r => r.primary);
  const uniquePrimaries = new Set(primaryNames);
  
  console.log(`\n📊 Results:`);
  console.log(`- Total runs: ${results.length}`);
  console.log(`- Unique primary cocktails: ${uniquePrimaries.size}`);
  console.log(`- Uniqueness rate: ${Math.round((uniquePrimaries.size / results.length) * 100)}%`);
  
  if (uniquePrimaries.size >= 4) {
    console.log('✅ Slot Machine Test: PASSED');
  } else {
    console.log('❌ Slot Machine Test: FAILED - Not enough unique results');
  }
  
  return results;
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Running all randomization tests...\n');
  
  try {
    const quizResults = await testMainQuizRandomization();
    const flavorResults = await testFlavorJourneyRandomization();
    const slotResults = await testSlotMachineRandomization();
    
    console.log('\n🎯 Final Summary:');
    console.log('==================');
    console.log('All tests completed. Check individual test results above.');
    console.log('\n💡 Manual Testing:');
    console.log('- Try the same quiz answers multiple times');
    console.log('- Try the same Flavor Journey selections multiple times');
    console.log('- Try the same slot machine combinations multiple times');
    console.log('- Click on adjacent cocktails to see new results');
    console.log('- Use "Try Another" to reset and get fresh results');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
}

// Export for manual testing
window.testCocktailRandomization = {
  testMainQuiz: testMainQuizRandomization,
  testFlavorJourney: testFlavorJourneyRandomization,
  testSlotMachine: testSlotMachineRandomization,
  runAll: runAllTests
};

console.log('🔧 Test functions available:');
console.log('- testCocktailRandomization.runAll() - Run all tests');
console.log('- testCocktailRandomization.testMainQuiz() - Test main quiz');
console.log('- testCocktailRandomization.testFlavorJourney() - Test Flavor Journey');
console.log('- testCocktailRandomization.testSlotMachine() - Test slot machine');

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('\n🚀 Auto-running tests...');
  runAllTests();
}
