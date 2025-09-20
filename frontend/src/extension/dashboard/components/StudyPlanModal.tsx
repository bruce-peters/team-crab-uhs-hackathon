import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../components/ui/card';
import type { AssignmentWithCourse } from '../../types';

interface StudyPlanModalProps {
  assignments: AssignmentWithCourse[];
  onClose: () => void;
}

export const StudyPlanModal: React.FC<StudyPlanModalProps> = ({ assignments, onClose }) => {
  const [studyPlan, setStudyPlan] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateStudyPlan();
  }, [assignments]); // eslint-disable-line react-hooks/exhaustive-deps

  const generateStudyPlan = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await chrome.runtime.sendMessage({
        type: 'GEMINI_QUERY',
        payload: {
          type: 'study_plan',
          assignments
        }
      });

      if (response.success) {
        setStudyPlan(response.data);
      } else {
        setError(response.error || 'Failed to generate study plan');
      }
    } catch (err) {
      setError('Failed to generate study plan. Please try again.');
      console.error('Error generating study plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatStudyPlan = (plan: string) => {
    // Convert markdown-like formatting to HTML
    return plan
      .replace(/^# (.*$)/gm, '<h2 class="text-xl font-bold text-gray-900 mb-4">$1</h2>')
      .replace(/^## (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-800 mb-3 mt-6">$1</h3>')
      .replace(/^### (.*$)/gm, '<h4 class="text-md font-medium text-gray-700 mb-2 mt-4">$1</h4>')
      .replace(/^\*\*(.*?)\*\*/gm, '<strong class="font-semibold">$1</strong>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 mb-2">• $1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4 mb-2">$1. $2</li>')
      .replace(/⏰/g, '<span class="text-blue-600">⏰</span>')
      .replace(/📝/g, '<span class="text-green-600">📝</span>')
      .replace(/🌳/g, '<span class="text-green-600">🌳</span>')
      .replace(/📊/g, '<span class="text-purple-600">📊</span>')
      .replace(/📖/g, '<span class="text-blue-600">📖</span>')
      .replace(/✍️/g, '<span class="text-orange-600">✍️</span>')
      .replace(/🎯/g, '<span class="text-red-600">🎯</span>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            🤖 Your Personalized Study Plan
          </CardTitle>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </CardHeader>

        <CardContent className="overflow-y-auto">
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">AI is analyzing your assignments and creating a personalized study plan...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Failed to Generate Study Plan
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={generateStudyPlan}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {studyPlan && !loading && (
            <div className="prose prose-sm max-w-none">
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatStudyPlan(studyPlan) }}
              />
            </div>
          )}

          {assignments.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-green-600 text-6xl mb-4">🎉</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Pending Assignments!
              </h3>
              <p className="text-gray-600">
                You're all caught up! Great job staying on top of your coursework.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            💡 This study plan is AI-generated based on your current assignments
          </div>
          <div className="flex gap-2">
            <button
              onClick={generateStudyPlan}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm"
            >
              🔄 Regenerate
            </button>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};