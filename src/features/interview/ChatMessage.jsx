import React from 'react';
import { getDifficultyColor, getScoreColor } from '../../utils/helpers';

const ChatMessage = ({ 
  type, 
  content, 
  difficulty, 
  questionNumber, 
  score, 
  feedback 
}) => {
  const isQuestion = type === 'question';
  const isAnswer = type === 'answer';

  return (
    <div className={`flex ${isAnswer ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl ${isAnswer ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-3 rounded-lg ${
            isQuestion
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-green-50 border border-green-200'
          }`}
        >
          {/* Question Header */}
          {isQuestion && (
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-blue-800">
                  Question {questionNumber}
                </span>
                {difficulty && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                    {difficulty.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Answer Header */}
          {isAnswer && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">
                Your Answer
              </span>
              {score !== undefined && (
                <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(score)}`}>
                  Score: {score}/100
                </span>
              )}
            </div>
          )}

          {/* Content */}
          <div className={`text-sm ${isQuestion ? 'text-blue-900' : 'text-green-900'}`}>
            {content}
          </div>

          {/* Feedback */}
          {isAnswer && feedback && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800 mb-1">AI Feedback:</p>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    {feedback}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Avatar */}
      <div className={`flex-shrink-0 ${isAnswer ? 'order-1 mr-2' : 'order-2 ml-2'}`}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
            isQuestion ? 'bg-blue-600' : 'bg-green-600'
          }`}
        >
          {isQuestion ? '🤖' : '👤'}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
