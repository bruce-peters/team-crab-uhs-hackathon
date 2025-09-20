# Development Guide

This document provides detailed technical information for developers working on the Canvas AI Study Assistant.

## 🏗️ Technical Architecture

### Chrome Extension Structure

The extension follows Chrome's Manifest V3 architecture with these key components:

```
Extension Architecture:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Content Script    │    │  Background Script  │    │   Popup Interface   │
│                 │    │                 │    │                 │
│ - Dashboard UI      │    │ - API calls         │    │ - Settings UI       │
│ - Canvas injection  │◄──►│ - Message handling  │◄──►│ - Configuration     │
│ - User interaction  │    │ - Notifications     │    │ - API key management│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        
         ▼                        ▼                        
┌─────────────────┐    ┌─────────────────┐               
│   Canvas LMS    │    │   Gemini AI     │               
│                 │    │                 │               
│ - Assignments   │    │ - Study plans   │               
│ - Courses       │    │ - Assignment help│               
│ - User data     │    │ - AI responses  │               
└─────────────────┘    └─────────────────┘               
```

### Message Passing System

The extension uses Chrome's message passing API for communication:

```typescript
// Message Types
interface ExtensionMessage {
  type: 'GET_ASSIGNMENTS' | 'GET_COURSES' | 'GEMINI_QUERY' | 'SETTINGS_UPDATE';
  payload?: unknown;
}

// Response Format
interface ExtensionResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}
```

### TypeScript Configuration

#### Key Configuration Files

**tsconfig.app.json** - Main application TypeScript config
```json
{
  "compilerOptions": {
    "types": ["chrome"],  // Essential for Chrome extension APIs
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "target": "ES2022",
    "module": "ESNext",
    "jsx": "react-jsx"
  }
}
```

**vite-env.d.ts** - Type declarations
```typescript
/// <reference types="vite/client" />
/// <reference types="chrome" />  // Chrome extension type support
```

## 🔧 Development Workflow

### 1. Setting Up Development Environment

```bash
# Install dependencies
npm install

# Build extension (required before loading in Chrome)
npm run build

# Load extension in Chrome:
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the frontend/dist/ folder
```

### 2. Development Process

```bash
# Make code changes in src/

# Rebuild extension
npm run build

# Reload extension in chrome://extensions/
# (Click the reload icon on your extension)

# Test your changes on Canvas pages
```

### 3. Debugging Chrome Extension

#### Background Script Debugging
1. Go to `chrome://extensions/`
2. Find your extension
3. Click "Service Worker" link
4. Use the DevTools console to debug background script

#### Content Script Debugging  
1. Open Canvas page where extension is active
2. Open DevTools (F12)
3. Content script errors appear in the main console
4. Use `console.log()` for debugging

#### Popup Debugging
1. Right-click extension icon → "Inspect popup"
2. Popup DevTools will open
3. Debug React components and state

## 📁 File Structure Deep Dive

### Core Extension Files

```
src/extension/
├── background/
│   └── background.ts          # Service worker - handles all API calls
├── content/
│   ├── content.ts            # Injected into Canvas pages
│   └── content.css           # Styles for injected content
├── popup/
│   ├── popup.tsx             # Entry point for popup
│   └── SettingsPage.tsx      # Main settings interface
├── dashboard/
│   ├── dashboard.tsx         # Entry point for dashboard
│   └── components/           # Dashboard React components
├── services/
│   ├── canvasApi.ts         # Canvas LMS API integration
│   └── geminiApi.ts         # Google Gemini AI integration
└── types/
    ├── index.ts             # Extension-specific types
    └── canvas.ts            # Canvas API types
```

### React Components Structure

```
src/components/ui/           # Shared UI components (shadcn/ui)
├── card.tsx                # Card component
├── button.tsx              # Button component
└── ...                     # Other UI components

src/extension/dashboard/components/
├── Dashboard.tsx           # Main dashboard component
├── AssignmentHelpModal.tsx # AI assignment help interface
├── StudyPlanModal.tsx      # AI study plan generator
└── ...                     # Other dashboard components
```

## 🔌 API Integration

### Canvas API Integration

**Location**: `src/extension/services/canvasApi.ts`

```typescript
class CanvasAPI {
  constructor(private baseUrl: string) {}

  async getAssignments(): Promise<AssignmentWithCourse[]> {
    // Fetches assignments from all courses
    // Combines assignment data with course information
  }

  async getCourses(): Promise<CanvasCourse[]> {
    // Fetches user's enrolled courses
  }
}
```

