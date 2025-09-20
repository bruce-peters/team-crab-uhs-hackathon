import type { CanvasAssignment, CanvasCourse, AssignmentWithCourse } from '../types';

export class CanvasAPI {
  private baseUrl: string;

  constructor(canvasUrl?: string) {
    this.baseUrl = canvasUrl || this.getCanvasBaseUrl();
  }

  private getCanvasBaseUrl(): string {
    // Extract Canvas URL from current page
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      return `${protocol}//${hostname}`;
    }
    return '';
  }

  async getCurrentUser() {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/users/self`, {
        credentials: 'include'
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw error;
    }
  }

  async getCourses(): Promise<CanvasCourse[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/courses?enrollment_state=active&per_page=100`, {
        credentials: 'include'
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      // Return mock data for development
      return this.getMockCourses();
    }
  }

  async getAssignments(): Promise<AssignmentWithCourse[]> {
    try {
      const courses = await this.getCourses();
      const allAssignments: AssignmentWithCourse[] = [];

      for (const course of courses) {
        try {
          const response = await fetch(
            `${this.baseUrl}/api/v1/courses/${course.id}/assignments?per_page=100`,
            { credentials: 'include' }
          );
          const assignments: CanvasAssignment[] = await response.json();
          
          const assignmentsWithCourse = assignments
            .filter(assignment => assignment.workflow_state === 'published')
            .map(assignment => ({
              ...assignment,
              course_name: course.name,
              course_code: course.course_code
            }));
          
          allAssignments.push(...assignmentsWithCourse);
        } catch (error) {
          console.error(`Failed to fetch assignments for course ${course.id}:`, error);
        }
      }

      return allAssignments.sort((a, b) => {
        if (!a.due_at) return 1;
        if (!b.due_at) return -1;
        return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
      });
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      // Return mock data for development
      return this.getMockAssignments();
    }
  }

  private getMockCourses(): CanvasCourse[] {
    return [
      {
        id: 1,
        name: 'Computer Science 101',
        course_code: 'CS101',
        workflow_state: 'available',
        account_id: 1,
        start_at: '2024-01-15T00:00:00Z',
        end_at: '2024-05-15T00:00:00Z'
      },
      {
        id: 2,
        name: 'Mathematics for Engineers',
        course_code: 'MATH201',
        workflow_state: 'available',
        account_id: 1,
        start_at: '2024-01-15T00:00:00Z',
        end_at: '2024-05-15T00:00:00Z'
      }
    ];
  }

  private getMockAssignments(): AssignmentWithCourse[] {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return [
      {
        id: 1,
        name: 'Final Project Proposal',
        description: 'Submit your final project proposal with detailed requirements and timeline',
        due_at: tomorrow.toISOString(),
        submitted_at: null,
        submission_types: ['online_text_entry', 'online_upload'],
        points_possible: 50,
        course_id: 1,
        course_name: 'Computer Science 101',
        course_code: 'CS101',
        html_url: '#',
        locked: false,
        workflow_state: 'published'
      },
      {
        id: 2,
        name: 'Calculus Problem Set 5',
        description: 'Complete problems 1-20 from chapter 8',
        due_at: nextWeek.toISOString(),
        submitted_at: null,
        submission_types: ['online_upload'],
        points_possible: 25,
        course_id: 2,
        course_name: 'Mathematics for Engineers',
        course_code: 'MATH201',
        html_url: '#',
        locked: false,
        workflow_state: 'published'
      },
      {
        id: 3,
        name: 'Data Structures Quiz',
        description: 'Online quiz covering binary trees and graph algorithms',
        due_at: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        submitted_at: null,
        submission_types: ['online_quiz'],
        points_possible: 100,
        course_id: 1,
        course_name: 'Computer Science 101',
        course_code: 'CS101',
        html_url: '#',
        locked: false,
        workflow_state: 'published'
      }
    ];
  }
}