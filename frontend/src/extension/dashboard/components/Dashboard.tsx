import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { AssignmentCard } from './AssignmentCard';
import { StudyPlanModal } from './StudyPlanModal';
import { AssignmentHelpModal } from './AssignmentHelpModal';
import type { AssignmentWithCourse } from '../../types';

export const Dashboard: React.FC = () => {
  const [assignments, setAssignments] = useState<AssignmentWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStudyPlan, setShowStudyPlan] = useState(false);
  const [helpAssignment, setHelpAssignment] = useState<AssignmentWithCourse | null>(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await chrome.runtime.sendMessage({
        type: 'GET_ASSIGNMENTS'
      });

      if (response.success) {
        setAssignments(response.data || []);
      } else {
        setError(response.error || 'Failed to load assignments');
      }
    } catch (err) {
      setError('Failed to connect to Canvas. Please make sure you are logged in.');
      console.error('Error loading assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingAssignments = assignments.filter(a => !a.submitted_at);
  const completedAssignments = assignments.filter(a => a.submitted_at);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading your assignments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-red-600 text-6xl">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={loadAssignments}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          🎓 AI Study Assistant Dashboard
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your personalized study companion powered by AI. Get help with assignments, 
          generate study plans, and stay on top of your coursework.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {pendingAssignments.length}
              </div>
              <div className="text-sm text-gray-600">Pending Assignments</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {completedAssignments.length}
              </div>
              <div className="text-sm text-gray-600">Completed Assignments</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <button
                onClick={() => setShowStudyPlan(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors w-full"
              >
                🤖 Generate Study Plan
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Assignments */}
      {pendingAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📝 Pending Assignments ({pendingAssignments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {pendingAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onGetHelp={setHelpAssignment}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Assignments */}
      {completedAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ✅ Completed Assignments ({completedAssignments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {completedAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onGetHelp={setHelpAssignment}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No assignments */}
      {assignments.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h3 className="text-lg font-semibold text-gray-900">
                No assignments found!
              </h3>
              <p className="text-gray-600">
                Either you're all caught up, or we couldn't find any assignments. 
                Make sure you're logged into Canvas and have active courses.
              </p>
              <button
                onClick={loadAssignments}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      {showStudyPlan && (
        <StudyPlanModal
          assignments={pendingAssignments}
          onClose={() => setShowStudyPlan(false)}
        />
      )}

      {helpAssignment && (
        <AssignmentHelpModal
          assignment={helpAssignment}
          onClose={() => setHelpAssignment(null)}
        />
      )}
    </div>
  );
};