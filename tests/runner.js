/**
 * @file runner.js
 * @description Lightweight Native Node.js Test Runner and Assertion Suite for TrainPlex / CI environments.
 */

const fs = require('fs');
const path = require('path');

let passedTests = 0;
let failedTests = 0;

global.describe = function(suiteName, fn) {
  console.log(`\n--- Test Suite: ${suiteName} ---`);
  try {
    fn();
  } catch (err) {
    console.error(`Suite failure in ${suiteName}:`, err.message);
  }
};

global.test = function(testName, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${testName} - ${err.message}`);
    failedTests++;
  }
};

global.expect = function(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) throw new Error(`Expected ${expected}, but received ${actual}`);
    },
    toBeDefined() {
      if (actual === undefined || actual === null) throw new Error(`Expected value to be defined`);
    },
    toBeGreaterThan(expected) {
      if (!(actual > expected)) throw new Error(`Expected ${actual} > ${expected}`);
    },
    toBeGreaterThanOrEqual(expected) {
      if (!(actual >= expected)) throw new Error(`Expected ${actual} >= ${expected}`);
    },
    toBeLessThan(expected) {
      if (!(actual < expected)) throw new Error(`Expected ${actual} < ${expected}`);
    },
    toBeLessThanOrEqual(expected) {
      if (!(actual <= expected)) throw new Error(`Expected ${actual} <= ${expected}`);
    }
  };
};

console.log('====================================================');
console.log('   AURA APEX BANK — UNIT & DOMAIN TEST HARNESS');
console.log('====================================================');

const unitDir = path.join(__dirname, 'unit');
const files = fs.readdirSync(unitDir).filter(f => f.endsWith('.test.js'));

for (const file of files) {
  require(path.join(unitDir, file));
}

console.log('\n====================================================');
console.log(`RESULTS: ${passedTests} passed, ${failedTests} failed`);
console.log('====================================================\n');

if (failedTests > 0) {
  process.exit(1);
}