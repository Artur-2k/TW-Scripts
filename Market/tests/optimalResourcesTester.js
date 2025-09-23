// todo remover coinsUsed do return 
// todo more deep testing
// todo documentar this 
// todo remover logs

// Original function (copied from your code)
function getOptimalResources(needs, rates, minRates, maxCoins) {
  console.log(`Minimum rate requirements: Wood>=${minRates.wood}, Clay>=${minRates.clay}, Iron>=${minRates.iron}`);

  // Filter resources based on minimum rate requirements
  const validNeeds = {};
  const validRates = {};

  // Only include resources that meet minimum rate requirements
  if (rates.wood >= minRates.wood) {
    validNeeds.wood = needs.wood;
    validRates.wood = rates.wood;
  } else {
    validNeeds.wood = 0;
    validRates.wood = 1; // Set to 1 to avoid division issues
  }

  if (rates.clay >= minRates.clay) {
    validNeeds.clay = needs.clay;
    validRates.clay = rates.clay;
  } else {
    validNeeds.clay = 0;
    validRates.clay = 1; // Set to 1 to avoid division issues
  }

  if (rates.iron >= minRates.iron) {
    validNeeds.iron = needs.iron;
    validRates.iron = rates.iron;
  } else {
    validNeeds.iron = 0;
    validRates.iron = 1; // Set to 1 to avoid division issues
  }

  // Extract filtered needs and rates
  const { wood: needWood, clay: needClay, iron: needIron } = validNeeds;
  const { wood: rateWood, clay: rateClay, iron: rateIron } = validRates;

  console.log(`Filtered needs: Wood=${needWood}, Clay=${needClay}, Iron=${needIron}`);
  console.log(`Filtered rates: Wood=${rateWood}/coin, Clay=${rateClay}/coin, Iron=${rateIron}/coin`);
  console.log(`Maximum coins available: ${maxCoins}`);

  let bestAllocation = null;
  let bestScore = -1;

  // Calculate maximum possible coins for each resource based on needs and budget
  const maxWoodCoins = needWood > 0 ? Math.min(Math.floor(needWood / rateWood), maxCoins) : 0;
  const maxClayCoins = needClay > 0 ? Math.min(Math.floor(needClay / rateClay), maxCoins) : 0;
  const maxIronCoins = needIron > 0 ? Math.min(Math.floor(needIron / rateIron), maxCoins) : 0;

  console.log(`Max coins possible: Wood=${maxWoodCoins}, Clay=${maxClayCoins}, Iron=${maxIronCoins}`);

  // Try all combinations of coins
  for (let woodCoins = 0; woodCoins <= maxWoodCoins; woodCoins++) {
    for (let clayCoins = 0; clayCoins <= maxClayCoins; clayCoins++) {
      for (let ironCoins = 0; ironCoins <= maxIronCoins; ironCoins++) {

        // Calculate total coins needed
        const totalCoins = woodCoins + clayCoins + ironCoins;

        // Skip if exceeds budget
        if (totalCoins > maxCoins) continue;

        // Calculate resources from coins
        const woodAmount = woodCoins * rateWood;
        const clayAmount = clayCoins * rateClay;
        const ironAmount = ironCoins * rateIron;

        // Double-check we don't exceed needs
        if (woodAmount > needWood || clayAmount > needClay || ironAmount > needIron) {
          continue;
        }

        // Calculate satisfaction score (how well we meet our needs)
        const woodSatisfaction = needWood > 0 ? woodAmount / needWood : 1;
        const claySatisfaction = needClay > 0 ? clayAmount / needClay : 1;
        const ironSatisfaction = needIron > 0 ? ironAmount / needIron : 1;

        // Total resources obtained
        const totalResources = woodAmount + clayAmount + ironAmount;
        const totalNeeds = needWood + needClay + needIron;

        // Score based on:
        // 1. How much of our total needs we satisfy
        // 2. How balanced the satisfaction is across all resources
        const totalSatisfaction = totalNeeds > 0 ? totalResources / totalNeeds : 1;
        const balanceScore = Math.min(woodSatisfaction, claySatisfaction, ironSatisfaction);

        // Combined score: prioritize total satisfaction but with balance consideration
        let score = totalSatisfaction * 0.7 + balanceScore * 0.3;

        // Bonus for efficient use (getting more resources per coin)
        if (totalCoins > 0) {
          const resourcesPerCoin = totalResources / totalCoins;
          score += resourcesPerCoin * 0.001; // Small bonus for efficiency
        }

        // Update best allocation
        if (score > bestScore) {
          bestScore = score;
          bestAllocation = {
            wood: woodAmount,
            clay: clayAmount,
            iron: ironAmount,
            coinsUsed: { // todo remover this
              wood: woodCoins,
              clay: clayCoins,
              iron: ironCoins,
              total: totalCoins
            }
          };
        }
      }
    }
  }

  return bestAllocation;
}

