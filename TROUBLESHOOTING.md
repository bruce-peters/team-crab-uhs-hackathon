# Troubleshooting Guide

This document helps you resolve common issues when developing or using the Canvas AI Study Assistant.

## 🔧 Development Issues

### TypeScript Compilation Errors

#### Problem: `Cannot find name 'chrome'`
```
error TS2304: Cannot find name 'chrome'
```

**Solution:**
1. Ensure Chrome types are properly configured:
   ```typescript
   // In src/vite-env.d.ts
   /// <reference types="vite/client" />
   /// <reference types="chrome" />
   ```

2. Check `tsconfig.app.json` includes Chrome types:
   ```json
   {
     "compilerOptions": {
       "types": ["chrome"],
       // ... other options
     }
   }
   ```

3. Verify `@types/chrome` is installed:
   ```bash
   npm install --save-dev @types/chrome
   ```

#### Problem: Parameter implicitly has 'any' type
```
error TS7006: Parameter 'result' implicitly has an 'any' type
```

**Solution:** Add proper type annotations for Chrome API callbacks:
```typescript
// Before (causes error)
chrome.storage.sync.get(['settings'], (result) => {
  // ...
});

// After (fixed)
chrome.storage.sync.get(['settings'], (result: { [key: string]: any }) => {
  // ...
});
```

### Build Issues

#### Problem: Extension files not generated
The extension files (background.js, content.js) are missing from dist/ folder.

**Solution:**
1. Check `vite.config.ts` has correct input configuration:
   ```typescript
   rollupOptions: {
     input: {
       background: path.resolve(__dirname, "src/extension/background/background.ts"),
       content: path.resolve(__dirname, "src/extension/content/content.ts"),
       popup: path.resolve(__dirname, "src/extension/popup/popup.tsx"),
       dashboard: path.resolve(__dirname, "src/extension/dashboard/dashboard.tsx"),
     }
   }
   ```

2. Ensure all entry files exist and are valid TypeScript/TSX files.

#### Problem: Build fails with module resolution errors
```
Cannot find module '../types' or its corresponding type declarations
```

**Solution:**
1. Check that all import paths are correct
2. Ensure TypeScript can resolve the paths
3. Verify `baseUrl` and `paths` in `tsconfig.json` are set correctly:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

### Chrome Extension Loading Issues

#### Problem: Extension won't load in Chrome
Error: "Manifest file is missing or unreadable"

**Solution:**
1. Ensure you built the extension: `npm run build`
2. Load the `frontend/dist` folder, not the `frontend` folder
3. Check that `manifest.json` exists in the dist folder
4. Verify manifest.json is valid JSON

#### Problem: Service Worker registration fails
Error in Chrome DevTools: "Service worker registration failed"

**Solution:**
1. Check `background.js` exists in dist folder
2. Verify `manifest.json` points to correct background script:
   ```json
   {
     "background": {
       "service_worker": "background.js"
     }
   }
   ```
3. Check for syntax errors in background script

## 🌐 Runtime Issues

### Canvas Integration Problems

#### Problem: Dashboard doesn't appear on Canvas pages
The extension seems to load but no dashboard appears on Canvas.

**Solution:**
1. Check that you're on a Canvas domain (*.instructure.com or *.canvaslms.com)
2. Verify content script is injecting:
   - Open DevTools on Canvas page
   - Look for console messages from content script
3. Check content script permissions in manifest.json:
   ```json
   {
     "content_scripts": [{
       "matches": [
         "https://*.instructure.com/*",
         "https://*.canvaslms.com/*"
       ],
       "js": ["content.js"]
     }]
   }
   ```

#### Problem: Canvas API calls failing
Error: "Failed to fetch assignments"

**Solution:**
1. Ensure you're logged into Canvas
2. Check network permissions in manifest.json:
   ```json
   {
     "host_permissions": [
       "https://*.instructure.com/*",
       "https://*.canvaslms.com/*"
     ]
   }
   ```
3. Verify Canvas API endpoints are accessible
4. Check browser console for CORS errors

### AI Integration Problems

#### Problem: Gemini API errors
Error: "Gemini API not configured" or "Invalid API key"

**Solution:**
1. Get a valid Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Enter the API key in extension settings (click extension icon)
3. Ensure API key starts with "AIza"
4. Check API key has proper permissions

#### Problem: AI responses are slow or fail
Gemini API requests timeout or return errors.

