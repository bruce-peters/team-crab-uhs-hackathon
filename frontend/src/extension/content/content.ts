// Content script to inject dashboard into Canvas navbar
import type { AssignmentWithCourse } from '../types';
// Import Tailwind CSS styles
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

    // Look for Canvas navigation menu
    const navMenu = this.findNavigationMenu();
    if (!navMenu) {
      console.log('Canvas navigation not found, retrying...');
      setTimeout(() => this.injectDashboard(), 1000);
      return;
    }

    this.addDashboardMenuItem(navMenu);
    this.dashboardInjected = true;
  }

  private findNavigationMenu(): HTMLElement | null {
    // Try different selectors for Canvas navigation
    const selectors = [
      '#global_nav_courses_link', // Modern Canvas
      '.ic-app-header__menu-list', // Classic Canvas
      '[role="navigation"] ul', // Generic navigation
      '#left-side .menu' // Sidebar navigation
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        // Find the parent container
        return element.parentElement || element as HTMLElement;
      }
    }

    return null;
  }

  private addDashboardMenuItem(navMenu: HTMLElement) {
    // Create dashboard menu item
    const dashboardItem = this.createDashboardMenuItem();
    
    // Find appropriate insertion point
    const coursesLink = document.querySelector('#global_nav_courses_link');
    if (coursesLink && coursesLink.parentElement) {
      coursesLink.parentElement.insertAdjacentElement('afterend', dashboardItem);
    } else {
      // Fallback: append to nav menu
      navMenu.appendChild(dashboardItem);
    }

    // Add click handler
    dashboardItem.addEventListener('click', (e) => {
      e.preventDefault();
      this.openDashboard();
    });
  }

  private createDashboardMenuItem(): HTMLElement {
    const item = document.createElement('li');
    item.className = 'ic-NavMenu-list-item';
    
    item.innerHTML = `
      <a href="#" class="ic-NavMenu-list-item__link" id="${this.DASHBOARD_ID}-link">
        <div class="ic-NavMenu-list-item__helper">
          <i class="icon-student-view nav-icon"></i>
          AI Study Assistant
        </div>
      </a>
    `;

    return item;
  }

  private async openDashboard() {
    // Create modal overlay
    const overlay = this.createDashboardModal();
    document.body.appendChild(overlay);

    // Load dashboard content
    const dashboardContainer = overlay.querySelector('.flex-1.overflow-y-auto.p-6');
    if (dashboardContainer) {
      await this.loadDashboardContent(dashboardContainer as HTMLElement);
    }
  }

  private createDashboardModal(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.id = this.DASHBOARD_ID;
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center font-sans';
    
    overlay.innerHTML = `
      <div class="bg-white rounded-xl shadow-xl max-w-4xl w-[90%] max-h-[80vh] overflow-hidden flex flex-col">
        <div class="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <h2 class="text-2xl font-semibold text-gray-900 m-0">✨ AI Study Assistant Dashboard</h2>
          <button class="bg-none border-none text-2xl cursor-pointer text-gray-500 p-0 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 hover:text-gray-700 transition-all">×</button>
        </div>
        <div class="flex-1 overflow-y-auto p-6">
          <div class="text-center py-8 text-gray-500 text-lg">Loading your assignments...</div>
        </div>
      </div>
    `;

    // Add close functionality
    const closeBtn = overlay.querySelector('button');
    closeBtn?.addEventListener('click', () => {
      overlay.remove();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    return overlay;
  }

  private async loadDashboardContent(container: HTMLElement) {
    try {
      // Request assignments from background script
      const response = await chrome.runtime.sendMessage({
        type: 'GET_ASSIGNMENTS'
      });

      if (response.success) {
        container.innerHTML = this.renderAssignmentsList(response.data);
      } else {
        container.innerHTML = `<div class="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">Failed to load assignments: ${response.error}</div>`;
      }
    } catch (error) {
      console.error('Error loading dashboard content:', error);
      container.innerHTML = '<div class="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">Failed to load assignments. Please try again.</div>';
    }
  }

  private renderAssignmentsList(assignments: AssignmentWithCourse[]): string {
    if (!assignments.length) {
      return '<div class="text-center py-12 text-green-600 text-xl font-medium">🎉 No upcoming assignments found!</div>';
    }

    const assignmentItems = assignments.map(assignment => {
      const dueDate = assignment.due_at ? new Date(assignment.due_at) : null;
      const isOverdue = dueDate && dueDate < new Date();
      const dueDateStr = dueDate ? dueDate.toLocaleDateString() : 'No due date';
      
      return `
        <div class="bg-white border border-gray-200 rounded-xl p-6 transition-all hover:border-gray-300 hover:shadow-md ${isOverdue ? 'border-red-300 bg-red-50' : ''}">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold text-gray-900 m-0 flex-1">${assignment.name}</h3>
            <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium ml-4">${assignment.course_code}</span>
          </div>
          <div class="mb-4 space-y-2">
            <p class="text-gray-600 text-sm m-0"><span class="font-medium text-gray-700">Course:</span> ${assignment.course_name}</p>
            <p class="text-gray-600 text-sm m-0"><span class="font-medium text-gray-700">Due:</span> ${dueDateStr}</p>
            <p class="text-gray-600 text-sm m-0"><span class="font-medium text-gray-700">Points:</span> ${assignment.points_possible}</p>
            ${assignment.description ? `<p class="text-gray-600 text-sm m-0"><span class="font-medium text-gray-700">Description:</span> ${assignment.description.substring(0, 100)}...</p>` : ''}
          </div>
          <div class="flex gap-3 flex-wrap">
            <button class="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all hover:bg-blue-600 flex items-center gap-2" onclick="window.open('${assignment.html_url}', '_blank')">
              View Assignment
            </button>
            <button class="bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all hover:bg-gray-200 hover:border-gray-400 get-help" data-assignment-id="${assignment.id}">
              Get AI Help
            </button>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="max-w-full">
        <div class="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900 m-0">Your Upcoming Assignments (${assignments.length})</h3>
          <button class="bg-purple-500 text-white px-6 py-2 rounded-md text-sm font-medium cursor-pointer transition-all hover:bg-purple-600 generate-study-plan">Generate Study Plan</button>
        </div>
        <div class="flex flex-col gap-4">
          ${assignmentItems}
        </div>
      </div>
    `;
  }
}

// Initialize when script loads
new CanvasInjector();