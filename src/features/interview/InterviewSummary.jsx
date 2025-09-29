import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import database from '../../services/database';
import { getScoreColor, getRatingEmoji } from '../../utils/helpers';
import { formatTimestamp } from '../../utils/timer';

const InterviewSummary = ({ candidate, session, onStartOver }) => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      // Get chat messages to find the summary
      const messages = await database.getChatMessages(candidate.id);
      const summaryMessage = messages.find(msg => msg.type === 'summary');
      
      if (summaryMessage) {
        const summaryData = JSON.parse(summaryMessage.content);
        setSummary(summaryData);
      }
    } catch (error) {
      console.error('Error loading summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No summary available.</p>
        <Button onClick={onStartOver} className="mt-4">
          Start New Interview
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Interview Complete!
        </h2>
        <p className="text-lg text-gray-600">
          Thank you for completing the interview, {candidate.name}.
        </p>
      </div>

      {/* Overall Score */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Overall Performance
          </h3>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(summary.overallScore).split(' ')[0]}`}>
                {summary.overallScore}
              </div>
              <div className="text-sm text-gray-500">Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl">
                {getRatingEmoji(summary.overallRating || 'Good')}
              </div>
              <div className="text-sm text-gray-500">{summary.overallRating || 'Good'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Text */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Interview Summary
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {summary.summary}
        </p>
      </div>

      {/* Strengths and Improvements */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Strengths */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🌟 Key Strengths
          </h3>
          {summary.strengths && summary.strengths.length > 0 ? (
            <ul className="space-y-2">
              {summary.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No specific strengths identified.</p>
          )}
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📈 Areas for Improvement
          </h3>
          {summary.areasForImprovement && summary.areasForImprovement.length > 0 ? (
            <ul className="space-y-2">
              {summary.areasForImprovement.map((improvement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Great job! No major areas for improvement identified.</p>
          )}
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Question-by-Question Breakdown
        </h3>
        <div className="space-y-4">
          {summary.detailedScores && summary.detailedScores.length > 0 ? (
            summary.detailedScores.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      Question {item.questionNumber}: {item.question}
                    </h4>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      item.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
                      item.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {item.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded text-sm font-medium ${getScoreColor(item.score)}`}>
                    {item.score}/100
                  </div>
                </div>
                {item.feedback && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-700 mb-1">AI Feedback:</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.feedback}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No detailed scores available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="text-center space-x-4">
        <Button onClick={onStartOver} variant="outline">
          Take Another Interview
        </Button>
        <Button 
          onClick={() => window.print()} 
          variant="secondary"
        >
          Print Results
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Interview completed on {formatTimestamp(summary.completedAt)}
        </p>
        <p className="mt-1">
          This assessment is for practice purposes. Results may vary based on actual interview conditions.
        </p>
      </div>
    </div>
  );
};

export default InterviewSummary;
