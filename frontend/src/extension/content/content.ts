// Content script to inject dashboard into Canvas navbar
import type { AssignmentWithCourse } from '../types';

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
    const dashboardContainer = overlay.querySelector('.dashboard-content');
    if (dashboardContainer) {
      await this.loadDashboardContent(dashboardContainer as HTMLElement);
    }
  }

  private createDashboardModal(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.id = this.DASHBOARD_ID;
    overlay.className = 'ai-dashboard-overlay';
    
    overlay.innerHTML = `
      <div class="ai-dashboard-modal">
        <div class="ai-dashboard-header">
          <h2>AI Study Assistant Dashboard</h2>
          <button class="ai-dashboard-close">&times;</button>
        </div>
        <div class="dashboard-content">
          <div class="loading">Loading your assignments...</div>
        </div>
      </div>
    `;

    // Add close functionality
    const closeBtn = overlay.querySelector('.ai-dashboard-close');
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
        container.innerHTML = `<div class="error">Failed to load assignments: ${response.error}</div>`;
      }
    } catch (error) {
      console.error('Error loading dashboard content:', error);
      container.innerHTML = '<div class="error">Failed to load assignments. Please try again.</div>';
    }
  }

  private renderAssignmentsList(assignments: AssignmentWithCourse[]): string {
    if (!assignments.length) {
      return '<div class="no-assignments">No upcoming assignments found!</div>';
    }

    const assignmentItems = assignments.map(assignment => {
      const dueDate = assignment.due_at ? new Date(assignment.due_at) : null;
      const isOverdue = dueDate && dueDate < new Date();
      const dueDateStr = dueDate ? dueDate.toLocaleDateString() : 'No due date';
      
      return `
        <div class="assignment-item ${isOverdue ? 'overdue' : ''}">
          <div class="assignment-header">
            <h3>${assignment.name}</h3>
            <span class="course-badge">${assignment.course_code}</span>
          </div>
          <div class="assignment-details">
            <p><strong>Course:</strong> ${assignment.course_name}</p>
            <p><strong>Due:</strong> ${dueDateStr}</p>
            <p><strong>Points:</strong> ${assignment.points_possible}</p>
            ${assignment.description ? `<p><strong>Description:</strong> ${assignment.description.substring(0, 100)}...</p>` : ''}
          </div>
          <div class="assignment-actions">
            <button class="btn-primary" onclick="window.open('${assignment.html_url}', '_blank')">
              View Assignment
            </button>
            <button class="btn-secondary get-help" data-assignment-id="${assignment.id}">
              Get AI Help
            </button>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="assignments-container">
        <div class="assignments-header">
          <h3>Your Upcoming Assignments (${assignments.length})</h3>
          <button class="btn-ai generate-study-plan">Generate Study Plan</button>
        </div>
        <div class="assignments-list">
          ${assignmentItems}
        </div>
      </div>
    `;
  }
}

// Initialize when script loads
new CanvasInjector();