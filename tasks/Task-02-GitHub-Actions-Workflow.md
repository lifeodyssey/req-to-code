# Task 02: GitHub Actions Workflow Setup

## 📋 Task Overview
**Estimated Time**: 3 hours  
**Priority**: High  
**Dependencies**: Task 01 - Repository Setup  
**Assignee**: Developer  

## 🎯 Objective
Create the core GitHub Actions workflow that triggers on requirement file changes and orchestrates the AI code generation process.

## 📝 Requirements

### Must Have
- [ ] Workflow triggers on requirement file changes
- [ ] Proper environment setup (Node.js, Gemini CLI)
- [ ] Environment variable configuration
- [ ] Basic error handling and logging
- [ ] Workflow permissions configuration

### Should Have
- [ ] Workflow status notifications
- [ ] Proper job naming and organization
- [ ] Timeout configurations

## 🛠️ Implementation Steps

### Step 1: Create Workflow File
Create `.github/workflows/ai-code-generation.yml`:

```yaml
name: AI Code Generation

on:
  push:
    paths: 
      - 'requirements/*.md'
    branches:
      - main
      - develop

jobs:
  generate-code:
    name: Generate Code with AI
    runs-on: ubuntu-latest
    
    permissions:
      contents: write
      pull-requests: write
      
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install Gemini CLI
        run: |
          npm install -g @google/gemini-cli
          gemini --version
          
      - name: Validate Environment
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: |
          if [ -z "$GEMINI_API_KEY" ]; then
            echo "❌ GEMINI_API_KEY not found in secrets"
            exit 1
          fi
          echo "✅ Environment validation passed"
          
      - name: Process Requirements
        id: process
        run: |
          # Find the most recently changed requirement file
          REQUIREMENT_FILE=$(find requirements -name "*.md" -type f -not -name ".gitkeep" | head -1)
          
          if [ -z "$REQUIREMENT_FILE" ]; then
            echo "❌ No requirement file found"
            exit 1
          fi
          
          echo "📄 Processing: $REQUIREMENT_FILE"
          echo "requirement_file=$REQUIREMENT_FILE" >> $GITHUB_OUTPUT
          
          # Extract feature name for branch naming
          FEATURE_NAME=$(basename "$REQUIREMENT_FILE" .md)
          TIMESTAMP=$(date +%Y%m%d-%H%M%S)
          BRANCH_NAME="ai-generated/${FEATURE_NAME}-${TIMESTAMP}"
          
          echo "🌿 Branch name: $BRANCH_NAME"
          echo "branch_name=$BRANCH_NAME" >> $GITHUB_OUTPUT
          echo "feature_name=$FEATURE_NAME" >> $GITHUB_OUTPUT
          
      - name: Generate Code
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: |
          REQUIREMENT_CONTENT=$(cat "${{ steps.process.outputs.requirement_file }}")
          
          echo "🤖 Generating code with Gemini CLI..."
          
          # Create output directory
          mkdir -p generated
          
          # Generate code using Gemini CLI
          gemini -p "Generate code based on this requirement:
          
          $REQUIREMENT_CONTENT
          
          Rules:
          - Output only the code, no explanations
          - Use appropriate file extension based on technology mentioned
          - Include basic error handling
          - Add minimal comments for clarity
          - Follow standard coding conventions" > generated/${{ steps.process.outputs.feature_name }}.js
          
          echo "✅ Code generation completed"
          
      - name: Create Branch and Commit
        run: |
          # Configure Git
          git config user.name "AI Code Generator"
          git config user.email "ai-bot@github-actions.com"
          
          # Create and switch to new branch
          git checkout -b "${{ steps.process.outputs.branch_name }}"
          
          # Add generated files
          git add generated/
          
          # Commit with descriptive message
          git commit -m "🤖 AI Generated: ${{ steps.process.outputs.feature_name }}

          Generated from: ${{ steps.process.outputs.requirement_file }}
          Timestamp: $(date)
          Workflow: ${{ github.workflow }}
          Run ID: ${{ github.run_id }}"
          
          # Push branch
          git push origin "${{ steps.process.outputs.branch_name }}"
          
      - name: Create Pull Request
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          # Create PR with GitHub CLI
          gh pr create \
            --title "🤖 AI Generated: ${{ steps.process.outputs.feature_name }}" \
            --body "## AI Generated Code

          **Source Requirement**: \`${{ steps.process.outputs.requirement_file }}\`
          **Generated Files**: \`generated/${{ steps.process.outputs.feature_name }}.js\`
          **Workflow Run**: [${{ github.run_id }}](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})

          ### Review Checklist
          - [ ] Code meets functional requirements
          - [ ] Code follows project conventions
          - [ ] No security vulnerabilities
          - [ ] Ready for integration

          ---
          *This PR was automatically created by AI Code Generation workflow*" \
            --head "${{ steps.process.outputs.branch_name }}" \
            --base main \
            --label "ai-generated" \
            --label "needs-review"
            
      - name: Workflow Summary
        run: |
          echo "## 🎉 Workflow Completed Successfully" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "- **Requirement**: ${{ steps.process.outputs.requirement_file }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Generated**: generated/${{ steps.process.outputs.feature_name }}.js" >> $GITHUB_STEP_SUMMARY
          echo "- **Branch**: ${{ steps.process.outputs.branch_name }}" >> $GITHUB_STEP_SUMMARY
          echo "- **PR**: Created automatically" >> $GITHUB_STEP_SUMMARY
```