// Test configuration
const needsValues = [0, 500, 1000, 1500]; // 0, <1000, =1000, >1000
const ratesValues = [300]; // Fixed at 300
const minRatesValues = [299, 300, 301]; // Below, equal, above rates
const coinsValues = [0, 1, 5, 10, 500];

// Calculate expected number of tests
const expectedTests = needsValues.length ** 3 * minRatesValues.length ** 3 * coinsValues.length;
console.log(`Expected total tests: ${expectedTests}`);

// Test execution
let testCount = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

// Disable console.log during tests for cleaner output
const originalConsoleLog = console.log;
console.log = () => { }; // Suppress console.log during tests

// Generate all test combinations
for (const woodNeed of needsValues) {
  for (const clayNeed of needsValues) {
    for (const ironNeed of needsValues) {
      for (const woodMinRate of minRatesValues) {
        for (const clayMinRate of minRatesValues) {
          for (const ironMinRate of minRatesValues) {
            for (const coins of coinsValues) {
              testCount++;

              const needs = { wood: woodNeed, clay: clayNeed, iron: ironNeed };
              const rates = { wood: 300, clay: 300, iron: 300 };
              const minRates = { wood: woodMinRate, clay: clayMinRate, iron: ironMinRate };

              try {
                const result = getOptimalResources(needs, rates, minRates, coins);

                // Basic validation
                let testPassed = true;
                let errorMsg = '';

                if (result === null) {
                  // Null result is valid in some cases (e.g., no coins, no valid rates, etc.)
                  testPassed = true;
                } else {
                  // Validate result structure
                  if (typeof result !== 'object' ||
                    typeof result.wood !== 'number' ||
                    typeof result.clay !== 'number' ||
                    typeof result.iron !== 'number' ||
                    typeof result.coinsUsed !== 'object') {
                    testPassed = false;
                    errorMsg = 'Invalid result structure';
                  }

                  // Validate resource amounts don't exceed needs
                  if (testPassed && (result.wood > woodNeed || result.clay > clayNeed || result.iron > ironNeed)) {
                    testPassed = false;
                    errorMsg = 'Resources exceed needs';
                  }

                  // Validate coins don't exceed budget
                  if (testPassed && result.coinsUsed.total > coins) {
                    testPassed = false;
                    errorMsg = 'Coins exceed budget';
                  }

                  // Validate resources match coins spent
                  if (testPassed) {
                    const expectedWood = result.coinsUsed.wood * (rates.wood >= minRates.wood ? rates.wood : 0);
                    const expectedClay = result.coinsUsed.clay * (rates.clay >= minRates.clay ? rates.clay : 0);
                    const expectedIron = result.coinsUsed.iron * (rates.iron >= minRates.iron ? rates.iron : 0);

                    if (Math.abs(result.wood - expectedWood) > 0.001 ||
                      Math.abs(result.clay - expectedClay) > 0.001 ||
                      Math.abs(result.iron - expectedIron) > 0.001) {
                      testPassed = false;
                      errorMsg = 'Resource amounts don\'t match coins spent';
                    }
                  }
                }

                if (testPassed) {
                  passedTests++;
                } else {
                  failedTests++;
                  testResults.push({
                    test: testCount,
                    needs,
                    rates,
                    minRates,
                    coins,
                    result,
                    error: errorMsg
                  });
                }

              } catch (error) {
                failedTests++;
                testResults.push({
                  test: testCount,
                  needs,
                  rates,
                  minRates,
                  coins,
                  result: null,
                  error: error.message
                });
              }
            }
          }
        }
      }
    }
  }
}

