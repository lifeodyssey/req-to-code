# Task 03: Gemini CLI Integration

## 📋 Task Overview
**Estimated Time**: 2 hours  
**Priority**: High  
**Dependencies**: Task 02 - GitHub Actions Workflow  
**Assignee**: Developer  

## 🎯 Objective
Configure and optimize Gemini CLI integration for reliable code generation within the GitHub Actions environment.

## 📝 Requirements

### Must Have
- [ ] Gemini CLI installation and configuration
- [ ] API key management and security
- [ ] Basic prompt engineering for code generation
- [ ] Error handling for API failures
- [ ] Output validation and formatting

### Should Have
- [ ] Retry mechanism for API failures
- [ ] Prompt optimization for different languages
- [ ] Response parsing and cleanup

## 🛠️ Implementation Steps

### Step 1: API Key Configuration
Set up secure API key management:

1. **Get Gemini API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Create new API key
   - Copy the key for repository secrets

2. **Add to GitHub Secrets**
   ```bash
   # Repository Settings → Secrets and variables → Actions
   # Add new secret: GEMINI_API_KEY
   ```

3. **Validate API Key Format**
   ```bash
   # API key should start with: AIza...
   # Length: approximately 39 characters
   ```

### Step 2: Gemini CLI Installation Script
Create installation and validation script in workflow:

```yaml
- name: Install and Configure Gemini CLI
  run: |
    echo "📦 Installing Gemini CLI..."
    npm install -g @google/gemini-cli
    
    echo "🔍 Verifying installation..."
    gemini --version
    
    echo "🔑 Validating API key format..."
    if [[ ! "$GEMINI_API_KEY" =~ ^AIza.* ]]; then
      echo "❌ Invalid API key format"
      exit 1
    fi
    
    echo "✅ Gemini CLI setup completed"
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

### Step 3: Prompt Engineering
Design effective prompts for code generation:

```bash
# Basic prompt template
BASIC_PROMPT="Generate code based on this requirement:

$REQUIREMENT_CONTENT

Rules:
- Output only the code, no explanations
- Use appropriate programming language
- Include basic error handling
- Add minimal comments
- Follow standard conventions"

# Language-specific prompts
JAVASCRIPT_PROMPT="Generate JavaScript/Node.js code for:

$REQUIREMENT_CONTENT

Requirements:
- Use modern ES6+ syntax
- Include proper error handling
- Add JSDoc comments
- Export functions properly
- Follow Airbnb style guide"

PYTHON_PROMPT="Generate Python code for:

$REQUIREMENT_CONTENT

Requirements:
- Use Python 3.8+ features
- Include type hints
- Add docstrings
- Follow PEP 8 style guide
- Include proper error handling"
```

### Step 4: Code Generation Logic
Implement robust code generation with error handling:

```bash
- name: Generate Code with Gemini
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
  run: |
    REQUIREMENT_CONTENT=$(cat "${{ steps.process.outputs.requirement_file }}")
    FEATURE_NAME="${{ steps.process.outputs.feature_name }}"
    
    echo "🤖 Starting code generation..."
    
    # Detect programming language from requirement
    LANGUAGE="javascript"  # default
    if grep -qi "python" <<< "$REQUIREMENT_CONTENT"; then
      LANGUAGE="python"
    elif grep -qi "java" <<< "$REQUIREMENT_CONTENT"; then
      LANGUAGE="java"
    fi
    
    echo "🔍 Detected language: $LANGUAGE"
    
    # Set file extension based on language
    case $LANGUAGE in
      "python")
        EXTENSION="py"
        ;;
      "java")
        EXTENSION="java"
        ;;
      *)
        EXTENSION="js"
        ;;
    esac
    
    OUTPUT_FILE="generated/${FEATURE_NAME}.${EXTENSION}"
    
    # Generate code with retry mechanism
    for attempt in {1..3}; do
      echo "🔄 Generation attempt $attempt..."
      
      if gemini -p "Generate $LANGUAGE code for:
      
      $REQUIREMENT_CONTENT
      
      Rules:
      - Output only the code, no explanations or markdown
      - Include proper error handling
      - Add minimal comments
      - Use appropriate file structure
      - Follow language best practices" > "$OUTPUT_FILE"; then
        
        echo "✅ Code generation successful"
        break
      else
        echo "❌ Attempt $attempt failed"
        if [ $attempt -eq 3 ]; then
          echo "💥 All attempts failed"
          exit 1
        fi
        sleep 5
      fi
    done
    
    # Validate generated output
    if [ ! -s "$OUTPUT_FILE" ]; then
      echo "❌ Generated file is empty"
      exit 1
    fi
    
    echo "📄 Generated file: $OUTPUT_FILE"
    echo "📊 File size: $(wc -c < "$OUTPUT_FILE") bytes"
    
    # Basic syntax validation (for JavaScript)
    if [ "$EXTENSION" = "js" ]; then
      if command -v node >/dev/null 2>&1; then
        if node -c "$OUTPUT_FILE" 2>/dev/null; then
          echo "✅ JavaScript syntax validation passed"
        else
          echo "⚠️ JavaScript syntax validation failed (continuing anyway)"
        fi
      fi
    fi
    
    # Store output info for next steps
    echo "output_file=$OUTPUT_FILE" >> $GITHUB_OUTPUT
    echo "language=$LANGUAGE" >> $GITHUB_OUTPUT
