export interface CanvasAssignment {
  id: number;
  name: string;
  description: string;
  due_at: string | null;
  submitted_at: string | null;
  submission_types: string[];
  points_possible: number;
  course_id: number;
  html_url: string;
  locked: boolean;
  workflow_state: 'published' | 'unpublished';
}

export interface CanvasCourse {
  id: number;
  name: string;
  course_code: string;
  workflow_state: 'available' | 'completed' | 'deleted';
  account_id: number;
  start_at: string | null;
  end_at: string | null;
}

export interface CanvasUser {
  id: number;
  name: string;
  email: string;
  login_id: string;
}

export interface AssignmentWithCourse extends CanvasAssignment {
  course_name: string;
  course_code: string;
}

export interface ExtensionSettings {
  geminiApiKey: string;
  canvasUrl: string;
  enableNotifications: boolean;
  studyReminders: boolean;
  theme: 'light' | 'dark' | 'auto';
}