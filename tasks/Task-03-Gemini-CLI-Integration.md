# Task 03: Gemini CLI Integration (Updated)

## 📋 Task Overview
**Estimated Time**: 2 hours
**Priority**: High
**Dependencies**: Task 02 - GitHub Actions Workflow
**Assignee**: Developer

## 🎯 Objective
Integrate Google's official Gemini CLI as our AI code generation engine, leveraging its non-interactive mode for automated code generation within GitHub Actions.

## 🔍 Key Insights from Source Code Analysis
After analyzing the [official Gemini CLI repository](https://github.com/google-gemini/gemini-cli), we discovered:

- **Complete AI Agent**: Gemini CLI is a full-featured AI workflow tool, not just a simple API wrapper
- **Non-Interactive Mode**: Built-in support for CI/CD environments through non-interactive execution
- **Built-in Tools**: File operations, shell commands, web search, and more are already implemented
- **Robust Error Handling**: Includes retry mechanisms, authentication management, and comprehensive logging
- **MCP Protocol Support**: Extensible through Model Context Protocol

## 📝 Requirements

### Must Have
- [ ] Official Gemini CLI installation and configuration
- [ ] Non-interactive mode setup for GitHub Actions
- [ ] API key management and security
- [ ] File operation permissions and directory management
- [ ] Output capture and validation

### Should Have
- [ ] YOLO mode configuration for automated file operations
- [ ] Custom .gemini/settings.json configuration
- [ ] Integration with existing workflow outputs
- [ ] Comprehensive logging and debugging

## 🛠️ Implementation Steps

### Step 1: Official Gemini CLI Installation
Install and configure the official Google Gemini CLI:

1. **Installation in GitHub Actions**
   ```yaml
   - name: Install Gemini CLI
     run: |
       echo "📦 Installing official Gemini CLI..."
       npm install -g @google/gemini-cli

       echo "🔍 Verifying installation..."
       gemini --version

       echo "✅ Gemini CLI installed successfully"
   ```

2. **API Key Configuration**
   - Visit [Google AI Studio](https://aistudio.google.com/) to get API key
   - Add `GEMINI_API_KEY` to GitHub repository secrets
   - API key format: `AIza...` (approximately 39 characters)

### Step 2: Non-Interactive Mode Configuration
Configure Gemini CLI for automated execution:

```yaml
- name: Configure Gemini CLI for Non-Interactive Mode
  run: |
    echo "🔧 Setting up non-interactive configuration..."

    # Create .gemini directory if it doesn't exist
    mkdir -p .gemini

    # Create settings.json for non-interactive mode
    cat > .gemini/settings.json << EOF
    {
      "selectedAuthType": "USE_GEMINI",
      "approvalMode": "YOLO",
      "excludeTools": [],
      "autoConfigureMaxOldSpaceSize": true
    }
    EOF

    echo "🔑 Validating API key..."
    if [[ ! "$GEMINI_API_KEY" =~ ^AIza.* ]]; then
      echo "❌ Invalid API key format"
      exit 1
    fi

    echo "✅ Configuration completed"
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

### Step 3: Code Generation with Non-Interactive Mode
Implement code generation using Gemini CLI's non-interactive capabilities:

```yaml
- name: Generate Code with Gemini CLI
  run: |
    echo "🤖 Starting code generation..."

    # Read requirement content
    REQUIREMENT_CONTENT=$(cat "${{ steps.process.outputs.requirement_file }}")
    FEATURE_NAME="${{ steps.process.outputs.feature_name }}"

    # Create output directory
    mkdir -p generated

    # Use Gemini CLI in non-interactive mode
    # The CLI will automatically detect it's in a non-TTY environment
    echo "📝 Processing requirement: $FEATURE_NAME"

    # Method 1: Using stdin (recommended)
    echo "$REQUIREMENT_CONTENT" | gemini > "generated/${FEATURE_NAME}_output.txt" 2>&1

    # Method 2: Using command line argument (alternative)
    # gemini "Generate production-ready code for: $REQUIREMENT_CONTENT" > "generated/${FEATURE_NAME}_output.txt" 2>&1

    # Check if generation was successful
    if [ $? -eq 0 ]; then
      echo "✅ Code generation completed successfully"
    else
      echo "❌ Code generation failed"
      cat "generated/${FEATURE_NAME}_output.txt"
      exit 1
    fi

    # Store output info for next steps
    echo "output_file=generated/${FEATURE_NAME}_output.txt" >> $GITHUB_OUTPUT
    echo "feature_name=$FEATURE_NAME" >> $GITHUB_OUTPUT
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

### Step 4: File Discovery and Validation
Validate and process generated files:

```yaml
- name: Process Generated Files
  run: |
    echo "🔍 Discovering generated files..."

    # Gemini CLI may have created files directly in the workspace
    # Let's find all newly created or modified files
    find . -name "*.js" -o -name "*.py" -o -name "*.java" -o -name "*.ts" -newer .gemini/settings.json 2>/dev/null || true

    # Check if any files were generated in the current directory
    GENERATED_FILES=$(find . -maxdepth 2 -type f \( -name "*.js" -o -name "*.py" -o -name "*.java" -o -name "*.ts" \) -newer .gemini/settings.json 2>/dev/null || echo "")

    if [ -n "$GENERATED_FILES" ]; then
      echo "✅ Generated files found:"
      echo "$GENERATED_FILES"

      # Move generated files to the generated directory
      mkdir -p generated
      for file in $GENERATED_FILES; do
        if [ -f "$file" ] && [[ "$file" != "./generated/"* ]]; then
          echo "📁 Moving $file to generated/"
          mv "$file" "generated/"
        fi
      done

      # List final generated files
      echo "📋 Final generated files:"
      ls -la generated/ || echo "No files in generated directory"

      # Store information for next steps
      echo "has_generated_files=true" >> $GITHUB_OUTPUT
      echo "generated_count=$(ls generated/ | wc -l)" >> $GITHUB_OUTPUT
    else
      echo "⚠️ No generated files found"
      echo "📄 Checking Gemini CLI output:"
      cat "generated/${{ steps.generate.outputs.feature_name }}_output.txt" || echo "No output file found"
      echo "has_generated_files=false" >> $GITHUB_OUTPUT
    fi
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

### Step 5: Error Handling and Debugging
Implement comprehensive error handling and debugging:

```yaml
- name: Handle Generation Errors
  if: failure()
  run: |
    echo "❌ Gemini CLI execution failed"
    echo "🔍 Debugging information:"
    echo "- Requirement file: ${{ steps.process.outputs.requirement_file }}"
    echo "- Feature name: ${{ steps.process.outputs.feature_name }}"
    echo "- Gemini CLI version: $(gemini --version 2>/dev/null || echo 'Not installed')"
    echo "- API key configured: $([[ -n "$GEMINI_API_KEY" ]] && echo 'Yes' || echo 'No')"
    echo "- Working directory: $(pwd)"
    echo "- .gemini directory exists: $([ -d .gemini ] && echo 'Yes' || echo 'No')"

    # Show Gemini CLI configuration
    echo "📋 Gemini CLI configuration:"
    cat .gemini/settings.json 2>/dev/null || echo "No settings.json found"

    # Show any output files
    echo "📄 Output files:"
    ls -la generated/ 2>/dev/null || echo "No generated directory"

    # Show recent log files if any
    echo "📝 Recent logs:"
    find . -name "*.log" -newer .gemini/settings.json 2>/dev/null | head -5 | xargs cat 2>/dev/null || echo "No log files found"

    # Create issue for failed generation
    gh issue create \
      --title "🤖 Gemini CLI Integration Failed: ${{ steps.process.outputs.feature_name }}" \
      --body "**Workflow Run**: [${{ github.run_id }}](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})

      **Requirement File**: \`${{ steps.process.outputs.requirement_file }}\`

      **Error**: Gemini CLI execution failed. Check workflow logs for detailed debugging information.

      **Next Steps**:
      - Verify API key configuration
      - Check Gemini CLI version compatibility
      - Review requirement file format" \
      --label "bug" \
      --label "gemini-cli" \
      --label "ai-generation"
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

## ✅ Acceptance Criteria

### Functional Requirements
- [ ] Official Gemini CLI installs successfully in GitHub Actions
- [ ] Non-interactive mode works correctly in CI environment
- [ ] API key authentication is secure and functional
- [ ] Code generation produces actual files or clear output
- [ ] Generated content is captured and organized properly
- [ ] Error handling provides actionable debugging information

### Technical Requirements
- [ ] Gemini CLI version compatibility verification
- [ ] Proper .gemini/settings.json configuration
- [ ] YOLO mode enables automated file operations
- [ ] File discovery and organization system
- [ ] Integration with existing workflow outputs
- [ ] Comprehensive logging and error reporting

## 🧪 Testing Steps

### Installation Testing
1. **Gemini CLI Installation**
   ```bash
   # Test installation
   npm install -g @google/gemini-cli
   gemini --version
   # Should return version number
   ```

2. **Configuration Testing**
   ```bash
   # Test configuration creation
   mkdir -p .gemini
   echo '{"selectedAuthType": "USE_GEMINI", "approvalMode": "YOLO"}' > .gemini/settings.json
   # Should create valid configuration
   ```

### Non-Interactive Mode Testing
1. **Simple Code Generation**
   ```bash
   # Test with simple requirement
   echo "Create a hello world function in JavaScript" | GEMINI_API_KEY="your-key" gemini
   # Should generate code or provide clear output
   ```

2. **File Operation Testing**
   ```bash
   # Test file creation capabilities
   echo "Create a new file called test.js with a simple function" | GEMINI_API_KEY="your-key" gemini
   # Should create actual files
   ```

### Error Scenario Testing
1. **Authentication Errors**
   - Invalid API key format
   - Missing API key
   - Expired or invalid key

2. **Configuration Errors**
   - Missing .gemini directory
   - Invalid settings.json
   - Permission issues

3. **Input Errors**
   - Empty requirement
   - Malformed input
   - Unsupported request types

## 📚 Documentation Updates
- [ ] Document official Gemini CLI integration approach
- [ ] Add non-interactive mode configuration guide
- [ ] Document .gemini/settings.json configuration options
- [ ] Add troubleshooting guide for common integration issues
- [ ] Document file discovery and organization process

## 🔗 Related Tasks
- **Previous**: Task 02 - GitHub Actions Workflow
- **Next**: Task 04 - End-to-End Testing
- **Related**: Task 05 - PR Creation Enhancement

## 📝 Key Insights and Notes
- **Official Tool**: Using Google's official Gemini CLI provides better reliability and support
- **Non-Interactive Mode**: Built-in CI/CD support eliminates need for custom API integration
- **YOLO Mode**: Required for automated file operations in CI environment
- **File Operations**: Gemini CLI can directly create and modify files
- **Error Handling**: Built-in retry mechanisms and comprehensive logging
- **Version Compatibility**: Lock to specific Gemini CLI version for consistency

## 🚀 Advantages of This Approach
1. **Reduced Complexity**: No need to implement custom Gemini API integration
2. **Better Error Handling**: Leverages Google's robust error handling and retry logic
3. **Feature Rich**: Access to all Gemini CLI capabilities (tools, MCP, etc.)
4. **Official Support**: Backed by Google with regular updates and improvements
5. **Proven Reliability**: Used by Google's own teams and community

## ✅ Definition of Done
- [ ] Official Gemini CLI is properly installed and configured
- [ ] Non-interactive mode works correctly in GitHub Actions
- [ ] API key authentication is secure and functional
- [ ] File generation and discovery system works reliably
- [ ] Error handling provides actionable debugging information
- [ ] Integration is ready for end-to-end testing with real requirements