```

### Step 5: Error Handling and Logging
Implement comprehensive error handling:

```bash
- name: Handle Generation Errors
  if: failure()
  run: |
    echo "❌ Code generation failed"
    echo "🔍 Debugging information:"
    echo "- Requirement file: ${{ steps.process.outputs.requirement_file }}"
    echo "- Feature name: ${{ steps.process.outputs.feature_name }}"
    echo "- Gemini CLI version: $(gemini --version || echo 'Not installed')"
    echo "- API key configured: $([[ -n "$GEMINI_API_KEY" ]] && echo 'Yes' || echo 'No')"
    
    # Create issue for failed generation
    gh issue create \
      --title "🤖 AI Code Generation Failed: ${{ steps.process.outputs.feature_name }}" \
      --body "**Workflow Run**: [${{ github.run_id }}](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})
      
      **Requirement File**: \`${{ steps.process.outputs.requirement_file }}\`
      
      **Error**: Code generation failed after multiple attempts.
      
      Please check the workflow logs for detailed error information." \
      --label "bug" \
      --label "ai-generation"
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

## ✅ Acceptance Criteria

### Functional Requirements
- [ ] Gemini CLI installs successfully in GitHub Actions
- [ ] API key is securely configured and validated
- [ ] Code generation works for basic requirements
- [ ] Generated code is syntactically valid
- [ ] Error handling provides useful feedback
- [ ] Retry mechanism handles transient failures

### Technical Requirements
- [ ] API key format validation
- [ ] Language detection from requirements
- [ ] Appropriate file extensions
- [ ] Basic syntax validation
- [ ] Comprehensive logging

## 🧪 Testing Steps

### Unit Testing
1. **API Key Validation**
   ```bash
   # Test with invalid key format
   export GEMINI_API_KEY="invalid-key"
   # Should fail validation
   ```

2. **Language Detection**
   ```bash
   # Test requirement with "Python" mention
   echo "Create a Python function" | grep -qi "python"
   # Should return 0 (success)
   ```

### Integration Testing
1. **Simple JavaScript Requirement**
   ```markdown
   # Calculator
   Create a function that adds two numbers in JavaScript
   ```

2. **Python Requirement**
   ```markdown
   # Data Processor
   Create a Python function that processes a list of numbers
   ```

3. **Error Scenarios**
   - Invalid API key
   - Network timeout
   - Empty requirement file

## 📚 Documentation Updates
- [ ] Document API key setup process
- [ ] Add troubleshooting guide for common Gemini CLI issues
- [ ] Document supported programming languages
- [ ] Add prompt engineering best practices

## 🔗 Related Tasks
- **Previous**: Task 02 - GitHub Actions Workflow
- **Next**: Task 04 - Code Generation Testing
- **Related**: Task 05 - PR Creation Enhancement

## 📝 Notes
- Gemini CLI requires Node.js 18+ for optimal performance
- API key should be rotated periodically for security
- Prompt engineering significantly affects output quality
- Consider rate limiting for high-volume usage

## ✅ Definition of Done
- [ ] Gemini CLI is properly installed and configured
- [ ] API key management is secure and validated
- [ ] Code generation works reliably for test cases
- [ ] Error handling covers common failure scenarios
- [ ] Generated code meets basic quality standards
- [ ] Integration is ready for end-to-end testing
