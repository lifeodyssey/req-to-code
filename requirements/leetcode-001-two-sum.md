# LeetCode 001: Two Sum

## Description
Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

## Requirements

### Functional Requirements
- Given an array of integers and a target sum
- Return the indices of the two numbers that add up to the target
- Each input should have exactly one solution
- Cannot use the same element twice
- Return the result as an array of two indices

### Technical Requirements
- Use JavaScript/Node.js
- Export the function for use in other modules
- Include JSDoc comments
- Follow modern ES6+ syntax
- Optimize for time complexity (prefer O(n) solution)

### Example Usage
```javascript
const { twoSum } = require('./two-sum');

console.log(twoSum([2, 7, 11, 15], 9));    // [0, 1]
console.log(twoSum([3, 2, 4], 6));         // [1, 2]
console.log(twoSum([3, 3], 6));            // [0, 1]
```

### Test Cases
- **Example 1**: nums = [2,7,11,15], target = 9 → Output: [0,1] (nums[0] + nums[1] = 2 + 7 = 9)
- **Example 2**: nums = [3,2,4], target = 6 → Output: [1,2] (nums[1] + nums[2] = 2 + 4 = 6)
- **Example 3**: nums = [3,3], target = 6 → Output: [0,1] (nums[0] + nums[1] = 3 + 3 = 6)

## Constraints
- 2 ≤ nums.length ≤ 10⁴
- -10⁹ ≤ nums[i] ≤ 10⁹
- -10⁹ ≤ target ≤ 10⁹
- Only one valid answer exists

## Acceptance Criteria
- [ ] Function correctly finds two indices that sum to target
- [ ] Handles all provided test cases correctly
- [ ] Returns indices in array format [index1, index2]
- [ ] Code is well-documented with JSDoc comments
- [ ] Function can be imported and used in other files
- [ ] Follows JavaScript best practices
- [ ] Includes proper error handling for edge cases
- [ ] Implements efficient algorithm (preferably O(n) time complexity)
