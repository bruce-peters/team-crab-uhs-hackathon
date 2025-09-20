// Minimal background service worker for MVP
console.log('Canvas AI Study Assistant MVP - Background service worker loaded');

// Basic installation handler
chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
  if (details.reason === 'install') {
    console.log('Canvas AI Study Assistant MVP installed');
  }
});

// Minimal message handler (just for completeness)
chrome.runtime.onMessage.addListener((
  message: { type: string },
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: { success: boolean; message: string }) => void
) => {
  // For MVP, just acknowledge messages
  console.log('Background received message:', message.type);
  sendResponse({ success: true, message: 'MVP version - minimal functionality' });
  return true;
});