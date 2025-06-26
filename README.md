# Gemini Auto Coder

Automated code generation using Gemini CLI and GitHub Actions.

## 🎯 Quick Start
1. Add requirement file to `requirements/`
2. Commit and push
3. GitHub Actions will generate code and create PR

## 🚧 Status
Under Development - MVP Phase

## 🏗️ How It Works

```
Requirement.md → GitHub Actions → Gemini CLI → Generated Code → Auto PR
```

## 📁 Project Structure

```
├── requirements/          # Input: requirement files
├── generated/            # Output: AI generated code
├── .github/workflows/    # GitHub Actions workflows
├── docs/                # Project documentation
└── tasks/               # Task breakdown files
```

## 🚀 Setup

### Prerequisites
- GitHub repository with Actions enabled
- Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Configuration
1. Add `GEMINI_API_KEY` to GitHub Secrets
2. Create requirement file in `requirements/`
3. Commit and push to trigger workflow

## 📝 Example Usage

```bash
# Create requirement file
echo "# Calculator
Create a JavaScript function that adds two numbers" > requirements/feature.md

# Commit and push
git add requirements/feature.md
git commit -m "Add calculator requirement"
git push

# GitHub Actions will automatically:
# 1. Generate code using Gemini CLI
# 2. Create new branch with generated code
# 3. Submit pull request for review
```

## 📚 Documentation

See `docs/` directory for detailed documentation:
- Core MVP Design
- Technical Flow
- Task Breakdown

## 🎯 MVP Goals

- **Automation**: End-to-end process without manual intervention
- **Quality**: Generated code compiles and meets basic standards
- **Speed**: <5 minutes from requirement to PR

---

**Status**: MVP Development Phase
**Version**: 1.0.0
