import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTimestamp } from '../utils/timer';
import database from '../services/database';

const WelcomeBackModal = ({ sessions, onClose }) => {
  const navigate = useNavigate();

  const handleResumeInterview = async (session) => {
    try {
      // Navigate to interviewee page and pass session data
      navigate('/interviewee', { 
        state: { 
          resumeSession: session,
          candidateId: session.candidateId 
        } 
      });
      onClose();
    } catch (error) {
      console.error('Error resuming interview:', error);
    }
  };

  const handleDiscardSession = async (sessionId) => {
    try {
      await database.updateInterviewSession(sessionId, { status: 'cancelled' });
      onClose();
    } catch (error) {
      console.error('Error discarding session:', error);
    }
  };

  if (!sessions || sessions.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="mt-2 px-7 py-3">
            <h3 className="text-lg font-medium text-gray-900 text-center">
              Welcome Back!
            </h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-sm text-gray-500 text-center">
                You have {sessions.length} unfinished interview{sessions.length > 1 ? 's' : ''}. Would you like to resume?
              </p>
            </div>
          </div>

          <div className="space-y-3 px-4 py-3">
            {sessions.map((session) => (
              <div key={session.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      Interview Session
                    </h4>
                    <p className="text-xs text-gray-500">
                      Started: {formatTimestamp(session.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Progress: {session.currentQuestion || 0} of {session.totalQuestions || 6} questions
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-2">
                    <button
                      onClick={() => handleResumeInterview(session)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Resume
                    </button>
                    <button
                      onClick={() => handleDiscardSession(session.id)}
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="items-center px-4 py-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            >
              Start New Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBackModal;
