import { createRoot } from 'react-dom/client';
import { Dashboard } from './components/Dashboard';
import '../../index.css';

function DashboardApp() {
  return <Dashboard />;
}

const container = document.getElementById('dashboard-root');
if (container) {
  const root = createRoot(container);
  root.render(<DashboardApp />);
}

export {}; // Make this a module to satisfy react-refresh