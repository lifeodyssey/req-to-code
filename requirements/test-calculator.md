# Calculator Function

## Description
Create a simple calculator function that can perform basic arithmetic operations.

## Requirements

### Functional Requirements
- Support addition, subtraction, multiplication, and division
- Handle two numbers as input
- Return the result of the operation
- Include error handling for division by zero

### Technical Requirements
- Use JavaScript/Node.js
- Export the function for use in other modules
- Include JSDoc comments
- Follow modern ES6+ syntax

### Example Usage
```javascript
const calculator = require('./calculator');

console.log(calculator.add(5, 3));        // 8
console.log(calculator.subtract(10, 4));  // 6
console.log(calculator.multiply(3, 7));   // 21
console.log(calculator.divide(15, 3));    // 5
console.log(calculator.divide(10, 0));    // Error: Division by zero
```

## Acceptance Criteria
- [ ] Function handles all four basic operations
- [ ] Proper error handling for edge cases
- [ ] Code is well-documented with comments
- [ ] Function can be imported and used in other files
- [ ] Follows JavaScript best practices