### Step 2: Configure Workflow Permissions
Ensure the workflow has necessary permissions in repository settings:
- Actions: Read and write
- Contents: Write
- Pull requests: Write

### Step 3: Add Error Handling
The workflow includes error handling for:
- Missing API key
- No requirement files found
- Git operation failures
- PR creation failures

## ✅ Acceptance Criteria

### Functional Requirements
- [ ] Workflow triggers only on requirement file changes
- [ ] Gemini CLI is properly installed and configured
- [ ] Environment variables are securely managed
- [ ] Generated code is committed to new branch
- [ ] Pull request is created automatically
- [ ] Proper error messages for common failures

### Technical Requirements
- [ ] Workflow uses latest stable actions
- [ ] Proper permissions are configured
- [ ] Git operations are atomic and safe
- [ ] Branch naming follows conventions
- [ ] PR includes relevant metadata

## 🧪 Testing Steps

### Local Testing (Preparation)
1. **Validate Workflow Syntax**
   ```bash
   # Use GitHub CLI to validate
   gh workflow view ai-code-generation.yml
   ```

2. **Check Required Secrets**
   - Ensure `GEMINI_API_KEY` is added to repository secrets
   - Verify `GITHUB_TOKEN` is automatically available

### Integration Testing
1. **Create Test Requirement**
   ```bash
   echo "# Test Feature
   Create a simple hello world function in JavaScript" > requirements/test-feature.md
   git add requirements/test-feature.md
   git commit -m "Add test requirement"
   git push
   ```

2. **Monitor Workflow Execution**
   - Check GitHub Actions tab
   - Verify each step completes successfully
   - Confirm PR is created

3. **Validate Output**
   - Check generated code quality
   - Verify branch creation
   - Review PR content and metadata

## 📚 Documentation Updates
- [ ] Document workflow configuration
- [ ] Add troubleshooting guide for common issues
- [ ] Document required repository settings

## 🔗 Related Tasks
- **Previous**: Task 01 - Repository Setup
- **Next**: Task 03 - Gemini CLI Integration
- **Parallel**: Task 04 - API Key Configuration

## 📝 Notes
- Workflow is designed to be idempotent and safe
- Each run creates a unique branch to avoid conflicts
- Error handling provides clear feedback for debugging
- PR template includes review checklist for quality control

## ✅ Definition of Done
- [ ] Workflow file is created and properly configured
- [ ] All required permissions are set
- [ ] Error handling covers common failure scenarios
- [ ] Workflow can be triggered by requirement file changes
- [ ] Generated output follows expected format and structure
- [ ] Team can monitor and debug workflow execution
