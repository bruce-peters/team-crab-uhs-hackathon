import type { AssignmentWithCourse } from '../types';

export class GeminiAPI {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateStudyPlan(assignments: AssignmentWithCourse[]): Promise<string> {
    if (!this.apiKey) {
      return this.getMockStudyPlan();
    }

    const prompt = this.buildStudyPlanPrompt(assignments);
    
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || this.getMockStudyPlan();
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.getMockStudyPlan();
    }
  }

  async getAssignmentHelp(assignment: AssignmentWithCourse, question: string): Promise<string> {
    if (!this.apiKey) {
      return this.getMockAssignmentHelp();
    }

    const prompt = this.buildAssignmentHelpPrompt(assignment, question);
    
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || this.getMockAssignmentHelp();
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.getMockAssignmentHelp();
    }
  }

  private buildStudyPlanPrompt(assignments: AssignmentWithCourse[]): string {
    const assignmentList = assignments
      .filter(a => a.due_at && !a.submitted_at)
      .map(a => `- ${a.name} (${a.course_name}) - Due: ${new Date(a.due_at!).toLocaleDateString()}`)
      .join('\n');

    return `As a study assistant AI, create a personalized study plan for these upcoming assignments:

${assignmentList}

Please provide:
1. A prioritized schedule based on due dates and complexity
2. Time allocation suggestions for each assignment
3. Study strategies specific to each assignment type
4. Tips for staying organized and motivated

Keep the response concise but actionable.`;
  }

  private buildAssignmentHelpPrompt(assignment: AssignmentWithCourse, question: string): string {
    return `As a study assistant AI, help with this assignment:

Assignment: ${assignment.name}
Course: ${assignment.course_name} (${assignment.course_code})
Description: ${assignment.description}
Due Date: ${assignment.due_at ? new Date(assignment.due_at).toLocaleDateString() : 'Not specified'}
Points: ${assignment.points_possible}

Student Question: ${question}

Please provide helpful guidance without doing the work for the student. Focus on:
1. Understanding the requirements
2. Breaking down complex tasks
3. Suggesting resources or approaches
4. Time management tips
5. Quality check strategies

Keep the response educational and encouraging.`;
  }

  private getMockStudyPlan(): string {
    return `# 📚 Your Personalized Study Plan

## Priority Schedule:
1. **Final Project Proposal** (CS101) - Due Tomorrow
   - ⏰ Allocate 3-4 hours today
   - 📝 Focus on clear requirements and realistic timeline
   
2. **Data Structures Quiz** (CS101) - Due in 3 days
   - ⏰ 2 hours daily for review
   - 🌳 Practice binary tree traversal problems
   - 📊 Create visual diagrams for graph algorithms

3. **Calculus Problem Set 5** (MATH201) - Due Next Week
   - ⏰ 1 hour daily starting tomorrow
   - 📖 Review chapter 8 concepts first
   - ✍️ Work through similar examples

## Study Tips:
- Use the Pomodoro technique (25 min focused work + 5 min break)
- Start with the most challenging tasks when your energy is highest
- Form study groups for math problems
- Use Canvas discussion forums for clarifications

Stay organized and you've got this! 🎯`;
  }

  private getMockAssignmentHelp(): string {
    return `# 🎯 Assignment Guidance

## Understanding the Requirements:
Break down your assignment into smaller, manageable tasks. Start by carefully reading all instructions and identifying key deliverables.

## Suggested Approach:
1. **Research Phase**: Gather relevant resources and materials
2. **Planning Phase**: Create an outline or structure
3. **Execution Phase**: Work on the main content
4. **Review Phase**: Check quality and completeness

## Time Management:
- Start early to avoid last-minute stress
- Set mini-deadlines for each phase
- Use timers to stay focused

## Quality Check:
- Review rubric requirements
- Proofread for clarity and errors
- Ask peers or instructors for feedback

You're on the right track! Keep up the great work! 💪`;
  }
}