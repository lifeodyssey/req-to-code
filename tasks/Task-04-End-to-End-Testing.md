# Task 04: End-to-End Testing

## 📋 Task Overview
**Estimated Time**: 2 hours  
**Priority**: High  
**Dependencies**: Task 03 - Gemini CLI Integration  
**Assignee**: Developer/QA  

## 🎯 Objective
Validate the complete AI code generation workflow from requirement submission to PR creation through comprehensive end-to-end testing.

## 📝 Requirements

### Must Have
- [ ] Test complete workflow with various requirement types
- [ ] Validate generated code quality and functionality
- [ ] Verify PR creation and metadata
- [ ] Test error scenarios and recovery
- [ ] Document test results and findings

### Should Have
- [ ] Performance testing (execution time)
- [ ] Load testing (multiple concurrent requirements)
- [ ] Edge case testing (malformed inputs)

## 🛠️ Implementation Steps

### Step 1: Test Environment Setup
Prepare testing environment and test data:

```bash
# Create test requirements directory
mkdir -p test-requirements

# Create test cases
cat > test-requirements/simple-function.md << EOF
# Simple Calculator
Create a JavaScript function that adds two numbers.
The function should validate inputs and return the sum.
EOF

cat > test-requirements/python-class.md << EOF
# User Manager
Create a Python class for managing user data.
Include methods for adding, removing, and finding users.
Technology: Python
EOF

cat > test-requirements/complex-feature.md << EOF
# REST API Endpoint
Create a Node.js Express endpoint for user authentication.
Include input validation, password hashing, and JWT token generation.
Technology: JavaScript, Node.js, Express
EOF
```

### Step 2: Automated Test Suite
Create automated testing script:

```bash
#!/bin/bash
# test-workflow.sh

set -e

echo "🧪 Starting End-to-End Testing"

# Test configuration
REPO_NAME="ai-code-generation-mvp"
TEST_BRANCH="test-$(date +%Y%m%d-%H%M%S)"
RESULTS_FILE="test-results.md"

# Initialize test results
cat > $RESULTS_FILE << EOF
# End-to-End Test Results

**Test Run**: $(date)
**Branch**: $TEST_BRANCH

## Test Cases

EOF

# Function to run individual test
run_test() {
    local test_name="$1"
    local requirement_file="$2"
    local expected_language="$3"
    
    echo "🔍 Testing: $test_name"
    
    # Copy requirement to requirements directory
    cp "$requirement_file" "requirements/$(basename "$requirement_file")"
    
    # Commit and push to trigger workflow
    git add "requirements/$(basename "$requirement_file")"
    git commit -m "Test: $test_name"
    git push origin main
    
    # Wait for workflow to complete
    echo "⏳ Waiting for workflow completion..."
    sleep 30
    
    # Check workflow status
    WORKFLOW_STATUS=$(gh run list --limit 1 --json status --jq '.[0].status')
    
    if [ "$WORKFLOW_STATUS" = "completed" ]; then
        WORKFLOW_CONCLUSION=$(gh run list --limit 1 --json conclusion --jq '.[0].conclusion')
        
        if [ "$WORKFLOW_CONCLUSION" = "success" ]; then
            echo "✅ Workflow completed successfully"
            
            # Check if PR was created
            PR_COUNT=$(gh pr list --label "ai-generated" --json number | jq length)
            
            if [ "$PR_COUNT" -gt 0 ]; then
                echo "✅ PR created successfully"
                
                # Get PR details
                PR_NUMBER=$(gh pr list --label "ai-generated" --limit 1 --json number --jq '.[0].number')
                PR_TITLE=$(gh pr view $PR_NUMBER --json title --jq '.title')
                
                echo "📋 PR #$PR_NUMBER: $PR_TITLE"
                
                # Validate generated code
                validate_generated_code "$test_name" "$expected_language"
                
            else
                echo "❌ No PR created"
                log_test_result "$test_name" "FAIL" "PR not created"
            fi
        else
            echo "❌ Workflow failed: $WORKFLOW_CONCLUSION"
            log_test_result "$test_name" "FAIL" "Workflow failed: $WORKFLOW_CONCLUSION"
        fi
    else
        echo "❌ Workflow did not complete: $WORKFLOW_STATUS"
        log_test_result "$test_name" "FAIL" "Workflow timeout"
    fi
    
    # Cleanup
    rm -f "requirements/$(basename "$requirement_file")"
    git add "requirements/$(basename "$requirement_file")" || true
    git commit -m "Cleanup: $test_name" || true
}

# Function to validate generated code
validate_generated_code() {
    local test_name="$1"
    local expected_language="$2"
    
    echo "🔍 Validating generated code..."
    
    # Find generated files
    GENERATED_FILES=$(find generated -name "*.js" -o -name "*.py" -o -name "*.java" | head -5)
    
    if [ -z "$GENERATED_FILES" ]; then
        echo "❌ No generated files found"
        log_test_result "$test_name" "FAIL" "No generated files"
        return
    fi
    
    for file in $GENERATED_FILES; do
        echo "📄 Checking: $file"
        
        # Check file size
        FILE_SIZE=$(wc -c < "$file")
        if [ "$FILE_SIZE" -lt 10 ]; then
            echo "❌ Generated file too small: $FILE_SIZE bytes"
            log_test_result "$test_name" "FAIL" "Generated file too small"
            continue
        fi
        
        # Language-specific validation
        case "$expected_language" in
            "javascript")
                if node -c "$file" 2>/dev/null; then
                    echo "✅ JavaScript syntax valid"
                    log_test_result "$test_name" "PASS" "Valid JavaScript generated"
                else
                    echo "❌ JavaScript syntax invalid"
                    log_test_result "$test_name" "FAIL" "Invalid JavaScript syntax"
                fi
                ;;
            "python")
                if python3 -m py_compile "$file" 2>/dev/null; then
                    echo "✅ Python syntax valid"
                    log_test_result "$test_name" "PASS" "Valid Python generated"
                else
                    echo "❌ Python syntax invalid"
                    log_test_result "$test_name" "FAIL" "Invalid Python syntax"
                fi
                ;;
            *)
                echo "✅ File generated successfully"
                log_test_result "$test_name" "PASS" "Code generated"
                ;;
        esac
    done
}

# Function to log test results
log_test_result() {
    local test_name="$1"
    local status="$2"
    local details="$3"
    
    echo "### $test_name" >> $RESULTS_FILE
    echo "**Status**: $status" >> $RESULTS_FILE
    echo "**Details**: $details" >> $RESULTS_FILE
    echo "**Timestamp**: $(date)" >> $RESULTS_FILE
    echo "" >> $RESULTS_FILE
}

# Run test cases
echo "🚀 Running test cases..."

run_test "Simple JavaScript Function" "test-requirements/simple-function.md" "javascript"
run_test "Python Class" "test-requirements/python-class.md" "python"
run_test "Complex Node.js Feature" "test-requirements/complex-feature.md" "javascript"

echo "📊 Test Results Summary:"
cat $RESULTS_FILE

echo "✅ End-to-End Testing Completed"
```

