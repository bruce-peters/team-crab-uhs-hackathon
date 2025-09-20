# 🎓 Canvas AI Study Assistant - Setup & Usage Instructions

## Overview
The Canvas AI Study Assistant is a Chrome browser extension that integrates with Canvas LMS to help students manage their assignments using AI-powered features. It provides personalized study plans, assignment help, and a comprehensive dashboard to track your academic progress.

## Features
- ✨ **Smart Dashboard**: View all your assignments in one place with intelligent prioritization
- 🤖 **AI Study Plans**: Generate personalized study schedules using Gemini AI
- 💬 **Assignment Help**: Get AI-powered assistance for specific assignments
- 📅 **Due Date Tracking**: Visual indicators for upcoming and overdue assignments
- 🔔 **Smart Notifications**: Reminders for upcoming deadlines
- 🎨 **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## Prerequisites
1. **Google Chrome Browser** (or Chromium-based browser)
2. **Canvas LMS Account** at your educational institution
3. **Gemini API Key** (free from Google AI Studio)
4. **Node.js** (version 16 or higher) for development

## Installation & Setup

### Step 1: Clone and Build the Extension
```bash
# Clone the repository
git clone https://github.com/bruce-peters/team-crab-uhs-hackathon.git
cd team-crab-uhs-hackathon/frontend

# Install dependencies
npm install

# Build the extension
npm run build
```

### Step 2: Load Extension in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `frontend/dist` folder
5. The extension should now appear in your extensions list

### Step 3: Get Your Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key (starts with "AIza...")
5. Keep this key secure - you'll need it for setup

### Step 4: Configure the Extension
1. Click the extension icon in Chrome's toolbar
2. Enter your Gemini API key in the settings
3. (Optional) Enter your Canvas URL if auto-detection doesn't work
4. Configure notification preferences
5. Click "Save Settings"

## Usage Guide

### Accessing the Dashboard
1. **Method 1**: Navigate to any Canvas page and look for "AI Study Assistant" in the navigation menu
2. **Method 2**: Click the extension icon and use the settings popup

### Dashboard Features

#### 📝 Assignment Overview
- View all pending and completed assignments
- Color-coded priority indicators:
  - 🔴 **Red**: Overdue assignments
  - 🟠 **Orange**: Due today or tomorrow
  - 🟡 **Yellow**: Due within 3 days
  - 🟢 **Green**: Due later

#### 🤖 AI Study Plan Generation
1. Click "Generate Study Plan" on the dashboard
2. AI analyzes your assignments and creates a personalized schedule
3. Includes time allocation, study strategies, and prioritization
4. Can be regenerated as your assignments change

#### 💬 Assignment Help
1. Click "Get AI Help" on any assignment card
2. Ask specific questions about the assignment
3. Use quick question templates or write custom queries
4. Get educational guidance without direct answers

### Settings Configuration

#### Required Settings
- **Gemini API Key**: Enable AI features (required for study plans and assignment help)

#### Optional Settings
- **Canvas URL**: Auto-detected from current page, but can be manually set
- **Enable Notifications**: Browser notifications for upcoming deadlines
- **Study Reminders**: Periodic reminders to check your assignments
- **Theme**: Light, dark, or auto (system) theme

## API Integration Details

### Canvas API
The extension uses Canvas's REST API to fetch:
- User's enrolled courses
- Assignment details and due dates
- Submission status
- Course information

### Gemini AI API
Integration with Google's Gemini AI for:
- Generating personalized study plans
- Providing assignment-specific help
- Educational guidance and study strategies

## Development Guide

### Project Structure
```
frontend/
├── src/
│   ├── extension/
│   │   ├── background/     # Service worker for API calls
│   │   ├── content/        # Canvas page injection
│   │   ├── popup/          # Settings interface
│   │   ├── dashboard/      # Main dashboard components
│   │   ├── services/       # API integrations
│   │   └── types/          # TypeScript definitions
│   ├── components/ui/      # Shared UI components
│   └── lib/               # Utilities
├── public/
│   ├── manifest.json      # Extension manifest
│   ├── popup.html         # Popup page
│   └── dashboard.html     # Dashboard page
└── dist/                  # Built extension files
```

### Available Scripts
```bash
# Development server (for testing components)
npm run dev

# Build extension
npm run build

# Lint code
npm run lint

# Type checking
npx tsc --noEmit
```

### Key Technologies
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for building
- **Chrome Extensions Manifest V3**
- **shadcn/ui** component library

## Troubleshooting

### Common Issues

#### Extension Not Loading
- Ensure you selected the `dist` folder, not the project root
- Check Chrome's developer console for errors
- Verify all files were built correctly

#### Canvas Integration Not Working
- Make sure you're logged into Canvas
- Check that Canvas URLs match the extension's host permissions
- Try refreshing the Canvas page after installing

#### AI Features Not Working
- Verify your Gemini API key is correct and has sufficient quota
- Check the browser console for API errors
- Ensure you have internet connectivity

#### No Assignments Showing
- Confirm you're enrolled in active courses
- Check that courses have published assignments
- Try the refresh button on the dashboard

### Debug Mode
1. Open Chrome DevTools (F12)
2. Go to the "Extension" or "Sources" tab
3. Check console logs for detailed error messages
4. Inspect network requests to Canvas and Gemini APIs

## Privacy & Security

### Data Handling
- Assignment data is fetched directly from Canvas (no external storage)
- AI queries are sent to Google's Gemini API with your consent
- Settings are stored locally in Chrome's extension storage
- No personal data is collected or transmitted to third parties

### API Key Security
- API keys are stored locally and encrypted by Chrome
- Keys are only used for authenticated API requests
- Never share your API keys with others
- Revoke and regenerate keys if compromised

## Limitations & Known Issues

### Current Limitations
- Only works with Canvas LMS (not other learning management systems)
- Requires Gemini API key for AI features
- Chrome/Chromium browsers only
- English language support only

### Planned Improvements
- Support for additional LMS platforms
- Offline mode for basic features
- Mobile browser support
- Multi-language support
- Advanced analytics and insights

## Support & Contributing

### Getting Help
1. Check this documentation first
2. Look for existing issues in the GitHub repository
3. Create a new issue with detailed information:
   - Browser version
   - Extension version
   - Steps to reproduce
   - Error messages (with screenshots)

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request with a clear description

### Development Environment Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Build for testing
npm run build
```

## License
This project is open source and available under the MIT License.

## Changelog

### Version 1.0.0
- Initial release
- Canvas integration for assignment fetching
- Gemini AI integration for study plans and help
- React-based dashboard with modern UI
- Chrome extension with popup settings
- Assignment prioritization and tracking
- Notification system for due dates

---

**Note**: This extension is designed to supplement your learning experience, not replace active engagement with your coursework. Always verify AI suggestions with your instructors and use the tool responsibly.

For the latest updates and documentation, visit: [GitHub Repository](https://github.com/bruce-peters/team-crab-uhs-hackathon)