import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../components/ui/card';
import type { AssignmentWithCourse } from '../../types';

interface AssignmentCardProps {
  assignment: AssignmentWithCourse;
  onGetHelp: (assignment: AssignmentWithCourse) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, onGetHelp }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const dueDate = assignment.due_at ? new Date(assignment.due_at) : null;
  const isOverdue = dueDate ? dueDate < new Date() : false;
  const dueDateStr = dueDate ? dueDate.toLocaleDateString() : 'No due date';
  const timeUntilDue = dueDate ? Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  const getPriorityColor = () => {
    if (isOverdue) return 'border-red-500 bg-red-50';
    if (timeUntilDue !== null && timeUntilDue <= 1) return 'border-orange-500 bg-orange-50';
    if (timeUntilDue !== null && timeUntilDue <= 3) return 'border-yellow-500 bg-yellow-50';
    return 'border-gray-200 bg-white';
  };

  const getTimeUntilDueText = () => {
    if (isOverdue) return '⚠️ Overdue';
    if (timeUntilDue === null) return '';
    if (timeUntilDue === 0) return '📅 Due today';
    if (timeUntilDue === 1) return '⏰ Due tomorrow';
    return `📆 Due in ${timeUntilDue} days`;
  };

  const handleViewAssignment = () => {
    window.open(assignment.html_url, '_blank');
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${getPriorityColor()}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {assignment.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {assignment.course_code}
              </span>
              {getTimeUntilDueText() && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  isOverdue ? 'bg-red-100 text-red-800' :
                  timeUntilDue !== null && timeUntilDue <= 1 ? 'bg-orange-100 text-orange-800' :
                  timeUntilDue !== null && timeUntilDue <= 3 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {getTimeUntilDueText()}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Course:</span>
              <p className="text-gray-900">{assignment.course_name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Points:</span>
              <p className="text-gray-900">{assignment.points_possible}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Due Date:</span>
              <p className="text-gray-900">{dueDateStr}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Status:</span>
              <p className={`font-medium ${
                assignment.submitted_at ? 'text-green-600' : 
                isOverdue ? 'text-red-600' : 'text-orange-600'
              }`}>
                {assignment.submitted_at ? '✅ Submitted' : 
                 isOverdue ? '❌ Overdue' : '📝 Not submitted'}
              </p>
            </div>
          </div>

          {assignment.description && (
            <div className="mt-3">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm font-medium text-blue-600 hover:underline focus:outline-none"
              >
                {isExpanded ? 'Hide description' : 'Show description'}
              </button>
              {isExpanded && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    {assignment.description.length > 200 
                      ? `${assignment.description.substring(0, 200)}...` 
                      : assignment.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex gap-2 w-full">
          <button
            onClick={handleViewAssignment}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            📖 View Assignment
          </button>
          <button
            onClick={() => onGetHelp(assignment)}
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            🤖 Get AI Help
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};