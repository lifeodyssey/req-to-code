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
  assert.deepStrictEqual(result.sort(), [0, 1]);
});

runTest('Example 2: nums = [3, 2, 4], target = 6', () => {
  const result = twoSum([3, 2, 4], 6);
  assert.deepStrictEqual(result.sort(), [1, 2]);
});

runTest('Example 3: nums = [3, 3], target = 6', () => {
  const result = twoSum([3, 3], 6);
  assert.deepStrictEqual(result.sort(), [0, 1]);
});

runTest('Constraints: large numbers', () => {
    const nums = Array.from({ length: 10000 }, (_, i) => i + 10);
    nums[9998] = 1000000000;
    nums[9999] = 5;
    const target = 1000000005;
    const result = twoSum(nums, target);
    assert.deepStrictEqual(result.sort(), [9998, 9999]);
});

runTest('Constraints: negative numbers', () => {
    const result = twoSum([-1, -2, -3, -4, -5], -8);
    assert.deepStrictEqual(result.sort(), [2, 4]);
});

runTest('Error handling: no solution', () => {
    try {
        twoSum([1, 2, 3], 7);
    } catch (e) {
        assert.strictEqual(e.message, "No two sum solution");
    }
});

runTest('Error handling: not an array', () => {
    try {
        twoSum("not an array", 6);
    } catch (e) {
        assert.strictEqual(e.message, "Input must be an array of at least two numbers.");
    }
});

runTest('Error handling: array too small', () => {
    try {
        twoSum([1], 1);
    } catch (e) {
        assert.strictEqual(e.message, "Input must be an array of at least two numbers.");
    }
});

console.log('All tests passed!');
