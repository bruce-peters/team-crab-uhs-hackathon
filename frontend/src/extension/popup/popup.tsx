import { createRoot } from 'react-dom/client';
import { SettingsPage } from './SettingsPage';
import '../../index.css';

function PopupApp() {
  return <SettingsPage />;
}

const container = document.getElementById('popup-root');
if (container) {
  const root = createRoot(container);
  root.render(<PopupApp />);
}

export {}; // Make this a module to satisfy react-refresh