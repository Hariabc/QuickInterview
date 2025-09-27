import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import database from '../../services/database';
import { getScoreColor, getRatingEmoji } from '../../utils/helpers';
import { formatTimestamp } from '../../utils/timer';

const CandidateDetails = ({ candidate, onBack, onRefresh }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCandidateData();
  }, [candidate.id]);

  const loadCandidateData = async () => {
    try {
      setIsLoading(true);
      
      // Load chat history
      const messages = await database.getChatMessages(candidate.id);
      setChatHistory(messages);
      
      // Load interview summary
      const summaryMessage = messages.find(msg => msg.type === 'summary');
      if (summaryMessage) {
        setSummary(JSON.parse(summaryMessage.content));
      }
    } catch (error) {
      console.error('Error loading candidate data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  const questions = chatHistory.filter(msg => msg.type === 'question');
  const answers = chatHistory.filter(msg => msg.type === 'answer');

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button onClick={onBack} variant="outline">
            ← Back to List
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {candidate.name || 'Unknown Candidate'}
            </h2>
            <p className="text-gray-600">
              Interview Details & Analysis
            </p>
          </div>
        </div>
        <Button onClick={onRefresh} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Candidate Profile
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{candidate.name || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{candidate.email || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{candidate.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Interview Date</label>
                <p className="text-gray-900">{formatTimestamp(candidate.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  candidate.interviewCompleted 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {candidate.interviewCompleted ? 'Completed' : 'In Progress'}
                </span>
              </div>
            </div>
          </div>

          {/* Overall Score */}
          {candidate.finalScore !== undefined && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Overall Performance
              </h3>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(candidate.finalScore).split(' ')[0]}`}>
                  {candidate.finalScore}
                </div>
                <div className="text-sm text-gray-500 mb-2">Score out of 100</div>
                <div className="text-2xl">
                  {getRatingEmoji(candidate.finalScore >= 90 ? 'Excellent' : candidate.finalScore >= 80 ? 'Very Good' : candidate.finalScore >= 70 ? 'Good' : candidate.finalScore >= 60 ? 'Satisfactory' : 'Needs Improvement')}
                </div>
                <div className="text-sm text-gray-600">
                  {candidate.finalScore >= 90 ? 'Excellent' : candidate.finalScore >= 80 ? 'Very Good' : candidate.finalScore >= 70 ? 'Good' : candidate.finalScore >= 60 ? 'Satisfactory' : 'Needs Improvement'}
                </div>
              </div>
            </div>
          )}

          {/* Interview Summary */}
          {summary && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                AI Summary
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {summary.summary}
              </p>
              
              {summary.strengths && summary.strengths.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Strengths:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {summary.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {summary.areasForImprovement && summary.areasForImprovement.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Areas for Improvement:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {summary.areasForImprovement.map((improvement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">→</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Chat History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Interview Conversation
            </h3>
            
            {chatHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No conversation history available.</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {questions.map((question, index) => {
                  const answer = answers.find(ans => ans.questionNumber === question.questionNumber);
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      {/* Question */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-800">
                            Question {question.questionNumber}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(question.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-900">{question.content}</p>
                      </div>
                      
                      {/* Answer */}
                      {answer && (
                        <div className="pl-4 border-l-2 border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-800">
                              Candidate's Answer
                            </span>
                            {answer.score !== undefined && (
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getScoreColor(answer.score)}`}>
                                Score: {answer.score}/100
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-2">{answer.content}</p>
                          {answer.feedback && (
                            <p className="text-xs text-gray-600 italic">
                              Feedback: {answer.feedback}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