// Restore console.log
console.log = originalConsoleLog;

// Test results summary
console.log(`\n=== TEST RESULTS SUMMARY ===`);
console.log(`Expected tests: ${expectedTests}`);
console.log(`Actual tests run: ${testCount}`);
console.log(`Tests match expected: ${testCount === expectedTests ? 'YES ✓' : 'NO ✗'}`);
console.log(`Passed tests: ${passedTests}`);
console.log(`Failed tests: ${failedTests}`);
console.log(`Success rate: ${(passedTests / testCount * 100).toFixed(2)}%`);

// Show sample of failed tests if any
if (failedTests > 0) {
  console.log(`\n=== SAMPLE FAILED TESTS (first 10) ===`);
  for (let i = 0; i < Math.min(10, testResults.length); i++) {
    const test = testResults[i];
    console.log(`Test ${test.test}:`);
    console.log(`  Needs: ${JSON.stringify(test.needs)}`);
    console.log(`  Rates: ${JSON.stringify(test.rates)}`);
    console.log(`  MinRates: ${JSON.stringify(test.minRates)}`);
    console.log(`  Coins: ${test.coins}`);
    console.log(`  Error: ${test.error}`);
    console.log(`  Result: ${JSON.stringify(test.result)}`);
    console.log('');
  }
}

// Show some sample successful tests
console.log(`\n=== SAMPLE SUCCESSFUL TEST SCENARIOS ===`);

// Test with all zeros
console.log('1. All zeros:');
console.log = () => { }; // Suppress function logs
const test1 = getOptimalResources(
  { wood: 0, clay: 0, iron: 0 },
  { wood: 300, clay: 300, iron: 300 },
  { wood: 300, clay: 300, iron: 300 },
  0
);
console.log = originalConsoleLog;
console.log(`Result: ${JSON.stringify(test1)}`);

// Test with high needs, low coins
console.log('\n2. High needs, low coins:');
console.log = () => { };
const test2 = getOptimalResources(
  { wood: 1500, clay: 1500, iron: 1500 },
  { wood: 300, clay: 300, iron: 300 },
  { wood: 299, clay: 299, iron: 299 },
  1
);
console.log = originalConsoleLog;
console.log(`Result: ${JSON.stringify(test2)}`);

// Test with rates below minimum
console.log('\n3. All rates below minimum:');
console.log = () => { };
const test3 = getOptimalResources(
  { wood: 1000, clay: 1000, iron: 1000 },
  { wood: 300, clay: 300, iron: 300 },
  { wood: 301, clay: 301, iron: 301 },
  10
);
console.log = originalConsoleLog;
console.log(`Result: ${JSON.stringify(test3)}`);

// Test with mixed scenarios
console.log('\n4. Mixed scenario:');
console.log = () => { };
const test4 = getOptimalResources(
  { wood: 500, clay: 1000, iron: 1500 },
  { wood: 300, clay: 300, iron: 300 },
  { wood: 299, clay: 300, iron: 301 },
  5
);
console.log = originalConsoleLog;
console.log(`Result: ${JSON.stringify(test4)}`);

console.log(`\n=== VERIFICATION COMPLETE ===`);
console.log(`All ${expectedTests} test combinations have been executed!`);