/**
 * Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.
 *
 * @param {number[]} nums The array of numbers.
 * @param {number} target The target sum.
 * @returns {number[]} The indices of the two numbers.
 * @throws {Error} If no solution is found.
 */
const twoSum = (nums, target) => {
  if (!Array.isArray(nums) || nums.length < 2) {
    throw new Error("Input must be an array of at least two numbers.");
  }

  const numMap = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (numMap.has(complement)) {
      return [numMap.get(complement), i];
    }
    numMap.set(nums[i], i);
  }

  throw new Error("No two sum solution");
};

module.exports = { twoSum };
