const { twoSum } = require('./leetcode-001-two-sum.js');

const assert = require('assert');

function runTest(name, testFunction) {
  try {
    testFunction();
    console.log(`✔ ${name}`);
  } catch (error) {
    console.error(`✖ ${name}`);
    console.error(error);
    process.exit(1);
  }
}

runTest('Example 1: nums = [2, 7, 11, 15], target = 9', () => {
  const result = twoSum([2, 7, 11, 15], 9);
  assert.deepStrictEqual(result.sort(), [0, 1].sort());
});

runTest('Example 2: nums = [3, 2, 4], target = 6', () => {
  const result = twoSum([3, 2, 4], 6);
  assert.deepStrictEqual(result.sort(), [1, 2].sort());
});

runTest('Example 3: nums = [3, 3], target = 6', () => {
  const result = twoSum([3, 3], 6);
  assert.deepStrictEqual(result.sort(), [0, 1].sort());
});

runTest('Handles edge case with negative numbers', () => {
  const result = twoSum([-1, -3, 5, 90], 4);
  assert.deepStrictEqual(result.sort(), [0, 2].sort());
});

runTest('Throws error if no solution is found', () => {
  assert.throws(() => twoSum([1, 2, 3], 7), /No two sum solution/);
});

runTest('Throws error for invalid input', () => {
  assert.throws(() => twoSum([1], 1), /Input must be an array of at least two numbers./);
});

console.log('All tests passed!');
