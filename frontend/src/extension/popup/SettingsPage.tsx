import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';
import type { ExtensionSettings } from '../types';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<ExtensionSettings>({
    geminiApiKey: '',
    canvasUrl: '',
    enableNotifications: true,
    studyReminders: true,
    theme: 'auto'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Load settings from Chrome storage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['settings'], (result: { [key: string]: any }) => {
        if (result.settings) {
          setSettings(result.settings);
        }
      });
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Validate settings
      if (settings.geminiApiKey && !settings.geminiApiKey.startsWith('AIza')) {
        throw new Error('Invalid Gemini API key format');
      }

      if (settings.canvasUrl && !settings.canvasUrl.startsWith('https://')) {
        throw new Error('Canvas URL must start with https://');
      }

      // Save to Chrome storage
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.sync.set({ settings });

        // Notify background script of settings update
        chrome.runtime.sendMessage({
          type: 'SETTINGS_UPDATE',
          payload: settings
        });
      }

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof ExtensionSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const openGeminiInstructions = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({
        url: 'https://aistudio.google.com/app/apikey'
      });
    } else {
      window.open('https://aistudio.google.com/app/apikey', '_blank');
    }
  };

  return (
    <div className="w-96 p-4 bg-background text-foreground">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            ✨ AI Study Assistant Settings
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Gemini API Key */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Gemini API Key *
            </label>
            <input
              type="password"
              value={settings.geminiApiKey}
              onChange={(e) => handleInputChange('geminiApiKey', e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={openGeminiInstructions}
              className="text-xs text-blue-600 hover:underline"
            >
              How to get Gemini API key →
            </button>
          </div>

          {/* Canvas URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Canvas URL (Optional)
            </label>
            <input
              type="url"
              value={settings.canvasUrl}
              onChange={(e) => handleInputChange('canvasUrl', e.target.value)}
              placeholder="https://yourschool.instructure.com"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">
              Leave empty to auto-detect from current Canvas page
            </p>
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => handleInputChange('enableNotifications', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Enable notifications</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.studyReminders}
                onChange={(e) => handleInputChange('studyReminders', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Study reminders</span>
            </label>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleInputChange('theme', e.target.value as 'light' | 'dark' | 'auto')}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="auto">Auto (System)</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>

          {saveStatus === 'success' && (
            <p className="text-sm text-green-600 text-center">
              ✅ Settings saved successfully!
            </p>
          )}

          {saveStatus === 'error' && (
            <p className="text-sm text-red-600 text-center">
              ❌ Failed to save settings. Please try again.
            </p>
          )}

          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>🚀 Version 1.0.0</p>
            <p>Need help? Check the instructions.md file</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};