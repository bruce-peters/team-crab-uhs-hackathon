import React from 'react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="w-80 p-4 bg-white">
      <div className="text-center space-y-4">
        <h1 className="text-xl font-bold text-gray-900">
          🎓 Canvas AI Study Assistant
        </h1>
        <div className="text-4xl">✨</div>
        <p className="text-gray-600 text-sm">
          Minimal MVP version is active!
        </p>
        <p className="text-gray-500 text-xs">
          The extension is successfully injected into your Canvas pages.
        </p>
        <div className="text-xs text-gray-400 pt-4 border-t border-gray-200">
          Version 1.0.0 - MVP
        </div>
      </div>
    </div>
  );
};