**Solution:**
1. Check your internet connection
2. Verify API key quotas at [Google AI Studio](https://aistudio.google.com/)
3. Check browser console for specific error messages
4. Try reducing the size of requests (fewer assignments in study plan)

### Settings and Storage Issues

#### Problem: Settings don't save
Settings reset every time the extension is reloaded.

**Solution:**
1. Check storage permissions in manifest.json:
   ```json
   {
     "permissions": ["storage"]
   }
   ```
2. Verify settings are being saved to Chrome storage:
   ```typescript
   chrome.storage.sync.set({ settings: newSettings });
   ```
3. Check for errors in background script console

#### Problem: Extension settings reset after Chrome restart
Settings are lost when browser is closed and reopened.

**Solution:**
1. Ensure using `chrome.storage.sync` not `chrome.storage.local`
2. Check that Chrome sync is enabled for your Google account
3. Verify storage permissions are correct

## 🐛 Debugging Techniques

### Chrome Extension Debugging

#### Background Script Debugging
1. Go to `chrome://extensions/`  
2. Find your extension
3. Click "Service Worker" link
4. Use DevTools console to debug background script
5. Add console.log statements for debugging:
   ```typescript
   console.log('Background script loaded');
   console.log('Received message:', message);
   ```

#### Content Script Debugging
1. Open Canvas page where extension should work
2. Open DevTools (F12)
3. Content script logs appear in main console
4. Check for injection errors:
   ```typescript
   console.log('Content script injected successfully');
   ```

#### Popup Debugging
1. Right-click extension icon
2. Select "Inspect popup"
3. DevTools will open for popup
4. Debug React components and state

### Network Debugging

#### Check API Requests
1. Open DevTools Network tab
2. Perform actions that make API calls
3. Look for failed requests (red status codes)
4. Check request/response details

#### CORS Issues
If you see CORS errors:
1. Verify host_permissions in manifest.json
2. Check that Canvas API allows extension requests
3. Ensure requests include proper headers

### Console Debugging Commands

```javascript
// Check if Chrome APIs are available
console.log('Chrome APIs:', !!window.chrome);

// Check extension storage
chrome.storage.sync.get(null, (items) => {
  console.log('All stored data:', items);
});

// Test message passing
chrome.runtime.sendMessage({type: 'GET_ASSIGNMENTS'}, (response) => {
  console.log('Response:', response);
});

// Check active tab
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  console.log('Current tab:', tabs[0]);
});
```

## 📞 Getting Help

### Before Asking for Help

1. **Check this troubleshooting guide** for your specific issue
2. **Look at browser console** for error messages
3. **Try a clean build**: Delete `dist/` folder and run `npm run build`
4. **Test in incognito mode** to rule out other extensions
5. **Check Chrome version** (extension requires Chrome 88+)

### When Reporting Issues

Include the following information:

**Environment:**
- Chrome version: `chrome://version/`
- Extension version: Check `manifest.json` in dist folder  
- Operating system
- Canvas domain (e.g., myschool.instructure.com)

**Error Details:**
- Exact error message
- Steps to reproduce
- Expected vs actual behavior
- Console logs (from DevTools)
- Screenshots if UI-related

**Have You Tried:**
- [ ] Clean build (`rm -rf dist && npm run build`)
- [ ] Reloading extension in Chrome
- [ ] Testing in incognito mode
- [ ] Checking browser console for errors

### Useful Chrome URLs

- `chrome://extensions/` - Manage extensions
- `chrome://inspect/#service-workers` - Debug service workers
- `chrome://version/` - Check Chrome version
- `chrome://flags/` - Chrome experimental features

## 🔍 Common Error Patterns

### TypeScript Errors
- `TS2304`: Missing type declarations → Add proper imports/references
- `TS7006`: Implicit any → Add explicit type annotations
- `TS2307`: Cannot find module → Check import paths

### Chrome Extension Errors
- `Extension manifest must request permission` → Add to manifest.json
- `Cannot access chrome://` → Invalid URL in extension
- `Service worker registration failed` → Check background script syntax

### Runtime Errors
- `chrome.* is undefined` → Check if running in extension context
- `Failed to fetch` → Check network permissions and CORS
- `Storage quota exceeded` → Clean up stored data

Remember: Most issues can be resolved by checking browser DevTools console and following the error messages! 🛠️