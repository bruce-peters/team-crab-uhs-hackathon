# Contributing to Canvas AI Study Assistant

Thank you for your interest in contributing to the Canvas AI Study Assistant! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- Google Chrome Browser
- Git
- Basic knowledge of TypeScript, React, and Chrome Extensions

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/team-crab-uhs-hackathon.git
   cd team-crab-uhs-hackathon/frontend
   npm install
   ```

2. **Development Environment**
   ```bash
   # Build the extension
   npm run build

   # Load the extension in Chrome for testing
   # Go to chrome://extensions/, enable Developer mode, and load the dist/ folder
   ```

3. **Making Changes**
   ```bash
   # Create a feature branch
   git checkout -b feature/your-feature-name

   # Make your changes and test
   npm run build
   npm run lint

   # Commit and push
   git add .
   git commit -m "Description of your changes"
   git push origin feature/your-feature-name
   ```

## 🏗️ Architecture Overview

### Extension Components

1. **Background Service Worker** (`src/extension/background/background.ts`)
   - Handles API communications with Canvas and Gemini
   - Manages extension settings and storage
   - Sends notifications for upcoming assignments
   - Processes messages from content scripts and popup

2. **Content Script** (`src/extension/content/content.ts`)
   - Injected into Canvas pages
   - Creates and manages the dashboard UI
   - Communicates with background script for data

3. **Popup Interface** (`src/extension/popup/`)
   - Settings configuration interface
   - Accessed by clicking the extension icon
   - Handles API key management and preferences

4. **Dashboard Components** (`src/extension/dashboard/`)
   - Main user interface components
   - Assignment list, study plans, and help modals
   - Built with React and Tailwind CSS

### API Services

- **Canvas API** (`src/extension/services/canvasApi.ts`): Fetches assignments and course data
- **Gemini AI API** (`src/extension/services/geminiApi.ts`): Generates study plans and provides assignment help

## 📝 Code Style and Standards

### TypeScript
- Use strict TypeScript with proper type definitions
- Prefer interfaces over types for object shapes  
- Always type Chrome API callbacks properly
- Use meaningful variable and function names

### React Components
- Use functional components with hooks
- Follow the existing component structure and naming
- Use TypeScript for props and state
- Implement proper error handling

### Chrome Extension Best Practices
- Follow Manifest V3 guidelines
- Use proper message passing between scripts
- Handle permissions appropriately
- Implement proper error handling for API calls

### Code Formatting
```bash
# We use ESLint for code formatting
npm run lint
```

## 🧪 Testing

### Manual Testing
1. **Build and Load Extension**
   ```bash
   npm run build
   # Load dist/ folder in Chrome extensions
   ```

2. **Test Extension Features**
   - Navigate to a Canvas page
   - Verify dashboard injection works
   - Test settings popup functionality
   - Check API integrations (Canvas and Gemini)

3. **Test Different Scenarios**
   - Empty Canvas course
   - Canvas course with many assignments
   - Different due date scenarios
   - API error conditions

### Browser Console Testing
- Check for console errors in background script
- Verify content script loads correctly
- Test message passing between components

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment Information**
   - Chrome version
   - Extension version
   - Operating system

2. **Steps to Reproduce**
   - Detailed steps to reproduce the issue
   - Expected vs actual behavior

3. **Additional Information**
   - Browser console errors
   - Screenshots if applicable
   - Network tab information for API issues

## 💡 Feature Requests

When suggesting new features:

1. **Describe the Feature**
   - Clear description of the proposed feature
   - Use cases and benefits

2. **Implementation Ideas**
   - Technical approach (if you have ideas)
   - Potential challenges or considerations

3. **Priority and Scope**
   - Is this a nice-to-have or essential feature?
   - Does it fit with the current project goals?

## 🔧 Common Development Tasks

### Adding a New API Endpoint
1. Update the appropriate service file (`canvasApi.ts` or `geminiApi.ts`)
2. Add proper TypeScript types in `src/extension/types/`
3. Handle the new endpoint in background script message handling
4. Update UI components to use the new data

### Adding a New UI Component
1. Create component in appropriate directory
2. Follow existing component patterns and styling
3. Add proper TypeScript props interface  
4. Test component in different scenarios

### Modifying Extension Permissions
1. Update `public/manifest.json`
2. Test that new permissions work correctly
3. Update documentation if needed

## 📚 Useful Resources

### Chrome Extensions
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/migrating/)

### APIs
- [Canvas API Documentation](https://canvas.instructure.com/doc/api/)
- [Google Gemini API](https://ai.google.dev/docs)

### Frontend Development
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 📋 Checklist Before Submitting

- [ ] Code builds without errors (`npm run build`)
- [ ] Code passes linting (`npm run lint`)
- [ ] Extension loads correctly in Chrome
- [ ] All features work as expected
- [ ] No console errors in browser
- [ ] Documentation updated if needed
- [ ] Commit messages are clear and descriptive

## ❓ Questions?

If you have questions about contributing:

1. Check existing issues and discussions
2. Read through the codebase and documentation
3. Create an issue with your question

Thank you for contributing to making this tool better for students! 🎓