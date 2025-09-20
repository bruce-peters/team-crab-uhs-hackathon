// Content script to inject Dashboard into Canvas pages
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

    this.injectDashboardIframe(targetContainer);
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

  private injectDashboardIframe(targetContainer: HTMLElement) {
    // Create container for dashboard iframe
    const dashboardContainer = document.createElement('div');
    dashboardContainer.id = this.DASHBOARD_ID;
    dashboardContainer.className = 'ai-study-assistant-container';
    
    // Add styling to make it fit well in Canvas
    dashboardContainer.style.cssText = `
      margin-bottom: 20px;
      font-family: inherit;
      z-index: 1000;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    // Create iframe pointing to dashboard.html
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('dashboard.html');
    iframe.style.cssText = `
      width: 100%;
      height: 600px;
      border: none;
      border-radius: 8px;
    `;

    dashboardContainer.appendChild(iframe);

    // Insert at the top of the target container
    if (targetContainer.firstChild) {
      targetContainer.insertBefore(dashboardContainer, targetContainer.firstChild);
    } else {
      targetContainer.appendChild(dashboardContainer);
    }
  }
}

// Initialize when script loads
new CanvasInjector();