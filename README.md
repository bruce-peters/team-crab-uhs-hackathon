# 🎓 Canvas AI Study Assistant

A Chrome browser extension that integrates with Canvas LMS to help students manage their assignments using AI-powered features. Built with React, TypeScript, and powered by Google's Gemini AI.

## 🌟 Features

- **Smart Dashboard**: View all your assignments in one place with intelligent prioritization
- **AI Study Plans**: Generate personalized study schedules using Gemini AI
- **Assignment Help**: Get AI-powered assistance for specific assignments
- **Due Date Tracking**: Visual indicators for upcoming and overdue assignments
- **Smart Notifications**: Reminders for upcoming deadlines
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Google Chrome Browser (or Chromium-based browser)
- Node.js (version 16 or higher)
- Canvas LMS account at your educational institution
- Gemini API key (free from [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone and setup the project**
   ```bash
   git clone https://github.com/bruce-peters/team-crab-uhs-hackathon.git
   cd team-crab-uhs-hackathon/frontend
   npm install
   npm run build
   ```

2. **Load the extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked" and select the `frontend/dist` folder

3. **Configure the extension**
   - Click the extension icon in Chrome's toolbar
   - Enter your Gemini API key
   - Optionally set your Canvas URL
   - Save your settings

For detailed setup instructions, see [instructions.md](./instructions.md).

## 🏗️ Architecture

### Project Structure
```
frontend/
├── src/
│   ├── extension/
│   │   ├── background/     # Service worker for API calls
│   │   ├── content/        # Canvas page injection
│   │   ├── popup/          # Settings interface
│   │   ├── dashboard/      # Main dashboard components
│   │   ├── services/       # API integrations (Canvas, Gemini)
│   │   └── types/          # TypeScript definitions
│   ├── components/ui/      # Shared UI components (shadcn/ui)
│   └── lib/               # Utilities
├── public/
│   ├── manifest.json      # Extension manifest
│   ├── popup.html         # Popup page
│   └── dashboard.html     # Dashboard page
└── dist/                  # Built extension files
```

### Tech Stack
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite
- **Extension API**: Chrome Extensions Manifest V3
- **AI Integration**: Google Gemini API
- **LMS Integration**: Canvas LMS API

## 🛠️ Development

### Available Scripts
```bash
# Development server (for testing components)
npm run dev

# Build extension for production
npm run build

# Lint code
npm run lint

# Type checking
npx tsc --noEmit
```

### Key Files
- `src/extension/background/background.ts` - Service worker handling API calls and notifications
- `src/extension/content/content.ts` - Content script injected into Canvas pages
- `src/extension/popup/SettingsPage.tsx` - Extension settings interface
- `src/extension/services/canvasApi.ts` - Canvas LMS API integration
- `src/extension/services/geminiApi.ts` - Google Gemini AI API integration
- `public/manifest.json` - Chrome extension configuration

### Extension Components
1. **Background Service Worker**: Handles API calls, manages settings, and sends notifications
2. **Content Script**: Injects dashboard into Canvas pages
3. **Popup**: Settings and configuration interface
4. **Dashboard**: Main user interface for viewing assignments and getting AI help

## 🔒 Privacy & Security

- Assignment data is fetched directly from Canvas (no external storage)
- AI queries are sent to Google's Gemini API with your consent
- Settings are stored locally in Chrome's extension storage
- No personal data is collected or transmitted to third parties
- API keys are stored securely and encrypted by Chrome

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup
```bash
# Clone your fork
git clone https://github.com/your-username/team-crab-uhs-hackathon.git
cd team-crab-uhs-hackathon/frontend

# Install dependencies
npm install

# Start development
npm run dev
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [instructions.md](./instructions.md) for detailed setup and usage
2. Look through existing [Issues](https://github.com/bruce-peters/team-crab-uhs-hackathon/issues)
3. Create a new issue with detailed information about your problem

## 🏆 Acknowledgments

- Built during the UHS Hackathon
- Powered by Google's Gemini AI
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)

---

**Note**: This extension is designed to supplement your learning experience, not replace active engagement with your coursework. Always verify AI suggestions with your instructors and use the tool responsibly.
