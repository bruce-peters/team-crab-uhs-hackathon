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

    // Find a suitable location to inject the dashboard
    const targetContainer = this.findInjectionTarget();
    if (!targetContainer) {
      console.log('Canvas injection target not found, retrying...');
      setTimeout(() => this.injectDashboard(), 1000);
      return;
    }

    this.injectDashboardDirectly(targetContainer);
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

  private injectDashboardDirectly(targetContainer: HTMLElement) {
    // Create dashboard container
    const dashboardContainer = this.createDashboardContainer();
    
    // Insert at the top of the target container
    if (targetContainer.firstChild) {
      targetContainer.insertBefore(dashboardContainer, targetContainer.firstChild);
    } else {
      targetContainer.appendChild(dashboardContainer);
    }

    // Load dashboard content
    const contentArea = dashboardContainer.querySelector('.dashboard-content');
    if (contentArea) {
      this.loadDashboardContent(contentArea as HTMLElement);
    }
  }

  private createDashboardContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = this.DASHBOARD_ID;
    container.className = 'ai-study-assistant-dashboard bg-white border border-gray-200 rounded-xl shadow-lg mb-6 font-sans';
    
    container.innerHTML = `
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-xl">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold m-0 flex items-center gap-2">
            ✨ AI Study Assistant
          </h2>
          <button class="minimize-btn bg-white bg-opacity-20 hover:bg-opacity-30 border-none text-white px-3 py-1 rounded-md cursor-pointer transition-all text-sm">
            −
          </button>
        </div>
      </div>
      <div class="dashboard-content p-6">
        <div class="text-center py-8 text-gray-500 text-lg flex items-center justify-center gap-3">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          Loading your assignments...
        </div>
      </div>
    `;

    // Add minimize functionality
    const minimizeBtn = container.querySelector('.minimize-btn');
    const content = container.querySelector('.dashboard-content');
    let isMinimized = false;

    minimizeBtn?.addEventListener('click', () => {
      if (isMinimized) {
        (content as HTMLElement).style.display = 'block';
        minimizeBtn.textContent = '−';
        isMinimized = false;
      } else {
        (content as HTMLElement).style.display = 'none';
        minimizeBtn.textContent = '+';
        isMinimized = true;
      }
    });

    return container;
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
      return '<div class="text-center py-8 text-green-600 text-lg font-medium">🎉 No upcoming assignments found!</div>';
    }

    // Limit to first 5 assignments for inline display
    const displayAssignments = assignments.slice(0, 5);
    
    const assignmentItems = displayAssignments.map(assignment => {
      const dueDate = assignment.due_at ? new Date(assignment.due_at) : null;
      const isOverdue = dueDate && dueDate < new Date();
      const dueDateStr = dueDate ? dueDate.toLocaleDateString() : 'No due date';
      
      return `
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 transition-all hover:border-gray-300 hover:shadow-sm ${isOverdue ? 'border-red-300 bg-red-50' : ''}">
          <div class="flex justify-between items-start mb-2">
            <h4 class="text-md font-semibold text-gray-900 m-0 flex-1 leading-tight">${assignment.name}</h4>
            <span class="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium ml-3 whitespace-nowrap">${assignment.course_code}</span>
          </div>
          <div class="mb-3 space-y-1">
            <p class="text-gray-600 text-sm m-0">${assignment.course_name}</p>
            <p class="text-gray-600 text-sm m-0"><span class="font-medium">Due:</span> ${dueDateStr}</p>
          </div>
          <div class="flex gap-2 flex-wrap">
            <button class="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium cursor-pointer transition-all hover:bg-blue-600" onclick="window.open('${assignment.html_url}', '_blank')">
              View
            </button>
            <button class="bg-purple-500 text-white px-3 py-1 rounded text-sm font-medium cursor-pointer transition-all hover:bg-purple-600 get-help" data-assignment-id="${assignment.id}">
              AI Help
            </button>
          </div>
        </div>
      `;
    }).join('');

    const showingText = assignments.length > 5 ? `Showing 5 of ${assignments.length}` : `${assignments.length}`;

    return `
      <div class="max-w-full">
        <div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 m-0">📚 Upcoming Assignments (${showingText})</h3>
          ${assignments.length > 5 ? '<button class="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer">View All</button>' : ''}
        </div>
        <div class="space-y-3 max-h-96 overflow-y-auto">
          ${assignmentItems}
        </div>
        <div class="mt-4 pt-3 border-t border-gray-200 text-center">
          <button class="bg-purple-500 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all hover:bg-purple-600 generate-study-plan">
            🤖 Generate Study Plan
          </button>
        </div>
      </div>
    `;
  }
}

// Initialize when script loads
new CanvasInjector();