**Key Points**:
- Uses Canvas REST API
- Automatically detects Canvas URL from page
- Handles authentication via existing Canvas session
- Combines data from multiple API endpoints

### Gemini AI Integration

**Location**: `src/extension/services/geminiApi.ts`

```typescript
class GeminiAPI {
  constructor(private apiKey: string) {}

  async generateStudyPlan(assignments: AssignmentWithCourse[]): Promise<string> {
    // Generates personalized study plan based on assignments
  }

  async getAssignmentHelp(assignment: AssignmentWithCourse, question: string): Promise<string> {
    // Provides AI assistance for specific assignment questions
  }
}
```

**Key Points**:
- Uses Google Gemini API
- Requires user-provided API key
- Handles AI prompt engineering
- Processes natural language responses

## 🎨 UI Development

### Styling System

- **Primary**: Tailwind CSS for utility-first styling
- **Components**: shadcn/ui for consistent, accessible components
- **Theme**: Supports light/dark themes (auto-detection)

### Component Development Pattern

```typescript
// Example component structure
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { ExtensionMessage, ExtensionResponse } from '../types';

export const ExampleComponent: React.FC = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Component initialization
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Communicate with background script
      const response: ExtensionResponse = await chrome.runtime.sendMessage({
        type: 'GET_ASSIGNMENTS'
      } as ExtensionMessage);

      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        {loading ? 'Loading...' : 'Content here'}
      </CardContent>
    </Card>
  );
};
```

## 🔧 Build System

### Vite Configuration

**Location**: `vite.config.ts`

Key configuration for Chrome extension:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',                    // Standard web app
        background: 'src/extension/background/background.ts',
        content: 'src/extension/content/content.ts',
        popup: 'src/extension/popup/popup.tsx',
        dashboard: 'src/extension/dashboard/dashboard.tsx',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep extension files with specific names
          if (['background', 'content'].includes(chunkInfo.name || '')) {
            return `${chunkInfo.name}.js`;
          }
          return 'assets/[name]-[hash].js';
        }
      }
    }
  }
});
```

### Build Outputs

```
dist/
├── background.js              # Background service worker
├── content.js                 # Content script
├── popup.html                 # Popup page
├── dashboard.html             # Dashboard page
├── manifest.json              # Extension manifest
└── assets/                    # CSS, React components, etc.
```

## 🧪 Testing Strategies

### Manual Testing Checklist

1. **Extension Loading**
   - [ ] Extension loads without errors
   - [ ] All files built correctly
   - [ ] Manifest.json is valid

2. **Canvas Integration**
   - [ ] Dashboard appears on Canvas pages
   - [ ] Assignments load correctly
   - [ ] Course data is accurate

3. **Settings/Popup**
   - [ ] Popup opens correctly
   - [ ] Settings save and load
   - [ ] API key validation works

4. **AI Features**
   - [ ] Study plan generation works
   - [ ] Assignment help responds correctly
   - [ ] Error handling for invalid API keys

### Console Debugging

```javascript
// Background script debugging (chrome://extensions/ -> Service Worker)
console.log('Background script loaded');

// Content script debugging (Canvas page DevTools)
console.log('Content script injected');

// Popup debugging (Right-click extension icon -> Inspect popup)
console.log('Popup opened');
```

## 🚨 Common Issues and Solutions

### TypeScript Errors

**Issue**: `Cannot find name 'chrome'`
**Solution**: Ensure `/// <reference types="chrome" />` is in `vite-env.d.ts` and `"types": ["chrome"]` is in `tsconfig.app.json`

**Issue**: Parameter implicitly has 'any' type
**Solution**: Add proper type annotations for Chrome API callbacks:
```typescript
chrome.storage.sync.get(['settings'], (result: { [key: string]: any }) => {
  // Handle result
});
```

### Build Issues

**Issue**: Extension files not generating correctly
**Solution**: Check Vite configuration `rollupOptions.input` and `output.entryFileNames`

**Issue**: Content script not injecting
**Solution**: Verify `manifest.json` content_scripts configuration and file paths

### Runtime Issues

**Issue**: Background script not receiving messages
**Solution**: Ensure `return true;` in message listener for async responses

**Issue**: API calls failing
**Solution**: Check network permissions in `manifest.json` and Canvas CORS settings

## 📚 Additional Resources

### Chrome Extension Development
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/migrating/)
- [Message Passing](https://developer.chrome.com/docs/extensions/mv3/messaging/)

### Canvas API
- [Canvas API Documentation](https://canvas.instructure.com/doc/api/)
- [Canvas API Live Reference](https://canvas.instructure.com/doc/api/live)

### Gemini AI
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)

### Frontend Technologies
- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)