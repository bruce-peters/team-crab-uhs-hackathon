import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Simple MVP Message */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🎓 Canvas AI Study Assistant
        </h1>
        <p className="text-gray-600 mb-4">
          Your minimal study companion is now active on Canvas!
        </p>
        <div className="text-4xl mb-4">🚀</div>
        <p className="text-sm text-gray-500">
          This is a minimal MVP version. The extension is successfully injected into your Canvas dashboard.
        </p>
      </div>
    </div>
  );
};