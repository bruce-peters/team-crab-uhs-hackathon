// Content script to inject Dashboard React component into Canvas pages
import { createRoot } from 'react-dom/client';
import { Dashboard } from '../dashboard/components/Dashboard';
import '../../index.css';

class CanvasInjector {
  private dashboardInjected = false;
  private readonly DASHBOARD_ID = 'ai-study-assistant-dashboard';

  constructor() {
    this.init();
  }

  private init() {
    // Wait for Canvas to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.injectDashboard());
    } else {
      this.injectDashboard();
    }

    // Watch for navigation changes (Canvas is a SPA)
    this.observeNavigationChanges();
  }

  private observeNavigationChanges() {
    const observer = new MutationObserver(() => {
      if (!this.dashboardInjected) {
        this.injectDashboard();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private injectDashboard() {
    if (this.dashboardInjected) return;

    // Find a suitable location to inject the dashboard
    const targetContainer = this.findInjectionTarget();
    if (!targetContainer) {
      console.log('Canvas injection target not found, retrying...');
      setTimeout(() => this.injectDashboard(), 1000);
      return;
    }

    this.injectReactDashboard(targetContainer);
    this.dashboardInjected = true;
  }

  private findInjectionTarget(): HTMLElement | null {
    // Try different selectors for Canvas main content areas
    const selectors = [
      '#main', // Main content area
      '#content', // Content container
      '.ic-Layout-contentMain', // Modern Canvas main content
      '#wrapper', // Canvas wrapper
      '.ic-app-main-content', // App main content
      'body' // Fallback to body
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element as HTMLElement;
      }
    }

    return null;
  }

  private injectReactDashboard(targetContainer: HTMLElement) {
    // Create container for React dashboard
    const dashboardContainer = document.createElement('div');
    dashboardContainer.id = this.DASHBOARD_ID;
    dashboardContainer.className = 'ai-study-assistant-container';
    
    // Add some basic styling to make it fit well in Canvas
    dashboardContainer.style.cssText = `
      margin-bottom: 20px;
      font-family: inherit;
      z-index: 1000;
    `;

    // Insert at the top of the target container
    if (targetContainer.firstChild) {
      targetContainer.insertBefore(dashboardContainer, targetContainer.firstChild);
    } else {
      targetContainer.appendChild(dashboardContainer);
    }

    // Create React root and render Dashboard component
    const root = createRoot(dashboardContainer);
    root.render(<Dashboard />);
  }
}

// Initialize when script loads
new CanvasInjector();