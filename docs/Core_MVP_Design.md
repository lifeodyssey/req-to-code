# Core MVP Design - AI Code Generation

## 🎯 Minimal Viable Product Scope

### Core Function
**Input**: Simple requirement description  
**Process**: Gemini CLI generates code  
**Output**: Pull request with generated code  

### What's IN (Essential)
1. **Simple requirement input** - Plain text/markdown file
2. **GitHub Actions trigger** - On file commit
3. **Gemini CLI integration** - Code generation
4. **Basic PR creation** - Automated pull request

### What's OUT (Future versions)
- ❌ Complex requirement templates
- ❌ Code quality validation
- ❌ Test generation
- ❌ Multiple file support
- ❌ Error recovery mechanisms
- ❌ Jira integration
- ❌ Advanced prompt engineering

## 🏗️ Technical Architecture

### Core Flow
```
1. Developer commits requirement.md to /requirements/
2. GitHub Actions detects file change
3. Workflow reads requirement content
4. Calls Gemini CLI with simple prompt
5. Creates new branch with generated code
6. Opens pull request
```

### Technology Stack
- **Trigger**: GitHub Actions (on push to /requirements/)
- **AI Engine**: Gemini CLI with API key
- **Output**: Single code file
- **Integration**: GitHub API for PR creation

### File Structure
```
project/
├── requirements/
│   └── feature.md              # Simple requirement file
├── .github/workflows/
│   └── generate-code.yml       # Single workflow file
└── generated/
    └── (AI generated files)
```

## 🔧 Implementation Details

### GitHub Actions Workflow
```yaml
name: AI Code Generation
on:
  push:
    paths: ['requirements/*.md']

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Gemini CLI
        run: npm install -g @google/gemini-cli
      - name: Generate Code
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: |
          # Read requirement
          REQUIREMENT=$(cat requirements/*.md)
          
          # Generate code
          gemini -p "Generate code for: $REQUIREMENT" > generated/code.js
          
          # Create PR
          gh pr create --title "AI Generated Code" --body "Auto-generated from requirement"
```

### Gemini CLI Integration
```bash
# Simple prompt structure
gemini -p "Generate JavaScript code for the following requirement: 
$(cat requirements/feature.md)

Please output only the code, no explanations."
```

### Requirement Format (Minimal)
```markdown
# Feature: User Login

Create a simple user login function that:
- Takes username and password
- Returns success/failure
- Uses basic validation

Technology: JavaScript/Node.js
```

## 🎯 Success Criteria

### Technical Success
- [ ] Workflow triggers on requirement file commit
- [ ] Gemini CLI generates code successfully
- [ ] PR is created automatically
- [ ] Generated code is syntactically valid

### Business Success
- [ ] End-to-end process works in under 5 minutes
- [ ] Generated code addresses basic requirement
- [ ] Developer can review and merge PR
- [ ] Process is repeatable

## 🚀 Implementation Plan

### Phase 1: Basic Setup (Day 1-2)
1. Create GitHub repository
2. Set up basic workflow file
3. Configure Gemini API key in secrets
4. Test basic Gemini CLI integration

### Phase 2: Core Implementation (Day 3-4)
1. Implement requirement file reading
2. Create code generation logic
3. Add PR creation functionality
4. Test end-to-end workflow

### Phase 3: Validation (Day 5)
1. Test with real requirements
2. Validate generated code quality
3. Fix critical issues
4. Document usage

## 🔒 Minimal Security

### API Key Management
- Store Gemini API key in GitHub Secrets
- Use environment variables in workflow
- No logging of sensitive data

### Code Safety
- Generated code goes to separate branch
- Requires manual PR review before merge
- No automatic execution of generated code

## 📊 MVP Validation Metrics

### Core Metrics
- **Workflow Success Rate**: >90%
- **Code Generation Time**: <2 minutes
- **PR Creation Success**: 100%
- **Basic Code Validity**: >80%

### User Experience
- **Setup Time**: <30 minutes
- **Learning Curve**: <1 hour
- **Feedback Loop**: <5 minutes end-to-end

## 🎮 Demo Scenario

### Input
```markdown
# Feature: Calculator
Create a simple calculator function that adds two numbers.
Technology: JavaScript
```

### Expected Output
```javascript
function calculator(a, b) {
  return a + b;
}
```

### Expected PR
- Title: "AI Generated: Calculator function"
- Branch: "ai-generated/calculator-[timestamp]"
- Files: `generated/calculator.js`
- Description: Links to original requirement

## 🔄 Iteration Strategy

### MVP → V1.1
- Add basic error handling
- Support multiple programming languages
- Improve prompt engineering

### V1.1 → V1.2
- Add code validation
- Support multiple files
- Better PR descriptions

### V1.2 → V2.0
- Add test generation
- Integrate code quality checks
- Support complex project structures

## 🎯 Definition of Done

The MVP is complete when:
1. A developer can commit a simple requirement file
2. GitHub Actions automatically generates code using Gemini CLI
3. A pull request is created with the generated code
4. The developer can review and merge the PR
5. The process is documented and repeatable

**Timeline**: 5 days  
**Team Size**: 1-2 developers  
**Complexity**: Simple  
**Risk Level**: Low
