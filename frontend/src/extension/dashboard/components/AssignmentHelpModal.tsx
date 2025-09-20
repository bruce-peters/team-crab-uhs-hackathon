import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../components/ui/card';
import type { AssignmentWithCourse } from '../../types';

interface AssignmentHelpModalProps {
  assignment: AssignmentWithCourse;
  onClose: () => void;
}

export const AssignmentHelpModal: React.FC<AssignmentHelpModalProps> = ({ assignment, onClose }) => {
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitQuestion = async () => {
    if (!question.trim()) {
      setError('Please enter a question about this assignment.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await chrome.runtime.sendMessage({
        type: 'GEMINI_QUERY',
        payload: {
          type: 'assignment_help',
          assignment,
          question: question.trim()
        }
      });

      if (response.success) {
        setAiResponse(response.data);
      } else {
        setError(response.error || 'Failed to get AI help');
      }
    } catch (err) {
      setError('Failed to get AI help. Please try again.');
      console.error('Error getting AI help:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatAiResponse = (response: string) => {
    // Convert markdown-like formatting to HTML
    return response
      .replace(/^# (.*$)/gm, '<h2 class="text-xl font-bold text-gray-900 mb-4">$1</h2>')
      .replace(/^## (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-800 mb-3 mt-6">$1</h3>')
      .replace(/^### (.*$)/gm, '<h4 class="text-md font-medium text-gray-700 mb-2 mt-4">$1</h4>')
      .replace(/^\*\*(.*?)\*\*/gm, '<strong class="font-semibold">$1</strong>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 mb-2">• $1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4 mb-2">$1. $2</li>')
      .replace(/🎯/g, '<span class="text-red-600">🎯</span>')
      .replace(/📚/g, '<span class="text-blue-600">📚</span>')
      .replace(/⏰/g, '<span class="text-orange-600">⏰</span>')
      .replace(/✍️/g, '<span class="text-green-600">✍️</span>')
      .replace(/💪/g, '<span class="text-purple-600">💪</span>')
      .replace(/\n/g, '<br>');
  };

  const quickQuestions = [
    "How should I approach this assignment?",
    "What are the key requirements I need to focus on?",
    "Can you help me break this down into smaller tasks?",
    "What resources would be helpful for this assignment?",
    "How should I manage my time for this assignment?"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 mb-2">
              🤖 AI Assignment Help
            </CardTitle>
            <div className="text-sm text-gray-600">
              <strong>{assignment.name}</strong> • {assignment.course_name}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </CardHeader>

        <CardContent className="overflow-y-auto space-y-6">
          {/* Assignment Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Assignment Details:</h4>
            <div className="text-sm space-y-1">
              <p><strong>Course:</strong> {assignment.course_name} ({assignment.course_code})</p>
              <p><strong>Due Date:</strong> {assignment.due_at ? new Date(assignment.due_at).toLocaleDateString() : 'No due date'}</p>
              <p><strong>Points:</strong> {assignment.points_possible}</p>
              {assignment.description && (
                <p><strong>Description:</strong> {assignment.description.substring(0, 200)}...</p>
              )}
            </div>
          </div>

          {/* Question Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What would you like help with?
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask any question about this assignment. For example: 'How should I structure my essay?' or 'What resources do I need?'"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={4}
            />
          </div>

          {/* Quick Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or try one of these quick questions:
            </label>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(q)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* AI Response */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">AI is thinking about your question...</p>
            </div>
          )}

          {aiResponse && !loading && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h4 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
                🤖 AI Response
              </h4>
              <div 
                className="prose prose-sm max-w-none text-purple-800"
                dangerouslySetInnerHTML={{ __html: formatAiResponse(aiResponse) }}
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            💡 AI responses are suggestions - always verify with your instructor
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSubmitQuestion}
              disabled={loading || !question.trim()}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm"
            >
              {loading ? 'Getting Help...' : '🤖 Get AI Help'}
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