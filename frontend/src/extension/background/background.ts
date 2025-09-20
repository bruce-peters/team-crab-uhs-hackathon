import { CanvasAPI } from '../services/canvasApi';
import { GeminiAPI } from '../services/geminiApi';
import type { ExtensionMessage, ExtensionResponse, ExtensionSettings, AssignmentWithCourse } from '../types';

// Initialize services
let canvasAPI: CanvasAPI;
let geminiAPI: GeminiAPI;

// Load settings and initialize services
chrome.storage.sync.get(['settings'], (result: { [key: string]: any }) => {
  const settings: ExtensionSettings = result.settings || {
    geminiApiKey: '',
    canvasUrl: '',
    enableNotifications: true,
    studyReminders: true,
    theme: 'auto'
  };
  
  initializeServices(settings);
});

function initializeServices(settings: ExtensionSettings) {
  canvasAPI = new CanvasAPI(settings.canvasUrl);
  if (settings.geminiApiKey) {
    geminiAPI = new GeminiAPI(settings.geminiApiKey);
  }
}

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((
  message: ExtensionMessage,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: ExtensionResponse) => void
) => {
  handleMessage(message).then(sendResponse);
  return true; // Keep message channel open for async response
});

async function handleMessage(message: ExtensionMessage): Promise<ExtensionResponse> {
  try {
    switch (message.type) {
      case 'GET_ASSIGNMENTS': {
        const assignmentData = await canvasAPI.getAssignments();
        return { success: true, data: assignmentData };
      }

      case 'GET_COURSES': {
        const courses = await canvasAPI.getCourses();
        return { success: true, data: courses };
      }

      case 'GEMINI_QUERY': {
        if (!geminiAPI) {
          return { success: false, error: 'Gemini API not configured. Please add your API key in settings.' };
        }
        
        const payload = message.payload as {
          type: string;
          assignment?: AssignmentWithCourse;
          question?: string;
          assignments?: AssignmentWithCourse[];
        };
        
        const { type: queryType, assignment, question, assignments: queryAssignments } = payload;
        
        if (queryType === 'study_plan' && queryAssignments) {
          const studyPlan = await geminiAPI.generateStudyPlan(queryAssignments);
          return { success: true, data: studyPlan };
        } else if (queryType === 'assignment_help' && assignment && question) {
          const help = await geminiAPI.getAssignmentHelp(assignment, question);
          return { success: true, data: help };
        }
        
        return { success: false, error: 'Unknown query type or missing parameters' };
      }

      case 'SETTINGS_UPDATE': {
        const newSettings = message.payload as ExtensionSettings;
        chrome.storage.sync.set({ settings: newSettings });
        initializeServices(newSettings);
        return { success: true };
      }

      default:
        return { success: false, error: 'Unknown message type' };
    }
  } catch (error) {
    console.error('Background script error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Set up periodic assignment checking for notifications
chrome.alarms.create('checkAssignments', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener(async (alarm: chrome.alarms.Alarm) => {
  if (alarm.name === 'checkAssignments') {
    try {
      const settings = await chrome.storage.sync.get(['settings']);
      if (settings.settings?.enableNotifications) {
        await checkForUpcomingAssignments();
      }
    } catch (error) {
      console.error('Error checking assignments:', error);
    }
  }
});

async function checkForUpcomingAssignments() {
  try {
    const assignments = await canvasAPI.getAssignments();
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const upcomingAssignments = assignments.filter(assignment => {
      if (!assignment.due_at || assignment.submitted_at) return false;
      const dueDate = new Date(assignment.due_at);
      return dueDate <= tomorrow && dueDate > now;
    });

    for (const assignment of upcomingAssignments) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Assignment Due Soon!',
        message: `${assignment.name} in ${assignment.course_name} is due ${new Date(assignment.due_at!).toLocaleDateString()}`
      });
    }
  } catch (error) {
    console.error('Error checking for upcoming assignments:', error);
  }
}

// Install/update handler
chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
  if (details.reason === 'install') {
    // Set default settings
    const defaultSettings: ExtensionSettings = {
      geminiApiKey: '',
      canvasUrl: '',
      enableNotifications: true,
      studyReminders: true,
      theme: 'auto'
    };
    chrome.storage.sync.set({ settings: defaultSettings });
  }
});