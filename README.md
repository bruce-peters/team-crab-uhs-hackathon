# 🎓 Canvas AI Study Assistant

A Chrome browser extension that integrates with Canvas LMS to help students manage their assignments using AI-powered features. Built with React, TypeScript, and powered by Google's Gemini AI.

There is no hosted demo: this is a browser extension, so it runs in your own Chrome and reads assignments from the Canvas account you are logged into. Build it and load it unpacked as described below.

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
- Node.js 20.19+ or 22.12+ (required by Vite 7) and npm
- Canvas LMS account at your educational institution (on a `*.instructure.com` or `*.canvaslms.com` domain)
- Gemini API key (free from [Google AI Studio](https://aistudio.google.com/app/apikey)), needed only for the AI study plan and assignment help buttons

### Installation

1. **Clone and setup the project**
   ```bash
   git clone https://github.com/bruce-peters/team-crab-uhs-hackathon.git
   cd team-crab-uhs-hackathon/frontend
   npm ci
   npm run build
   ```
   The build writes the unpacked extension to `frontend/dist/` (`manifest.json`, `background.js`, `content.js`, `popup.html`, `dashboard.html`, `assets/`).

2. **Load the extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked" and select the `frontend/dist` folder

3. **Configure the extension**
   - Click the extension icon in Chrome's toolbar
   - Enter your Gemini API key
   - Optionally set your Canvas URL (if left empty, the dashboard uses the Canvas site it is opened on)
   - Save your settings

4. **Use it**: open any page on your Canvas site while logged in. The dashboard is injected at the top of the page.

### Keys and configuration
There is no `.env` file. Nothing is read from environment variables at build time:
- **Gemini API key**: entered in the extension popup and stored in `chrome.storage.sync`. It is sent only to `generativelanguage.googleapis.com`.
- **Canvas**: no API token is needed. The extension calls the Canvas REST API (`/api/v1/...`) with your existing logged-in Canvas session.

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
│   └── manifest.json      # Extension manifest (copied to dist/ as-is)
├── popup.html             # Popup page entry (bundled by Vite into dist/popup.html)
├── dashboard.html         # Dashboard page entry (bundled into dist/dashboard.html)
└── dist/                  # Built extension files (load this folder in Chrome)
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
# Development server (for testing components): open http://localhost:5173/popup.html
# Chrome extension APIs are not available there, so the dashboard page can only show its error state.
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
- The Gemini API key is stored in Chrome's extension storage (`chrome.storage.sync`), which syncs with your Chrome profile

## ⚠️ Notes and limitations

- **Tested here**: `npm ci`, `npm run build`, and `npm run lint` pass on Node 22. The built `dist/` was loaded unpacked in headless Chromium: the popup renders, and on a mocked `*.instructure.com` page the injected dashboard lists assignments returned by mocked Canvas API responses.
- **Not tested here**: a real Canvas login and real Gemini responses (no account or API key was available). The Gemini model is set in `src/extension/services/geminiApi.ts` (`gemini-flash-latest`); change it there if Google renames it.
- **Notifications do not fire yet**: `background.ts` calls `chrome.notifications` with `icons/icon48.png`, but the manifest has no `notifications` permission and the repo has no icon files.
- The **Theme** and **Study reminders** settings are saved but not used by any code yet.
- The extension cannot be hosted as a static website: the dashboard and popup depend on Chrome extension APIs (`chrome.runtime`, `chrome.storage`).

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