### Step 3: Manual Testing Checklist
Create manual testing checklist for edge cases:

```markdown
# Manual Testing Checklist

## Basic Functionality
- [ ] Simple JavaScript function requirement
- [ ] Python class requirement
- [ ] Java method requirement
- [ ] Multi-language requirement

## Edge Cases
- [ ] Empty requirement file
- [ ] Very large requirement file (>10KB)
- [ ] Requirement with special characters
- [ ] Requirement with code examples
- [ ] Malformed markdown

## Error Scenarios
- [ ] Invalid API key
- [ ] Network timeout simulation
- [ ] Repository permission issues
- [ ] Concurrent requirement submissions

## Performance Tests
- [ ] Measure end-to-end execution time
- [ ] Test with multiple requirements simultaneously
- [ ] Monitor resource usage

## Quality Validation
- [ ] Generated code compiles/runs
- [ ] Code follows basic conventions
- [ ] Error handling is included
- [ ] Comments are appropriate
```

### Step 4: Test Data Creation
Create comprehensive test requirements:

```bash
# Create test data directory
mkdir -p test-data

# Test Case 1: Minimal requirement
cat > test-data/minimal.md << EOF
# Hello World
Create a hello world function.
EOF

# Test Case 2: Detailed requirement
cat > test-data/detailed.md << EOF
# User Authentication System

Create a comprehensive user authentication system with the following features:

## Requirements
- User registration with email validation
- Password hashing using bcrypt
- JWT token generation and validation
- Login/logout functionality
- Password reset capability

## Technology Stack
- Language: JavaScript
- Framework: Node.js with Express
- Database: MongoDB with Mongoose
- Authentication: JWT

## Acceptance Criteria
- [ ] Users can register with valid email
- [ ] Passwords are securely hashed
- [ ] JWT tokens expire after 24 hours
- [ ] Password reset sends email notification
- [ ] All endpoints have proper error handling
EOF

# Test Case 3: Multi-language requirement
cat > test-data/multi-language.md << EOF
# Data Processing Pipeline

Create a data processing system:
- Frontend: React component for file upload
- Backend: Python Flask API for processing
- Database: PostgreSQL for storage

Technology: JavaScript, Python, SQL
EOF
```

## ✅ Acceptance Criteria

### Functional Requirements
- [ ] All test cases pass successfully
- [ ] Generated code is syntactically valid
- [ ] PRs are created with proper metadata
- [ ] Error scenarios are handled gracefully
- [ ] Performance meets requirements (<5 minutes end-to-end)

### Quality Requirements
- [ ] Generated code compiles/runs without errors
- [ ] Code includes basic error handling
- [ ] Code follows language conventions
- [ ] PR descriptions are informative
- [ ] Branch naming follows conventions

## 🧪 Testing Execution

### Automated Testing
```bash
# Run automated test suite
chmod +x test-workflow.sh
./test-workflow.sh

# Check results
cat test-results.md
```

### Manual Testing
1. **Submit Test Requirements**
   ```bash
   cp test-data/minimal.md requirements/
   git add requirements/minimal.md
   git commit -m "Test: minimal requirement"
   git push
   ```

2. **Monitor Workflow**
   - Check GitHub Actions tab
   - Verify each step completion
   - Monitor execution time

3. **Validate Output**
   - Check generated code quality
   - Verify PR creation
   - Test code functionality

## 📚 Documentation Updates
- [ ] Document test procedures
- [ ] Create troubleshooting guide
- [ ] Add performance benchmarks
- [ ] Document known limitations

## 🔗 Related Tasks
- **Previous**: Task 03 - Gemini CLI Integration
- **Next**: Task 05 - Documentation and Deployment
- **Related**: All previous tasks (integration testing)

## 📝 Notes
- Test with realistic requirements that represent actual use cases
- Document any limitations or issues discovered
- Consider performance implications for larger requirements
- Maintain test data for regression testing

## ✅ Definition of Done
- [ ] Automated test suite runs successfully
- [ ] All critical test cases pass
- [ ] Performance requirements are met
- [ ] Error scenarios are properly handled
- [ ] Test results are documented
- [ ] System is ready for production use
